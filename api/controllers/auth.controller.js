/**
 * Authentication Controller
 * Converted from auth/*.php files
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

class AuthController {
    /**
     * GET /api/auth/me
     * Get authenticated user info
     */
    async getMe(req, res, next) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Remove sensitive fields
            delete user.password_hash;

            res.json(user);
        } catch (error) {
            logger.error('Get me error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/auth/sync
     * Login/Register user (from OAuth)
     */
    async sync(req, res, next) {
        try {
            const { email, name, picture, provider } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            // Check if user exists
            let user = await User.findByEmail(email);

            if (!user) {
                // Create new user
                user = await User.createUser({
                    email,
                    name,
                    profileImageUrl: picture,
                    provider: provider || 'oauth'
                });
                logger.info('New user created:', { email });
            }

            // Generate JWT token
            const token = generateToken(user);

            // Remove sensitive fields
            delete user.password_hash;

            res.json({
                user,
                token
            });
        } catch (error) {
            logger.error('Sync error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/auth/logout
     * Logout user (client-side token removal)
     */
    async logout(req, res) {
        // With JWT, logout is handled client-side by removing the token
        res.json({ message: 'Logged out successfully' });
    }

    /**
     * PUT /api/auth/profile
     * Update user profile
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { name, firstName, lastName, phone, address } = req.body;

            const updatedUser = await User.updateProfile(userId, {
                name,
                firstName,
                lastName,
                phone,
                address
            });

            // Remove sensitive fields
            delete updatedUser.password_hash;

            res.json(updatedUser);
        } catch (error) {
            logger.error('Update profile error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new AuthController();
