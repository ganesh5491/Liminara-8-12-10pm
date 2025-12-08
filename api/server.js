/**
 * Express Server Configuration
 * Converted from bootstrap.php
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Define base paths
global.BASE_PATH = path.dirname(__dirname);
global.API_PATH = __dirname;
global.STORAGE_PATH = path.join(__dirname, 'storage');
global.CONFIG_PATH = path.join(__dirname, 'config');
global.DATABASE_PATH = path.join(__dirname, 'database');
global.TEMPLATES_PATH = path.join(__dirname, 'templates');

// Create storage directories if they don't exist
const storageDirs = [
    global.STORAGE_PATH,
    path.join(global.STORAGE_PATH, 'data'),
    path.join(global.STORAGE_PATH, 'logs'),
    path.join(global.STORAGE_PATH, 'uploads')
];

storageDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logger.info(`Created directory: ${dir}`);
    }
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        query: req.query,
        body: Object.keys(req.body).length > 0 ? '(body present)' : '(no body)'
    });
    next();
});

// Import routes
const routes = require('./index');
app.use('/api', routes);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(global.STORAGE_PATH, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Endpoint not found',
        path: req.path
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.API_PORT || 5001;

app.listen(PORT, () => {
    logger.success(`✅ API Server listening on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

module.exports = app;
