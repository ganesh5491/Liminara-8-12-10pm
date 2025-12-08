/**
 * Contact Model
 * Converted from mysql_operations.php contact inquiry functions
 */

const BaseModel = require('./BaseModel');

class Contact extends BaseModel {
    constructor() {
        super('contact_inquiries');
    }

    async createInquiry(data) {
        const id = this.generateId();
        const sql = `INSERT INTO contact_inquiries (id, first_name, last_name, email, phone, inquiry_type, message, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'new', NOW())`;

        const params = [
            id, data.firstName, data.lastName, data.email,
            data.phone || null, data.inquiryType, data.message
        ];

        await this.query(sql, params);

        return id;
    }

    async getAllInquiries() {
        const sql = 'SELECT * FROM contact_inquiries ORDER BY created_at DESC';
        return await this.fetchAll(sql);
    }

    async updateStatus(id, status) {
        const sql = 'UPDATE contact_inquiries SET status = ? WHERE id = ?';
        await this.query(sql, [status, id]);
        return await this.findById(id);
    }
}

module.exports = new Contact();
