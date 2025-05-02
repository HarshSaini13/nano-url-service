const rateLimit = require('express-rate-limit');
const config = require('../config');

/**
 * Rate limiting middleware to prevent abuse
 * Different limits can be set for different routes
 */

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

// More strict limit for URL creation
const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many URLs created, please try again later.',
  },
});

module.exports = {
  apiLimiter,
  createUrlLimiter,
};
