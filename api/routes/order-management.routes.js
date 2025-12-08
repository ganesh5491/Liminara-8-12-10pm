/**
 * Order Management Routes
 * Admin routes for order operations
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-management.controller');

// Order management routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/:id/assign-delivery', orderController.assignDeliveryAgent);
router.delete('/:id/cancel', orderController.cancelOrder);

// Delivery agents list
router.get('/delivery-agents/list', orderController.getDeliveryAgents);

module.exports = router;
