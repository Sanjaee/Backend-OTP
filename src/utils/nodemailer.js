// src/utils/nodemailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Bisa diganti sesuai dengan service yang digunakan
  auth: {
    user: process.env.EMAIL_USER, // Email pengirim
    pass: process.env.EMAIL_PASS, // Password atau app-specific password untuk email
  },
});

const sendVerificationEmail = async (email, username, verificationToken) => {
  const mailOptions = {
    from: `"EZ4 Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Hello ${username}, Your OTP is ${verificationToken} - Verify Your Email Address`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;">
        <header style="background: #f8f9fa; padding: 10px; text-align: center;">
          <h2 style="margin: 0; color: #007bff;">EZ4 Verification</h2>
        </header>
        <main style="padding: 20px;">
          <p>Hello ${username},</p>
          <p>Thank you for signing up with EZ4! We're thrilled to have you on board.</p>
          <p>To ensure the security of your account and access all the features, please verify your email address by using the OTP below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <h1 style="font-size: 24px; color: #333; background: #e9ecef; padding: 20px; border-radius: 5px;">
              ${verificationToken}
            </h1>
          </div>
          <p>Once your email is verified, you'll be ready to dive into EZ4's exciting features.</p>
          <p>If you did not register with us, please ignore this email or contact our support team at support@ez4.com.</p>
          <p>Thank you for choosing EZ4!</p>
        </main>
        <footer style="background: #f8f9fa; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Best regards, <br> EZ4 Team</p>
        </footer>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: `"EZ4 Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome Back, ${username}!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;">
        <header style="background: #f8f9fa; padding: 10px; text-align: center;">
          <h2 style="margin: 0; color: #007bff;">Welcome Back to EZ4!</h2>
        </header>
        <main style="padding: 20px;">
          <p>Hello ${username},</p>
          <p>Welcome back to EZ4! We're excited to have you return.</p>
          <p>If you need any assistance or have any questions, feel free to reach out to our support team.</p>
          <p>Thank you for being a valued member of our community!</p>
        </main>
        <footer style="background: #f8f9fa; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Best regards, <br> EZ4 Team</p>
        </footer>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"EZ4 Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reset Your Password - EZ4`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;">
        <header style="background: #f8f9fa; padding: 10px; text-align: center;">
          <h2 style="margin: 0; color: #007bff;">EZ4 Password Reset</h2>
        </header>
        <main style="padding: 20px;">
          <p>Hello,</p>
          <p>We received a request to reset your password.</p>
          <p>Please click the link below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="font-size: 18px; color: #007bff; text-decoration: none;">Reset Password</a>
          </div>
          <p>If you did not request this reset, please ignore this email or contact our support team at support@ez4.com.</p>
          <p>Thank you,</p>
          <p>EZ4 Team</p>
        </main>
        <footer style="background: #f8f9fa; padding: 10px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Best regards, <br> EZ4 Team</p>
        </footer>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
