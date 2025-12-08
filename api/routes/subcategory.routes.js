/**
 * Subcategory Routes
 * Converted from subcategories/index.php
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// GET /api/subcategories - Get all subcategories
router.get('/', categoryController.getSubcategories);

module.exports = router;
