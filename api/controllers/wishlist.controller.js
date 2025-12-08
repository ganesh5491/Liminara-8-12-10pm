/**
 * Wishlist Controller (JSON-based)
 * Uses user.service.js for JSON storage
 */

const userService = require('../services/user.service');
const logger = require('../utils/logger');

class WishlistController {
    /**
     * GET /api/wishlist
     * Get wishlist items for authenticated user
     */
    async getWishlist(req, res, next) {
        try {
            if (!req.user) {
                return res.json({ wishlist: [] });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const wishlist = await userService.getWishlist(identifier);

            res.json({ wishlist });
        } catch (error) {
            logger.error('Get wishlist error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/wishlist
     * Add item to wishlist
     */
    async addToWishlist(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { productId, productName } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const wishlist = await userService.addToWishlist(identifier, productId, productName);

            res.json({ wishlist });
        } catch (error) {
            logger.error('Add to wishlist error:', { error: error.message });
            next(error);
        }
    }

    /**
     * DELETE /api/wishlist
     * Remove item from wishlist
     */
    async removeFromWishlist(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { productId } = req.query;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const wishlist = await userService.removeFromWishlist(identifier, productId);

            res.json({ success: true, wishlist });
        } catch (error) {
            logger.error('Remove from wishlist error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new WishlistController();
