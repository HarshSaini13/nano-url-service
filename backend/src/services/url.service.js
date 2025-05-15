const base62 = require('../utils/base62');
const Url = require('../models/url.model');
const config = require('../config');
const logger = require('../utils/logger');

// Redis client will be injected
let redisClient = null;

/**
 * Set the Redis client for caching
 * @param {Object} client - Redis client instance
 */
const setRedisClient = (client) => {
  redisClient = client;
};

/**
 * Generate a unique short ID using Redis counter and base62 encoding
 * @returns {String} - Unique short ID
 */
const generateShortId = async () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }

  // Increment the counter atomically in Redis
  const counter = await redisClient.incr('url:counter');

  // Convert the counter to base62
  return base62.encode(counter);
};

/**
 * Create a short URL from an original URL
 * @param {String} originalUrl - The original URL to shorten
 * @param {String} createdBy - User identifier (optional)
 * @returns {Object} - The created URL object
 */
const createShortUrl = async (originalUrl, createdBy = 'anonymous') => {
  try {
    // Check if URL already exists to avoid duplicates
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return existingUrl;
    }

    // Generate a new short ID
    const shortId = await generateShortId();

    // Create new URL document
    const newUrl = new Url({
      originalUrl,
      shortId,
      createdBy,
    });

    await newUrl.save();

    // Cache the mapping in Redis if available
    if (redisClient) {
      await redisClient.set(`url:${shortId}`, originalUrl, {
        EX: 60 * 60 * 24, // 24 hours expiration
      });
    }

    return newUrl;
  } catch (error) {
    logger.error(`Error creating short URL: ${error.message}`);
    throw error;
  }
};

/**
 * Get the original URL from a short ID
 * @param {String} shortId - The short ID to look up
 * @returns {String} - The original URL
 */
const getOriginalUrl = async (shortId) => {
  try {
    // Try to get from cache first
    if (redisClient) {
      const cachedUrl = await redisClient.get(`url:${shortId}`);
      if (cachedUrl) {
        // Update click count in background
        Url.findOneAndUpdate(
          { shortId },
          { $inc: { clicks: 1 } },
          { new: true }
        ).exec();

        return cachedUrl;
      }
    }

    // If not in cache, get from database
    const url = await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return null;
    }

    // Cache the result for future requests
    if (redisClient) {
      await redisClient.set(`url:${shortId}`, url.originalUrl, {
        EX: 60 * 60 * 24, // 24 hours expiration
      });
    }

    return url.originalUrl;
  } catch (error) {
    logger.error(`Error getting original URL: ${error.message}`);
    throw error;
  }
};

/**
 * Get URL statistics
 * @param {String} shortId - The short ID to get stats for
 * @returns {Object} - URL statistics
 */
const getUrlStats = async (shortId) => {
  try {
    const url = await Url.findOne({ shortId });
    if (!url) {
      return null;
    }

    return {
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      clicks: url.clicks,
      createdAt: url.createdAt,
      createdBy: url.createdBy,
    };
  } catch (error) {
    logger.error(`Error getting URL stats: ${error.message}`);
    throw error;
  }
};

module.exports = {
  setRedisClient,
  createShortUrl,
  getOriginalUrl,
  getUrlStats,
};
