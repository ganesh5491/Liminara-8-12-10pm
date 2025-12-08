/**
 * Category Controller
 * Converted from categories/index.php and subcategories/index.php
 */

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const logger = require('../utils/logger');

class CategoryController {
    /**
     * GET /api/categories
     * Get all categories
     */
    async getCategories(req, res, next) {
        try {
            const categories = await Category.getAll();
            res.json(categories);
        } catch (error) {
            logger.error('Get categories error:', { error: error.message });
            next(error);
        }
    }

    /**
     * GET /api/subcategories
     * Get all subcategories or by category ID
     */
    async getSubcategories(req, res, next) {
        try {
            const { categoryId } = req.query;

            const subcategories = categoryId
                ? await Subcategory.getByCategoryId(categoryId)
                : await Subcategory.getAll();

            res.json(subcategories);
        } catch (error) {
            logger.error('Get subcategories error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new CategoryController();
