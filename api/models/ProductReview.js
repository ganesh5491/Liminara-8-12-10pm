/**
 * ProductReview Model
 * Converted from mysql_operations.php product review and question functions
 */

const BaseModel = require('./BaseModel');

class ProductReview extends BaseModel {
    constructor() {
        super('product_reviews');
    }

    async getReviewsByProductId(productId) {
        const sql = 'SELECT * FROM product_reviews WHERE product_id = ? ORDER BY created_at DESC';
        return await this.fetchAll(sql, [productId]);
    }

    async createReview(data) {
        const id = this.generateId();
        const sql = `INSERT INTO product_reviews (id, product_id, user_id, user_name, rating, comment, images, is_verified, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`;

        const params = [
            id, data.productId, data.userId || null, data.userName,
            data.rating, data.comment, JSON.stringify(data.images || [])
        ];

        await this.query(sql, params);

        return id;
    }

    async getQuestionsByProductId(productId) {
        const sql = 'SELECT * FROM product_questions WHERE product_id = ? AND is_public = 1 ORDER BY created_at DESC';
        return await this.fetchAll(sql, [productId]);
    }

    async createQuestion(data) {
        const id = this.generateId();
        const sql = `INSERT INTO product_questions (id, product_id, user_id, user_name, user_email, question, is_public, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`;

        const params = [
            id, data.productId, data.userId || null,
            data.userName, data.userEmail || null, data.question
        ];

        await this.query(sql, params);

        return id;
    }

    async answerQuestion(questionId, answer, answeredBy) {
        const sql = 'UPDATE product_questions SET answer = ?, answered_by = ?, answered_at = NOW(), updated_at = NOW() WHERE id = ?';
        await this.query(sql, [answer, answeredBy, questionId]);
        return true;
    }
}

module.exports = new ProductReview();
