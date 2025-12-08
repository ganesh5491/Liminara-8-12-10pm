/**
 * Main Route Index
 * E-commerce API Routes
 */

const express = require('express');
const router = express.Router();

// Import e-commerce route modules
const authRoutes = require('./routes/auth.routes');
const otpRoutes = require('./routes/otp.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const orderRoutes = require('./routes/order.routes');
const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const contactRoutes = require('./routes/contact.routes');
const paymentRoutes = require('./routes/payment.routes');

// Import admin and delivery routes
const adminRoutes = require('./routes/admin.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const productManagementRoutes = require('./routes/product-management.routes');
const orderManagementRoutes = require('./routes/order-management.routes');
const contentManagementRoutes = require('./routes/content-management.routes');

// Mount routes  
router.use('/auth', authRoutes);
router.use('/auth', otpRoutes); // OTP auth routes under /auth
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/contact', contactRoutes);
router.use('/payment', paymentRoutes);

// Admin and Delivery routes
router.use('/admin', adminRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/admin/products-management', productManagementRoutes);
router.use('/admin/orders-management', orderManagementRoutes);
router.use('/admin/content-management', contentManagementRoutes);

// Payment routes at root level (for backward compatibility)
router.post('/create-razorpay-order', require('./controllers/payment.controller').createRazorpayOrder);
router.post('/verify-razorpay-payment', require('./controllers/payment.controller').verifyRazorpayPayment);

module.exports = router;
