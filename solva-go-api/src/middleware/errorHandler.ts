import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/utils/HttpException';
import { logger } from '@/utils/logger';
import { ValidationError } from 'class-validator';
import { QueryFailedError } from 'typeorm';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error: ${error.message}`, { 
    path: req.path, 
    method: req.method,
    stack: error.stack,
    body: req.body
  });

  // Handle HttpException (custom errors)
  if (error instanceof HttpException) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      errors: error.errors,
      status: error.status
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError' || error instanceof ValidationError || Array.isArray(error) && error[0] instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error instanceof Array ? formatValidationErrors(error) : error.message,
      status: 400
    });
    return;
  }

  // Handle database errors
  if (error instanceof QueryFailedError) {
    // Handle unique constraint violations
    if (error.message.includes('duplicate key value violates unique constraint')) {
      res.status(409).json({
        success: false,
        message: 'Duplicate entry',
        status: 409
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Database error',
      status: 500
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      status: 401
    });
    return;
  }

  // Handle other errors
  const statusCode = (error as any).statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal server error' 
      : message,
    status: statusCode
  });
};

/**
 * Format validation errors from class-validator
 */
const formatValidationErrors = (errors: ValidationError[]): Record<string, string[]> => {
  const formattedErrors: Record<string, string[]> = {};

  errors.forEach(error => {
    const property = error.property;
    const constraints = error.constraints || {};
    
    formattedErrors[property] = Object.values(constraints);
  });

  return formattedErrors;
};