/**
 * Logger Utility
 * Converted from bootstrap.php logError function
 */

const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../storage/logs');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    formatTimestamp() {
        const now = new Date();
        return now.toISOString().replace('T', ' ').substring(0, 19);
    }

    writeLog(level, message, context = {}) {
        const timestamp = this.formatTimestamp();
        const contextStr = Object.keys(context).length > 0 ? ` | Context: ${JSON.stringify(context)}` : '';
        const logEntry = `[${timestamp}] [${level}] ${message}${contextStr}\n`;

        const logFile = path.join(this.logsDir, 'errors.log');

        try {
            fs.appendFileSync(logFile, logEntry);
        } catch (error) {
            console.error('Failed to write to log file:', error);
        }

        // Also log to console
        if (level === 'ERROR') {
            console.error(logEntry.trim());
        } else if (level === 'WARN') {
            console.warn(logEntry.trim());
        } else {
            console.log(logEntry.trim());
        }
    }

    error(message, context = {}) {
        this.writeLog('ERROR', message, context);
    }

    warn(message, context = {}) {
        this.writeLog('WARN', message, context);
    }

    info(message, context = {}) {
        this.writeLog('INFO', message, context);
    }

    success(message, context = {}) {
        this.writeLog('SUCCESS', message, context);
    }
}

// Singleton instance
const logger = new Logger();

module.exports = logger;
