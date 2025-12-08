/**
 * Payment Routes
 * Converted from payment/*.php endpoints
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// GET /api/payment/config - Get Razorpay config
router.get('/config', paymentController.getPaymentConfig);

// POST /api/create-razorpay-order - Create Razorpay order
router.post('/create-razorpay-order', paymentController.createRazorpayOrder);

// POST /api/verify-razorpay-payment - Verify Razorpay payment
router.post('/verify-razorpay-payment', paymentController.verifyRazorpayPayment);

module.exports = router;
