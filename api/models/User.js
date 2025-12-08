/**
 * User Model
 * Converted from mysql_operations.php user functions
 */

const BaseModel = require('./BaseModel');

class User extends BaseModel {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        return await this.fetch(sql, [email]);
    }

    async createUser(data) {
        const id = this.generateId();
        const userData = {
            id: id,
            email: data.email,
            name: data.name || null,
            first_name: data.firstName || data.first_name || null,
            last_name: data.lastName || data.last_name || null,
            phone: data.phone || null,
            address: data.address || null,
            profile_image_url: data.profileImageUrl || data.profile_image_url || null,
            password_hash: data.passwordHash || data.password_hash || null,
            provider: data.provider || null,
            created_at: new Date(),
            updated_at: new Date()
        };

        const sql = `INSERT INTO users (id, email, name, first_name, last_name, phone, address, 
                 profile_image_url, password_hash, provider, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            userData.id, userData.email, userData.name, userData.first_name, userData.last_name,
            userData.phone, userData.address, userData.profile_image_url, userData.password_hash,
            userData.provider, userData.created_at, userData.updated_at
        ];

        await this.query(sql, params);

        return await this.findById(id);
    }

    async updateProfile(userId, data) {
        const updateData = {
            name: data.name,
            first_name: data.firstName || data.first_name,
            last_name: data.lastName || data.last_name,
            phone: data.phone,
            address: data.address,
            updated_at: new Date()
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        return await this.update(userId, updateData);
    }
}

module.exports = new User();
