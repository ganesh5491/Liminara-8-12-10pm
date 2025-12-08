/**
 * Product Controller
 * Converted from products/*.php files
 */

const Product = require('../models/Product');
const ProductReview = require('../models/ProductReview');
const logger = require('../utils/logger');

class ProductController {
    /**
     * GET /api/products
     * Get all products with filters
     */
    async getProducts(req, res, next) {
        try {
            const {
                category, subcategory, search, featured, isDeal,
                minPrice, maxPrice, limit, offset
            } = req.query;

            const filters = {};

            if (category) filters.categoryId = category;
            if (subcategory) filters.subcategoryId = subcategory;
            if (search) filters.search = search;
            if (featured !== undefined) filters.featured = featured === 'true';
            if (isDeal !== undefined) filters.isDeal = isDeal === 'true';
            if (minPrice) filters.minPrice = parseFloat(minPrice);
            if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

            let products = await Product.getProducts(filters);

            // Apply pagination if specified
            if (limit || offset) {
                const limitNum = parseInt(limit) || 50;
                const offsetNum = parseInt(offset) || 0;
                products = products.slice(offsetNum, offsetNum + limitNum);
            }

            res.json(products);
        } catch (error) {
            logger.error('Get products error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/products/featured
     * Get featured products
     */
    async getFeaturedProducts(req, res, next) {
        try {
            const products = await Product.getFeaturedProducts();
            res.json(products);
        } catch (error) {
            logger.error('Get featured products error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/products/deals
     * Get deal products
     */
    async getDealProducts(req, res, next) {
        try {
            const products = await Product.getDealProducts();
            res.json(products);
        } catch (error) {
            logger.error('Get deal products error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/products/:id
     * Get single product by ID
     */
    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.getProductById(id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            logger.error('Get product error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/products/:id/reviews
     * Get product reviews
     */
    async getProductReviews(req, res, next) {
        try {
            const { id } = req.params;
            const reviews = await ProductReview.getReviewsByProductId(id);
            res.json(reviews);
        } catch (error) {
            logger.error('Get reviews error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/products/:id/reviews
     * Create product review
     */
    async createProductReview(req, res, next) {
        try {
            const { id } = req.params;
            const { userName, rating, comment, images } = req.body;

            if (!userName || !rating || !comment) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const reviewId = await ProductReview.createReview({
                productId: id,
                userId: req.user?.id || null,
                userName,
                rating,
                comment,
                images: images || []
            });

            res.status(201).json({ id: reviewId, message: 'Review created successfully' });
        } catch (error) {
            logger.error('Create review error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/products/:id/questions
     * Get product questions
     */
    async getProductQuestions(req, res, next) {
        try {
            const { id } = req.params;
            const questions = await ProductReview.getQuestionsByProductId(id);
            res.json(questions);
        } catch (error) {
            logger.error('Get questions error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/products/:id/questions
     * Create product question
     */
    async createProductQuestion(req, res, next) {
        try {
            const { id } = req.params;
            const { userName, userEmail, question } = req.body;

            if (!userName || !question) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const questionId = await ProductReview.createQuestion({
                productId: id,
                userId: req.user?.id || null,
                userName,
                userEmail,
                question
            });

            res.status(201).json({ id: questionId, message: 'Question created successfully' });
        } catch (error) {
            logger.error('Create question error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new ProductController();
