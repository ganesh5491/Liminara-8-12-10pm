/**
 * Product Management Routes
 * Admin routes for product CRUD operations
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-management.controller');

// Product management routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
