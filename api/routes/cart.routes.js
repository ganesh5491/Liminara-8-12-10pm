/**
 * Cart Routes
 * Converted from cart/index.php
 */

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { optionalAuth, verifyToken } = require('../middleware/auth');

// GET /api/cart - Get cart items
router.get('/', optionalAuth, cartController.getCart);

// POST /api/cart - Add to cart
router.post('/', verifyToken, cartController.addToCart);

// PUT /api/cart - Update cart item
router.put('/', verifyToken, cartController.updateCartItem);

// DELETE /api/cart - Remove from cart
router.delete('/', verifyToken, cartController.removeFromCart);

module.exports = router;
