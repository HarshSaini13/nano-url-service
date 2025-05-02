const urlService = require('../services/url.service');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Create a short URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required',
      });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
      });
    }

    const createdBy = req.ip || 'anonymous';
    const url = await urlService.createShortUrl(originalUrl, createdBy);

    const shortUrl = `${config.url.baseUrl}/${url.shortId}`;

    return res.status(201).json({
      success: true,
      data: {
        originalUrl: url.originalUrl,
        shortUrl,
        shortId: url.shortId,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    logger.error(`Error in createShortUrl controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Redirect to the original URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const originalUrl = await urlService.getOriginalUrl(shortId);

    if (!originalUrl) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    return res.redirect(originalUrl);
  } catch (error) {
    logger.error(`Error in redirectToOriginalUrl controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

/**
 * Get URL statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUrlStats = async (req, res) => {
  try {
    const { shortId } = req.params;

    const stats = await urlService.getUrlStats(shortId);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'URL not found',
      });
    }

    const shortUrl = `${config.url.baseUrl}/${stats.shortId}`;

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        shortUrl,
      },
    });
  } catch (error) {
    logger.error(`Error in getUrlStats controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
};
