/**
 * Wishlist Routes
 * Converted from wishlist/index.php
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { optionalAuth, verifyToken } = require('../middleware/auth');

// GET /api/wishlist - Get wishlist items
router.get('/', optionalAuth, wishlistController.getWishlist);

// POST /api/wishlist - Add to wishlist
router.post('/', verifyToken, wishlistController.addToWishlist);

// DELETE /api/wishlist - Remove from wishlist
router.delete('/', verifyToken, wishlistController.removeFromWishlist);

module.exports = router;
