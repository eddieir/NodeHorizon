const winston = require('winston');
require('winston-daily-rotate-file');

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message, meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta ? JSON.stringify(meta) : ''}`;
});

// Create a logger with daily rotation for different log levels
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Error logs
        new winston.transports.DailyRotateFile({
            filename: 'logs/errors-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '30d'
        }),
        // Info logs
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '30d'
        }),
        // For console logs during development
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    ]
});

// Helper functions for logging at different levels
const logError = (message, meta) => {
    logger.error(message, { meta });
};

const logInfo = (message, meta) => {
    logger.info(message, { meta });
};

module.exports = { logger, logError, logInfo };
