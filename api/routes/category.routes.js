/**
 * Category Routes
 * Converted from categories/index.php and subcategories/index.php
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// GET /api/categories - Get all categories
router.get('/', categoryController.getCategories);

module.exports = router;
