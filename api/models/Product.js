/**
 * Product Model
 * Converted from mysql_operations.php product functions
 */

const BaseModel = require('./BaseModel');

class Product extends BaseModel {
    constructor() {
        super('products');
    }

    async getProducts(filters = {}) {
        let sql = `SELECT p.*, c.name as category_name, s.name as subcategory_name 
               FROM products p 
               LEFT JOIN categories c ON p.category_id = c.id 
               LEFT JOIN subcategories s ON p.subcategory_id = s.id 
               WHERE 1=1`;
        const params = [];

        if (filters.search) {
            sql += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        if (filters.categoryId) {
            sql += ' AND (p.category_id = ? OR p.subcategory_id = ?)';
            params.push(filters.categoryId, filters.categoryId);
        }

        if (filters.subcategoryId) {
            sql += ' AND p.subcategory_id = ?';
            params.push(filters.subcategoryId);
        }

        if (filters.featured !== undefined) {
            sql += ' AND p.featured = ?';
            params.push(filters.featured ? 1 : 0);
        }

        if (filters.isDeal !== undefined) {
            sql += ' AND p.is_deal = ?';
            params.push(filters.isDeal ? 1 : 0);
        }

        if (filters.minPrice) {
            sql += ' AND p.price >= ?';
            params.push(filters.minPrice);
        }

        if (filters.maxPrice) {
            sql += ' AND p.price <= ?';
            params.push(filters.maxPrice);
        }

        sql += ' ORDER BY p.created_at DESC';

        const products = await this.fetchAll(sql, params);

        // Parse JSON fields and convert boolean fields
        return products.map(product => ({
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
            in_stock: Boolean(product.in_stock),
            featured: Boolean(product.featured),
            is_deal: Boolean(product.is_deal)
        }));
    }

    async getProductById(id) {
        const sql = `SELECT p.*, c.name as category_name, s.name as subcategory_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id 
                 LEFT JOIN subcategories s ON p.subcategory_id = s.id 
                 WHERE p.id = ?`;

        const product = await this.fetch(sql, [id]);

        if (product) {
            product.images = product.images ? JSON.parse(product.images) : [];
            product.in_stock = Boolean(product.in_stock);
            product.featured = Boolean(product.featured);
            product.is_deal = Boolean(product.is_deal);
        }

        return product;
    }

    async getFeaturedProducts() {
        return await this.getProducts({ featured: true });
    }

    async getDealProducts() {
        return await this.getProducts({ isDeal: true });
    }
}

module.exports = new Product();
