const express = require('express');
const urlController = require('../controllers/url.controller');

const router = express.Router();

/**
 * @route   GET /:shortId
 * @desc    Redirect to the original URL
 * @access  Public
 */
router.get('/:shortId', urlController.redirectToOriginalUrl);

module.exports = router;
