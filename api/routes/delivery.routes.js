/**
 * Delivery Routes
 * Routes for delivery agent authentication and operations
 */

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');

// Authentication routes
router.post('/auth/login', deliveryController.login);
router.get('/auth/me', deliveryController.getCurrentAgent);
router.post('/auth/logout', deliveryController.logout);
router.post('/auth/change-password', deliveryController.changePassword);

// Delivery orders and stats
router.get('/orders', deliveryController.getAssignedOrders);
router.put('/orders/:orderId/status', deliveryController.updateOrderStatus);
router.get('/stats', deliveryController.getDeliveryStats);

module.exports = router;
