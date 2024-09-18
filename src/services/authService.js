// src/services/authService.js
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prismaClient");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
} = require("../utils/nodemailer");

const register = async (username, email, password) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (!existingUser.isVerified) {
      // Jika pengguna belum diverifikasi
      throw new Error("User not verified");
    } else {
      // Jika pengguna sudah diverifikasi
      throw new Error("Email already registered");
    }
  }

  // Jika tidak terdaftar, lanjutkan proses registrasi
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate random 6-digit OTP

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken,
    },
  });

  if (user) await sendVerificationEmail(email, username, verificationToken);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 100);
  });
};



const verifyOTP = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.verificationToken !== otp) {
    throw new Error("Invalid OTP or user not found");
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { isVerified: true, verificationToken: null },
  });

  return updatedUser;
};

const resendVerificationToken = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("User is already verified");
  }

  // Generate a new OTP
  const newVerificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Update user with new verification token
  await prisma.user.update({
    where: { email },
    data: { verificationToken: newVerificationToken },
  });

  // Send the verification email again
  await sendVerificationEmail(email, user.username, newVerificationToken);

  return { message: "Verification token resent to email" };
};

// Login Logic
const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if ( !user.isVerified) {
    throw new Error("User not verified or not found");
  }
  

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  setTimeout(async () => {
    try {
      await sendWelcomeEmail(email, user.username);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }, 500);

  return token;
};

const sendPasswordResetOTP = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { email },
    data: { verificationToken: resetToken },
  });

  await sendResetPasswordEmail(email, resetToken); // Kirim email dengan URL reset

  return { message: "Reset password link sent to email" };
};

const resetPassword = async (otp, newPassword) => {
  const user = await prisma.user.findFirst({
    where: { verificationToken: otp },
  });

  if (!user) {
    throw new Error("Invalid OTP or user not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, verificationToken: null },
  });

  return updatedUser;
};

module.exports = {
  register,
  verifyOTP,
  login,
  resendVerificationToken,
  sendPasswordResetOTP,
  resetPassword,
};
