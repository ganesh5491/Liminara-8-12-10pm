/**
 * Cart Controller (JSON-based)
 * Uses user.service.js for JSON storage
 */

const userService = require('../services/user.service');
const logger = require('../utils/logger');

class CartController {
    /**
     * GET /api/cart
     * Get cart items for authenticated user
     */
    async getCart(req, res, next) {
        try {
            if (!req.user) {
                return res.json({ cart: [] });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const cart = await userService.getCart(identifier);

            res.json({ cart });
        } catch (error) {
            logger.error('Get cart error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/cart
     * Add item to cart
     */
    async addToCart(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { productId, productName, quantity, price, imageUrl } = req.body;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const cart = await userService.addToCart(identifier, {
                productId,
                productName,
                quantity: quantity || 1,
                price,
                imageUrl
            });

            res.json({ cart });
        } catch (error) {
            logger.error('Add to cart error:', { error: error.message });
            next(error);
        }
    }

    /**
     * PUT /api/cart
     * Update cart item quantity
     */
    async updateCartItem(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { productId, quantity } = req.body;

            if (!productId || quantity === undefined) {
                return res.status(400).json({ message: 'Product ID and quantity are required' });
            }

            const cart = await userService.updateCartItem(identifier, productId, quantity);

            res.json({ cart });
        } catch (error) {
            logger.error('Update cart error:', { error: error.message });
            next(error);
        }
    }

    /**
     * DELETE /api/cart
     * Remove item from cart
     */
    async removeFromCart(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            const identifier = req.user.identifier || req.user.phone || req.user.email;
            const { productId } = req.query;

            if (!productId) {
                return res.status(400).json({ message: 'Product ID is required' });
            }

            const cart = await userService.removeFromCart(identifier, productId);

            res.json({ success: true, cart });
        } catch (error) {
            logger.error('Remove from cart error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new CartController();
