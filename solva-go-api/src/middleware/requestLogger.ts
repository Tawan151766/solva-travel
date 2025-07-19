import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';

/**
 * Request logger middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Skip logging for health check and static files
  if (req.path.includes('/health') || req.path.startsWith('/uploads/')) {
    return next();
  }

  const start = Date.now();
  const { method, originalUrl, ip } = req;

  // Log request
  logger.info(`${method} ${originalUrl} - Request received`, {
    method,
    url: originalUrl,
    ip,
    userAgent: req.headers['user-agent'],
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    if (statusCode >= 400) {
      logger.warn(`${method} ${originalUrl} - ${statusCode} - ${duration}ms`, {
        method,
        url: originalUrl,
        statusCode,
        duration,
        ip,
      });
    } else {
      logger.info(`${method} ${originalUrl} - ${statusCode} - ${duration}ms`, {
        method,
        url: originalUrl,
        statusCode,
        duration,
        ip,
      });
    }
  });

  next();
};