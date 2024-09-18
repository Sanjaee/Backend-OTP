// src/routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/resend-verify-token", authController.resendVerificationToken);
router.post("/send-reset-otp", authController.sendPasswordResetOTP);
router.post("/reset-password/:otp", authController.verifyOTPAndResetPassword);

module.exports = router;
