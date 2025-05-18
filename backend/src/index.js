const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const config = require('./config');
const { connectMongoDB, connectRedis } = require('./config/db');
const logger = require('./utils/logger');
const urlService = require('./services/url.service');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const {
  apiLimiter,
  createUrlLimiter,
} = require('./middleware/rateLimit.middleware');

// Import routes
const urlRoutes = require('./routes/url.routes');
const redirectRoutes = require('./routes/redirect.routes');

// Create Express app
const app = express();

// Trust proxy settings (required for rate limiting behind proxy)
app.set('trust proxy', 1);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging
if (config.server.env === 'development') {
  app.use(morgan('dev'));
} else {
  // Create a write stream for access logs
  const accessLogStream = fs.createWriteStream(
    path.join(logsDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Apply rate limiting to all routes
// app.use(apiLimiter);

// Routes
// app.use('/api/url', createUrlLimiter, urlRoutes);
app.use('/api/url', urlRoutes);
app.use('/', redirectRoutes);

// Serve static files from the frontend build directory in production
if (config.server.env === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Redis
    const redisClient = await connectRedis();
    if (redisClient) {
      // Set Redis client for URL service
      urlService.setRedisClient(redisClient);
    } else {
      logger.warn('Redis connection failed, continuing without caching');
    }

    // Start Express server
    const server = app.listen(config.server.port, () => {
      logger.info(
        `Server running in ${config.server.env} mode on port ${config.server.port}`
      );
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
      });
    });
  } catch (error) {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
