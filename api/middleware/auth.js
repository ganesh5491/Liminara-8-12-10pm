/**
 * Authentication Middleware
 * JWT-based authentication (replaces PHP session)
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Verify JWT token from Authorization header
 */
function verifyToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        logger.error('Token verification failed:', { error: error.message });

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }

        return res.status(401).json({ message: 'Authentication failed' });
    }
}

/**
 * Optional authentication - allows both authenticated and anonymous requests
 */
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }

        next();
    } catch (error) {
        // Silently fail for optional auth
        next();
    }
}

/**
 * Generate JWT token
 */
function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture || user.profileImageUrl || user.profile_image_url
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
}

module.exports = {
    verifyToken,
    optionalAuth,
    generateToken
};
