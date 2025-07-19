import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { config } from '@/config/env';

// Create logs directory if it doesn't exist
const logDir = path.dirname(config.logging.file);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger
export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'solva-travel-api' },
  transports: [
    // Write logs to file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: config.logging.file,
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport in development
if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

// Export a stream for Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;