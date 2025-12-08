/**
 * Wishlist Model
 * Converted from mysql_operations.php wishlist functions
 */

const BaseModel = require('./BaseModel');

class Wishlist extends BaseModel {
    constructor() {
        super('wishlist_items');
    }

    async getWishlistItems(userId) {
        const sql = `SELECT wi.*, p.name as product_name, p.price, p.image_url, p.in_stock 
                 FROM wishlist_items wi 
                 JOIN products p ON wi.product_id = p.id 
                 WHERE wi.user_id = ? 
                 ORDER BY wi.created_at DESC`;

        return await this.fetchAll(sql, [userId]);
    }

    async addToWishlist(userId, productId) {
        try {
            const id = this.generateId('wish');
            const sql = 'INSERT INTO wishlist_items (id, user_id, product_id, created_at) VALUES (?, ?, ?, NOW())';
            await this.query(sql, [id, userId, productId]);
            return await this.findById(id);
        } catch (error) {
            // Ignore duplicate key errors
            if (error.code === 'ER_DUP_ENTRY') {
                return await this.fetch('SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?', [userId, productId]);
            }
            throw error;
        }
    }

    async removeFromWishlist(userId, productId) {
        const sql = 'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?';
        await this.query(sql, [userId, productId]);
        return true;
    }
}

module.exports = new Wishlist();
