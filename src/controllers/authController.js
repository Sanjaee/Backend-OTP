const authService = require("../services/authService");

// Register User
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await authService.register(username, email, password);
    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    if (error.message === "User not verified") {
      return res.status(403).json({ message: "User not verified. Please verify your email." });
    }
    if (error.message === "Email already registered") {
      return res.status(409).json({ message: "Email already registered and verified." });
    }
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};


// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await authService.verifyOTP(email, otp);
    res.status(200).json({ message: "User verified", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resendVerificationToken = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await authService.resendVerificationToken(email);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // Cek apakah error berasal dari pengguna yang belum terverifikasi atau tidak ditemukan
    if (error.message === "User not verified or not found") {
      return res.status(403).json({
        message:
          "User not verified or does not exist. Please verify your account.",
      });
    }

    // Tangani error lainnya (contoh: password tidak valid)
    res.status(400).json({ message: error.message });
  }
};

// Send Password Reset OTP
const sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await authService.sendPasswordResetOTP(email);
    res.status(200).json(response);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(403).json({ message: "email tidak terdaftar" });
    }
    res.status(400).json({ message: error.message });
  }
};

const verifyOTPAndResetPassword = async (req, res) => {
  const { otp } = req.params; // Ambil OTP dari URL
  const { newPassword } = req.body; // Ambil password baru dari body

  try {
    const user = await authService.resetPassword(otp, newPassword);
    res.status(200).json({ message: "Password reset successful", user });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  register,
  verifyOTP,
  login,
  sendPasswordResetOTP,

  resendVerificationToken,
  verifyOTPAndResetPassword,
};
