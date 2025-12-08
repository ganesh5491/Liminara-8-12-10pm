/**
 * OTP Authentication Routes
 */

const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

// Request OTP for login/registration
router.post('/request-otp', otpController.requestOTP);

// Verify OTP and login/register
router.post('/verify-otp', otpController.verifyOTP);

// Resend OTP
router.post('/resend-otp', otpController.resendOTP);

module.exports = router;
