/**
 * Subcategory Model
 * Converted from mysql_operations.php subcategory functions
 */

const BaseModel = require('./BaseModel');

class Subcategory extends BaseModel {
    constructor() {
        super('subcategories');
    }

    async getAll() {
        const sql = 'SELECT * FROM subcategories ORDER BY name';
        return await this.fetchAll(sql);
    }

    async getByCategoryId(categoryId) {
        const sql = 'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name';
        return await this.fetchAll(sql, [categoryId]);
    }

    async createSubcategory(name, categoryId, description = null, imageUrl = null) {
        const id = this.generateId();
        const sql = `INSERT INTO subcategories (id, name, category_id, description, image_url, created_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`;

        await this.query(sql, [id, name, categoryId, description, imageUrl]);

        return await this.findById(id);
    }
}

module.exports = new Subcategory();
