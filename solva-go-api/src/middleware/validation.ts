import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HttpException } from '@/utils/HttpException';

/**
 * Validate request middleware
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      const errorDetails = error.details.reduce((acc: Record<string, string>, detail) => {
        const key = detail.path.join('.');
        acc[key] = detail.message;
        return acc;
      }, {});

      next(new HttpException(400, errorMessage, errorDetails));
      return;
    }

    next();
  };
};

/**
 * Validate query parameters middleware
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      const errorDetails = error.details.reduce((acc: Record<string, string>, detail) => {
        const key = detail.path.join('.');
        acc[key] = detail.message;
        return acc;
      }, {});

      next(new HttpException(400, errorMessage, errorDetails));
      return;
    }

    next();
  };
};

/**
 * Validate path parameters middleware
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      const errorDetails = error.details.reduce((acc: Record<string, string>, detail) => {
        const key = detail.path.join('.');
        acc[key] = detail.message;
        return acc;
      }, {});

      next(new HttpException(400, errorMessage, errorDetails));
      return;
    }

    next();
  };
};