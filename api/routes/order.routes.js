/**
 * Order Routes
 * Converted from orders/*.php endpoints
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth');

// GET /api/orders - Get orders
router.get('/', verifyToken, orderController.getOrders);

// POST /api/orders - Create order
router.post('/', verifyToken, orderController.createOrder);

// POST /api/orders/direct-checkout - Direct checkout
router.post('/direct-checkout', optionalAuth, orderController.directCheckout);

// GET /api/orders/:id - Get single order
router.get('/:id', orderController.getOrderById);

// POST /api/orders/:id/cancel - Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
