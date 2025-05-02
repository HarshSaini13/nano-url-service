require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nano-url',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
  },
  url: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3001',
    shortUrlLength: parseInt(process.env.SHORT_URL_LENGTH || '7', 10),
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
};

module.exports = config;
