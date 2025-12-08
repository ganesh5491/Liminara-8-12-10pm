/**
 * MySQL Database Connection
 * Converted from mysql_connection.php
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (this.pool) {
      return this.pool;
    }

    try {
      // Get database credentials from environment variables
      let host = process.env.DB_HOST || 'localhost';
      const port = process.env.DB_PORT || '3306';
      const database = process.env.DB_NAME;
      const user = process.env.DB_USER;
      const password = process.env.DB_PASSWORD;

      if (!database || !user || !password) {
        throw new Error('Database credentials not found in environment variables');
      }

      // Defensive parsing: handle cases where host contains port or scheme
      if (host.startsWith('http://')) {
        host = host.substring(7);
        console.warn('Warning: Stripped http:// scheme from DB_HOST');
      }
      if (host.startsWith('https://')) {
        host = host.substring(8);
        console.warn('Warning: Stripped https:// scheme from DB_HOST');
      }

      // Create connection pool
      this.pool = mysql.createPool({
        host: host,
        port: parseInt(port),
        user: user,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        timezone: '+05:30' // Asia/Kolkata
      });

      // Test connection
      const connection = await this.pool.getConnection();
      console.log(`✅ MySQL connected successfully to ${host}:${port}/${database}`);
      connection.release();

      return this.pool;
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async query(sql, params = []) {
    try {
      const pool = await this.connect();
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Query failed:', error.message);
      throw error;
    }
  }

  async fetch(sql, params = []) {
    const results = await this.query(sql, params);
    return results[0] || null;
  }

  async fetchAll(sql, params = []) {
    return await this.query(sql, params);
  }

  async testConnection() {
    try {
      const result = await this.fetch('SELECT 1 as test');
      return result && result.test === 1;
    } catch (error) {
      return false;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database connection pool closed');
    }
  }
}

// Singleton instance
const db = new Database();

// Export database instance and helper functions
module.exports = {
  db,
  query: (sql, params) => db.query(sql, params),
  fetch: (sql, params) => db.fetch(sql, params),
  fetchAll: (sql, params) => db.fetchAll(sql, params),
  testConnection: () => db.testConnection()
};
