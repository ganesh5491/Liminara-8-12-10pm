/**
 * Order Model
 * Converted from mysql_operations.php order functions
 */

const BaseModel = require('./BaseModel');

class Order extends BaseModel {
    constructor() {
        super('orders');
    }

    async createOrder(data) {
        const id = this.generateId('order');
        const sql = `INSERT INTO orders (id, user_id, total, status, payment_id, payment_status, payment_method, 
                     razorpay_order_id, razorpay_payment_id, razorpay_signature, customer_name, 
                     customer_phone, customer_email, shipping_address, pincode, tracking_id, 
                     created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

        const params = [
            id, data.userId, data.total, data.status || 'pending',
            data.paymentId || null, data.paymentStatus || 'pending', data.paymentMethod || null,
            data.razorpayOrderId || null, data.razorpayPaymentId || null, data.razorpaySignature || null,
            data.customerName, data.customerPhone, data.customerEmail || null,
            data.shippingAddress, data.pincode, data.trackingId || null
        ];

        await this.query(sql, params);

        return await this.findById(id);
    }

    async getOrdersByUserId(userId) {
        const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
        return await this.fetchAll(sql, [userId]);
    }

    async addOrderItems(orderItems) {
        for (const item of orderItems) {
            const id = this.generateId('item');
            const sql = 'INSERT INTO order_items (id, order_id, product_id, quantity, price, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
            await this.query(sql, [id, item.orderId, item.productId, item.quantity, item.price]);
        }
    }

    async getOrderItems(orderId) {
        const sql = `SELECT oi.*, p.name as product_name, p.image_url 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`;
        return await this.fetchAll(sql, [orderId]);
    }

    async updateOrderStatus(orderId, status) {
        const sql = 'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?';
        await this.query(sql, [status, orderId]);
        return await this.findById(orderId);
    }

    async updatePaymentStatus(orderId, paymentStatus, paymentId = null, razorpayPaymentId = null, razorpaySignature = null) {
        const sql = `UPDATE orders SET payment_status = ?, payment_id = ?, razorpay_payment_id = ?, 
                 razorpay_signature = ?, updated_at = NOW() WHERE id = ?`;
        await this.query(sql, [paymentStatus, paymentId, razorpayPaymentId, razorpaySignature, orderId]);
        return await this.findById(orderId);
    }
}

module.exports = new Order();
