/**
 * Product Routes
 * Converted from products/*.php endpoints
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { optionalAuth } = require('../middleware/auth');

// GET /api/products - Get all products
router.get('/', productController.getProducts);

// GET /api/products/featured - Get featured products
router.get('/featured', productController.getFeaturedProducts);

// GET /api/products/deals - Get deal products
router.get('/deals', productController.getDealProducts);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProductById);

// GET /api/products/:id/reviews - Get product reviews
router.get('/:id/reviews', productController.getProductReviews);

// POST /api/products/:id/reviews - Create product review
router.post('/:id/reviews', optionalAuth, productController.createProductReview);

// GET /api/products/:id/questions - Get product questions
router.get('/:id/questions', productController.getProductQuestions);

// POST /api/products/:id/questions - Create product question
router.post('/:id/questions', optionalAuth, productController.createProductQuestion);

module.exports = router;
