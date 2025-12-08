/**
 * Base Model Class
 * Provides common database operations
 */

const { db } = require('../config/db');
const { generateId } = require('../utils/helpers');

class BaseModel {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = db;
    }

    async query(sql, params = []) {
        return await this.db.query(sql, params);
    }

    async fetch(sql, params = []) {
        return await this.db.fetch(sql, params);
    }

    async fetchAll(sql, params = []) {
        return await this.db.fetchAll(sql, params);
    }

    async findById(id) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        return await this.fetch(sql, [id]);
    }

    async findAll(conditions = {}, orderBy = 'id DESC', limit = null) {
        let sql = `SELECT * FROM ${this.tableName}`;
        const params = [];

        if (Object.keys(conditions).length > 0) {
            const whereClauses = Object.keys(conditions).map(key => `${key} = ?`);
            sql += ` WHERE ${whereClauses.join(' AND ')}`;
            params.push(...Object.values(conditions));
        }

        sql += ` ORDER BY ${orderBy}`;

        if (limit) {
            sql += ` LIMIT ${parseInt(limit)}`;
        }

        return await this.fetchAll(sql, params);
    }

    async create(data) {
        const id = data.id || generateId();
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = columns.map(() => '?').join(', ');

        const sql = `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;

        await this.query(sql, values);

        return await this.findById(id);
    }

    async update(id, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClauses = columns.map(col => `${col} = ?`).join(', ');

        const sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = ?`;

        await this.query(sql, [...values, id]);

        return await this.findById(id);
    }

    async delete(id) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        await this.query(sql, [id]);
        return true;
    }

    generateId(prefix = '') {
        return generateId(prefix);
    }
}

module.exports = BaseModel;
