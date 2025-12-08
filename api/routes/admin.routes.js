/**
 * Admin Routes
 * Routes for admin authentication and management
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Authentication routes
router.post('/auth/login', adminController.login);
router.get('/auth/me', adminController.getCurrentAdmin);
router.post('/auth/logout', adminController.logout);
router.post('/auth/change-password', adminController.changePassword);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// Admin users management
router.get('/users', adminController.getAdminUsers);
router.post('/users', adminController.addAdminUser);

module.exports = router;
