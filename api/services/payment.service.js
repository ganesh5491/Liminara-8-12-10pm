/**
 * Payment Service (Razorpay)
 * Converted from payment PHP files
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('../utils/logger');
require('dotenv').config();

class PaymentService {
    constructor() {
        // Use test credentials in development, production credentials in production
        const isDevelopment = process.env.NODE_ENV !== 'production';

        const keyId = isDevelopment
            ? (process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID)
            : process.env.RAZORPAY_KEY_ID;

        const keySecret = isDevelopment
            ? (process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET)
            : process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            logger.warn('Razorpay credentials not configured');
            this.instance = null;
        } else {
            this.instance = new Razorpay({
                key_id: keyId,
                key_secret: keySecret
            });
            this.keySecret = keySecret;
            logger.info('Razorpay service configured');
        }
    }

    /**
     * Get Razorpay public configuration
     */
    getConfig() {
        const isDevelopment = process.env.NODE_ENV !== 'production';

        const keyId = isDevelopment
            ? (process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID)
            : process.env.RAZORPAY_KEY_ID;

        return {
            keyId: keyId,
            currency: 'INR',
            companyName: 'Liminara',
            description: 'Payment for your order',
            image: 'https://liminara.com/logo.png'
        };
    }

    /**
     * Create Razorpay order
     */
    async createOrder(amount, currency = 'INR', receipt = null) {
        try {
            if (!this.instance) {
                throw new Error('Razorpay not configured');
            }

            const options = {
                amount: Math.round(amount * 100), // Convert to paise
                currency: currency,
                receipt: receipt || `receipt_${Date.now()}`,
                payment_capture: 1 // Auto capture
            };

            const order = await this.instance.orders.create(options);

            logger.info('Razorpay order created:', { orderId: order.id, amount: order.amount });

            return {
                success: true,
                order: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    receipt: order.receipt
                }
            };
        } catch (error) {
            logger.error('Razorpay order creation failed:', { error: error.message });

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verify Razorpay payment signature
     */
    verifyPaymentSignature(orderId, paymentId, signature) {
        try {
            if (!this.keySecret) {
                throw new Error('Razorpay key secret not configured');
            }

            const body = orderId + '|' + paymentId;
            const expectedSignature = crypto
                .createHmac('sha256', this.keySecret)
                .update(body)
                .digest('hex');

            const isValid = expectedSignature === signature;

            if (isValid) {
                logger.success('Payment signature verified successfully', {
                    orderId,
                    paymentId
                });
            } else {
                logger.error('Payment signature verification failed', {
                    orderId,
                    paymentId
                });
            }

            return isValid;
        } catch (error) {
            logger.error('Payment verification error:', { error: error.message });
            return false;
        }
    }

    /**
     * Fetch payment details
     */
    async getPaymentDetails(paymentId) {
        try {
            if (!this.instance) {
                throw new Error('Razorpay not configured');
            }

            const payment = await this.instance.payments.fetch(paymentId);

            return {
                success: true,
                payment: payment
            };
        } catch (error) {
            logger.error('Failed to fetch payment details:', { error: error.message });

            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Singleton instance
const paymentService = new PaymentService();

module.exports = paymentService;
