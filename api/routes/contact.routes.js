/**
 * Contact Routes
 * Converted from contact/index.php
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

// POST /api/contact - Submit contact inquiry
router.post('/', contactController.submitContact);

module.exports = router;
