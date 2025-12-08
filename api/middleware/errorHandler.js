/**
 * Centralized Error Handler Middleware
 */

const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    // Log error
    logger.error(err.message, {
        stack: err.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
}

module.exports = errorHandler;
