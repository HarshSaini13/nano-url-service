const mongoose = require('mongoose');
const { createClient } = require('redis');
const config = require('./index');
const logger = require('../utils/logger');

// MongoDB Connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.db.mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Redis Connection
const connectRedis = async () => {
  let client;
  try {
    // Create Redis client with URL if available, otherwise use host/port
    if (config.db.redis.url) {
      client = createClient({
        url: config.db.redis.url,
      });
    } else {
      client = createClient({
        socket: {
          host: config.db.redis.host,
          port: config.db.redis.port,
        },
        password: config.db.redis.password,
      });
    }

    // Try to connect first before setting up any listeners
    await client.connect();

    // Only set up error listener after successful connection
    client.on('error', (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    logger.info('Redis connected successfully');
    return client;
  } catch (error) {
    // If connection fails, destroy the client completely
    if (client) {
      await client.disconnect().catch(() => {});
      client.removeAllListeners();
      client = null;
    }
    logger.warn(
      `Redis connection failed: ${error.message}, will continue without Redis`
    );
    return null;
  }
};

module.exports = {
  connectMongoDB,
  connectRedis,
};
