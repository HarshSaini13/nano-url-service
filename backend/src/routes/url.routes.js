const express = require('express');
const urlController = require('../controllers/url.controller');

const router = express.Router();

/**
 * @route   POST /api/url
 * @desc    Create a short URL
 * @access  Public
 */
router.post('/', urlController.createShortUrl);

/**
 * @route   GET /api/url/:shortId/stats
 * @desc    Get URL statistics
 * @access  Public
 */
router.get('/:shortId/stats', urlController.getUrlStats);

module.exports = router;