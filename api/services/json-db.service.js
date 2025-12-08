/**
 * JSON Database Service
 * Handles file-based JSON storage with locking
 */

const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// In-memory lock tracker
const fileLocks = new Map();

class JSONDatabaseService {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
    }

    /**
     * Acquire lock for a file
     */
    async acquireLock(filename, timeout = 5000) {
        const startTime = Date.now();

        while (fileLocks.get(filename)) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`Lock timeout for ${filename}`);
            }
            // Wait 10ms before retrying
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        fileLocks.set(filename, true);
    }

    /**
     * Release lock for a file
     */
    releaseLock(filename) {
        fileLocks.delete(filename);
    }

    /**
     * Read JSON file
     */
    async readJSON(filename) {
        const filePath = path.join(this.dataDir, filename);

        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, return empty object
                return {};
            }
            throw error;
        }
    }

    /**
     * Write JSON file (with locking)
     */
    async writeJSON(filename, data) {
        const filePath = path.join(this.dataDir, filename);

        try {
            await this.acquireLock(filename);

            // Pretty print with 2 spaces
            const jsonString = JSON.stringify(data, null, 2);
            await fs.writeFile(filePath, jsonString, 'utf8');

            logger.info(`Wrote to ${filename}`);
        } catch (error) {
            logger.error(`Error writing ${filename}:`, error);
            throw error;
        } finally {
            this.releaseLock(filename);
        }
    }

    /**
     * Update JSON file (read, modify, write)
     */
    async updateJSON(filename, updateFn) {
        try {
            await this.acquireLock(filename);

            const data = await this.readJSON(filename);
            const updated = updateFn(data);
            await this.writeJSON(filename, updated);

            return updated;
        } catch (error) {
            logger.error(`Error updating ${filename}:`, error);
            throw error;
        } finally {
            this.releaseLock(filename);
        }
    }

    /**
     * Get value from JSON file by key
     */
    async get(filename, key) {
        const data = await this.readJSON(filename);
        return data[key];
    }

    /**
     * Set value in JSON file by key
     */
    async set(filename, key, value) {
        await this.updateJSON(filename, (data) => {
            data[key] = value;
            return data;
        });
    }

    /**
     * Delete key from JSON file
     */
    async delete(filename, key) {
        await this.updateJSON(filename, (data) => {
            delete data[key];
            return data;
        });
    }

    /**
     * Check if key exists
     */
    async has(filename, key) {
        const data = await this.readJSON(filename);
        return key in data;
    }

    /**
     * Get all keys
     */
    async keys(filename) {
        const data = await this.readJSON(filename);
        return Object.keys(data);
    }

    /**
     * Get all values
     */
    async values(filename) {
        const data = await this.readJSON(filename);
        return Object.values(data);
    }

    /**
     * Get all entries
     */
    async entries(filename) {
        const data = await this.readJSON(filename);
        return Object.entries(data);
    }

    /**
     * Find entries matching criteria
     */
    async find(filename, predicate) {
        const data = await this.readJSON(filename);
        const results = [];

        for (const [key, value] of Object.entries(data)) {
            if (predicate(value, key)) {
                results.push({ key, value });
            }
        }

        return results;
    }
}

// Singleton instance
const jsonDB = new JSONDatabaseService();

module.exports = jsonDB;
