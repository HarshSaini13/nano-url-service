const winston = require('winston');
const config = require('../config');

// Determine the log level based on environment
// For production, let's set it to 'info' by default unless specifically overridden
// For development, set it to 'debug'
const logLevel = config.server.env === 'production' ? 'debug' : 'debug';

const logger = winston.createLogger({
  level: logLevel, // Use the determined log level
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json() // JSON format for file transports
  ),
  defaultMeta: { service: 'nano-url-service' },
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      // No level set, so it defaults to logger.level (logLevel)
    }),
  ],
});

// Add a console transport that has different formatting for dev vs prod
if (config.server.env === 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug', // Explicitly set to 'info' for production console
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Use JSON format for production console logs
      ),
    })
  );
} else {
  // For non-production (development), use a more readable, colored format
  logger.add(
    new winston.transports.Console({
      level: 'debug', // Debug level for development console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({ format: 'HH:mm:ss' })
      ),
    })
  );
}

module.exports = logger;
