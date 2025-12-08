/**
 * Utility Helper Functions
 * Converted from bootstrap.php helper functions
 */

const { v4: uuidv4 } = require('uuid');
const path = require('path');

/**
 * Generate unique ID (UUID v4)
 */
function generateId(prefix = '') {
    const uuid = uuidv4();
    return prefix ? `${prefix}_${uuid}` : uuid;
}

/**
 * Sanitize file path to prevent directory traversal
 */
function sanitizePath(filePath) {
    // Prevent directory traversal
    const sanitized = filePath.replace(/\.\.[\/\\]/g, '');
    return sanitized.replace(/^[\/\\]+/, '');
}

/**
 * Get environment variable with default value
 */
function getEnvVar(key, defaultValue = null) {
    return process.env[key] || defaultValue;
}

/**
 * Format phone number to international format
 */
function formatPhoneNumber(phone) {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with country code
    if (cleaned.startsWith('0')) {
        cleaned = '91' + cleaned.substring(1);
    }

    // If doesn't start with country code, add it
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }

    return cleaned;
}

/**
 * Validate phone number format
 */
function validatePhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    // Should be 10 digits (without country code) or 12 digits (with 91)
    return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Format currency (INR)
 */
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toFixed(2)}`;
}

/**
 * Parse JSON safely
 */
function safeJsonParse(str, defaultValue = null) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return defaultValue;
    }
}

/**
 * Check if value is empty
 */
function isEmpty(value) {
    return value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0);
}

module.exports = {
    generateId,
    sanitizePath,
    getEnvVar,
    formatPhoneNumber,
    validatePhoneNumber,
    validateEmail,
    formatCurrency,
    safeJsonParse,
    isEmpty
};
