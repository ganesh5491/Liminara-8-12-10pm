/**
 * Order Controller (JSON-based)
 * Uses user.service.js for JSON storage
 */

const userService = require('../services/user.service');
const emailService = require('../services/email.service');
const SmsService = require('../services/sms.service');
const { generateId } = require('../utils/helpers');
const logger = require('../utils/logger');

class OrderController {
    /**
     * GET /api/orders
     * Get orders for authenticated user
     */
    async getOrders(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const orders = await userService.getOrders(identifier);

            res.json({ orders });
        } catch (error) {
            logger.error('Get orders error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/orders/:id
     * Get single order by ID
     */
    async getOrderById(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { id } = req.params;

            const order = await userService.getOrder(identifier, id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.json({ order });
        } catch (error) {
            logger.error('Get order error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/orders
     * Create new order from cart
     */
    async createOrder(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const {
                total, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature,
                customerName, customerPhone, customerEmail, shippingAddress, pincode
            } = req.body;

            // Get cart items
            const cart = await userService.getCart(identifier);

            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            // Create order
            const orderData = {
                orderId: generateId('order'),
                items: cart,
                total,
                paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
                orderStatus: 'pending',
                shippingAddress,
                customerName,
                customerPhone,
                customerEmail,
                pincode,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            };

            const order = await userService.addOrder(identifier, orderData);

            // Clear cart after order
            await userService.clearCart(identifier);

            // Send confirmation email
            await this.sendOrderConfirmationEmail(order);

            // Send confirmation SMS
            await SmsService.sendOrderConfirmationSms({
                orderId: order.orderId,
                total: order.total,
                customerPhone: order.customerPhone
            });

            res.status(201).json({ success: true, order });
        } catch (error) {
            logger.error('Create order error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/orders/direct-checkout
     * Create order directly (without cart) - for Buy Now
     */
    async directCheckout(req, res, next) {
        try {
            const {
                identifier, items, total, paymentMethod, razorpayOrderId, razorpayPaymentId,
                razorpaySignature, customerName, customerPhone, customerEmail, shippingAddress, pincode
            } = req.body;

            if (!identifier) {
                return res.status(400).json({ message: 'User identifier is required' });
            }

            // Create or get user
            let user = await userService.getUserByIdentifier(identifier);

            if (!user) {
                // Create new user
                user = await userService.createUser({
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone,
                    address: shippingAddress
                });
            }

            // Create order
            const orderData = {
                orderId: generateId('order'),
                items,
                total,
                paymentMethod,
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
                orderStatus: 'pending',
                shippingAddress,
                customerName,
                customerPhone,
                customerEmail,
                pincode,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            };

            const order = await userService.addOrder(identifier, orderData);

            // Send confirmation email
            await this.sendOrderConfirmationEmail(order);

            // Send confirmation SMS
            await SmsService.sendOrderConfirmationSms({
                orderId: order.orderId,
                total: order.total,
                customerPhone: order.customerPhone
            });

            res.status(201).json({ success: true, order });
        } catch (error) {
            logger.error('Direct checkout error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/orders/:id/cancel
     * Cancel order
     */
    async cancelOrder(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { id } = req.params;

            const order = await userService.getOrder(identifier, id);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
                return res.status(400).json({ message: 'Order cannot be cancelled' });
            }

            const updatedOrder = await userService.updateOrderStatus(identifier, id, 'cancelled');

            res.json({ success: true, order: updatedOrder });
        } catch (error) {
            logger.error('Cancel order error:', { error: error.message });
            next(error);
        }
    }

    /**
     * Helper: Send order confirmation email
     */
    async sendOrderConfirmationEmail(order) {
        try {
            const itemsList = order.items.map(item =>
                `- ${item.productName || item.productId} x ${item.quantity} - ₹${item.price}`
            ).join('\n');

            const htmlBody = `
        <h2>Order Confirmation</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order has been confirmed!</p>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Total Amount:</strong> ₹${order.total}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
        <p><strong>Items:</strong></p>
        <pre>${itemsList}</pre>
        <p>Thank you for shopping with Liminara!</p>
      `;

            await emailService.sendMail(
                order.customerEmail || process.env.ADMIN_EMAIL,
                'Order Confirmation - Liminara',
                htmlBody
            );
        } catch (error) {
            logger.error('Email sending failed:', { error: error.message });
        }
    }
}

module.exports = new OrderController();
