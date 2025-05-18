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
    // For critical logging, it's better to ensure logger is available
    // Assuming logger is globally available or passed if not.
    logger.error('Redis client not initialized in generateShortId');
    throw new Error('Redis client not initialized');
  }
  const counter = await redisClient.incr('url:counter');
  return base62.encode(counter, config.url.shortUrlLength);
};

/**
 * Create a short URL from an original URL
 * @param {String} originalUrl - The original URL to shorten
 * @param {String} createdBy - User identifier (optional)
 * @returns {Object} - The created URL object
 */
const createShortUrl = async (originalUrl, createdBy = 'anonymous') => {
  logger.error('!!!!!!!!!! CREATE SHORT URL CALLED ON RENDER !!!!!!!!!!'); // Added for testing
  const overallStartTime = process.hrtime();
  let shortIdGenerationTime, dbCheckTime, dbSaveTime, cacheSetTime;

  try {
    logger.info(
      `[createShortUrl] Initiated for: ${originalUrl.substring(0, 50)}...`
    );

    // 1. Check if URL already exists (if this logic is active)
    const dbCheckStartTime = process.hrtime();
    const existingUrl = await Url.findOne({ originalUrl });
    const dbCheckEndTime = process.hrtime(dbCheckStartTime);
    dbCheckTime = (dbCheckEndTime[0] * 1e9 + dbCheckEndTime[1]) / 1e6; // ms
    logger.debug(
      `[createShortUrl] DB originalUrl check took: ${dbCheckTime.toFixed(3)}ms`
    );

    if (existingUrl) {
      logger.info(
        `[createShortUrl] URL already exists: ${
          existingUrl.shortId
        } for ${originalUrl.substring(0, 50)}...`
      );
      const overallEndTime = process.hrtime(overallStartTime);
      const totalTime = (overallEndTime[0] * 1e9 + overallEndTime[1]) / 1e6;
      logger.info(
        `[createShortUrl] Finished existing URL in: ${totalTime.toFixed(3)}ms`
      );
      return existingUrl;
    }

    // 2. Generate a new short ID
    const shortIdGenerationStartTime = process.hrtime();
    const shortId = await generateShortId();
    const shortIdGenerationEndTime = process.hrtime(shortIdGenerationStartTime);
    shortIdGenerationTime =
      (shortIdGenerationEndTime[0] * 1e9 + shortIdGenerationEndTime[1]) / 1e6;
    logger.debug(
      `[createShortUrl] shortId generation (Redis incr + base62) took: ${shortIdGenerationTime.toFixed(
        3
      )}ms`
    );

    // 3. Create new URL document
    const newUrl = new Url({
      originalUrl,
      shortId,
      createdBy,
    });

    // 4. Save to Database
    const dbSaveStartTime = process.hrtime();
    await newUrl.save();
    const dbSaveEndTime = process.hrtime(dbSaveStartTime);
    dbSaveTime = (dbSaveEndTime[0] * 1e9 + dbSaveEndTime[1]) / 1e6;
    logger.debug(`[createShortUrl] DB save took: ${dbSaveTime.toFixed(3)}ms`);

    // 5. Cache the mapping in Redis
    if (redisClient) {
      const cacheSetStartTime = process.hrtime();
      await redisClient.set(`url:${shortId}`, originalUrl, {
        EX: 60 * 60 * 24, // 24 hours expiration
      });
      const cacheSetEndTime = process.hrtime(cacheSetStartTime);
      cacheSetTime = (cacheSetEndTime[0] * 1e9 + cacheSetEndTime[1]) / 1e6;
      logger.debug(
        `[createShortUrl] Redis cache set took: ${cacheSetTime.toFixed(3)}ms`
      );
    }

    const overallEndTime = process.hrtime(overallStartTime);
    const totalTime = (overallEndTime[0] * 1e9 + overallEndTime[1]) / 1e6;
    logger.info(
      `[createShortUrl] Successfully created ${shortId} for ${originalUrl.substring(
        0,
        50
      )}... ` +
        `Total: ${totalTime.toFixed(3)}ms ` +
        `(DBCheck: ${dbCheckTime.toFixed(
          3
        )}ms, GenID: ${shortIdGenerationTime.toFixed(
          3
        )}ms, DBSave: ${dbSaveTime.toFixed(3)}ms, CacheSet: ${
          cacheSetTime ? cacheSetTime.toFixed(3) : 'N/A'
        }ms)`
    );

    return newUrl;
  } catch (error) {
    const overallEndTime = process.hrtime(overallStartTime);
    const totalTime = (overallEndTime[0] * 1e9 + overallEndTime[1]) / 1e6;
    logger.error(
      `[createShortUrl] Error after ${totalTime.toFixed(
        3
      )}ms for ${originalUrl.substring(0, 50)}...: ${error.message}`
    );
    // To ensure all timings are captured in case of an error partway through:
    logger.error(
      `[createShortUrl] Timings before error: ` +
        `DBCheck: ${dbCheckTime ? dbCheckTime.toFixed(3) : 'N/A'}ms, ` +
        `GenID: ${
          shortIdGenerationTime ? shortIdGenerationTime.toFixed(3) : 'N/A'
        }ms, ` +
        `DBSave: ${dbSaveTime ? dbSaveTime.toFixed(3) : 'N/A'}ms, ` +
        `CacheSet: ${cacheSetTime ? cacheSetTime.toFixed(3) : 'N/A'}ms`
    );
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
