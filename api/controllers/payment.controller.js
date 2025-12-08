/**
 * Payment Controller
 * Converted from payment/*.php files
 */

const paymentService = require('../services/payment.service');
const logger = require('../utils/logger');

class PaymentController {
    /**
     * GET /api/payment/config
     * Get Razorpay public configuration
     */
    async getPaymentConfig(req, res, next) {
        try {
            const config = paymentService.getConfig();
            res.json(config);
        } catch (error) {
            logger.error('Get payment config error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/create-razorpay-order
     * Create Razorpay order
     */
    async createRazorpayOrder(req, res, next) {
        try {
            const { amount, currency, receipt } = req.body;

            if (!amount) {
                return res.status(400).json({ message: 'Amount is required' });
            }

            const result = await paymentService.createOrder(
                parseFloat(amount),
                currency || 'INR',
                receipt
            );

            if (!result.success) {
                return res.status(500).json({ message: result.error });
            }

            res.json(result.order);
        } catch (error) {
            logger.error('Create Razorpay order error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/verify-razorpay-payment
     * Verify Razorpay payment signature
     */
    async verifyRazorpayPayment(req, res, next) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return res.status(400).json({ message: 'Missing payment verification data' });
            }

            const isValid = paymentService.verifyPaymentSignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            if (!isValid) {
                return res.status(400).json({ message: 'Invalid payment signature' });
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id
            });
        } catch (error) {
            logger.error('Verify Razorpay payment error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new PaymentController();
