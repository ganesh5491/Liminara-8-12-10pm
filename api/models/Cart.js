/**
 * Cart Model
 * Converted from mysql_operations.php cart functions
 */

const BaseModel = require('./BaseModel');

class Cart extends BaseModel {
    constructor() {
        super('cart_items');
    }

    async getCartItems(userId) {
        const sql = `SELECT ci.*, p.name as product_name, p.price, p.image_url, p.in_stock 
                 FROM cart_items ci 
                 JOIN products p ON ci.product_id = p.id 
                 WHERE ci.user_id = ? 
                 ORDER BY ci.created_at DESC`;

        return await this.fetchAll(sql, [userId]);
    }

    async addToCart(userId, productId, quantity = 1) {
        // Check if item already exists
        const existingSql = 'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?';
        const existing = await this.fetch(existingSql, [userId, productId]);

        if (existing) {
            // Update quantity
            const updateSql = 'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?';
            await this.query(updateSql, [quantity, userId, productId]);
            return await this.fetch(existingSql, [userId, productId]);
        } else {
            // Insert new item
            const id = this.generateId('cart');
            const insertSql = 'INSERT INTO cart_items (id, user_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?, NOW())';
            await this.query(insertSql, [id, userId, productId, quantity]);
            return await this.findById(id);
        }
    }

    async updateQuantity(cartItemId, quantity) {
        const sql = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
        await this.query(sql, [quantity, cartItemId]);
        return await this.findById(cartItemId);
    }

    async removeFromCart(userId, productId) {
        const sql = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
        await this.query(sql, [userId, productId]);
        return true;
    }

    async clearCart(userId) {
        const sql = 'DELETE FROM cart_items WHERE user_id = ?';
        await this.query(sql, [userId]);
        return true;
    }
}

module.exports = new Cart();
