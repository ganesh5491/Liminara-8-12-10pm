/**
 * Authentication Routes
 * Converted from auth/*.php endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');

// GET /api/auth/me - Get authenticated user
router.get('/me', verifyToken, authController.getMe);

// POST /api/auth/sync - Login/Register (OAuth sync)
router.post('/sync', authController.sync);

// POST /api/auth/logout - Logout
router.post('/logout', verifyToken, authController.logout);

// PUT /api/auth/profile - Update profile
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
