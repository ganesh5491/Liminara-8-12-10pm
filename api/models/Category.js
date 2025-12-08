/**
 * Category Model
 * Converted from mysql_operations.php category functions
 */

const BaseModel = require('./BaseModel');

class Category extends BaseModel {
    constructor() {
        super('categories');
    }

    async getAll() {
        const sql = 'SELECT * FROM categories ORDER BY name';
        return await this.fetchAll(sql);
    }

    async createCategory(name, description = null) {
        const id = this.generateId();
        const sql = 'INSERT INTO categories (id, name, description, created_at) VALUES (?, ?, ?, NOW())';

        await this.query(sql, [id, name, description]);

        return await this.findById(id);
    }
}

module.exports = new Category();
