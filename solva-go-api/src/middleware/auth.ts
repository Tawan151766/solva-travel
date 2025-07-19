import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { config } from '@/config/env';
import { HttpException } from '@/utils/HttpException';
import { AppDataSource } from '@/config/database';
import { User } from '@/entities/User';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException(401, 'Access token is required');
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(401, 'Access token is required');
    }

    // Verify token
    try {
      const decoded = verifyToken(token, config.jwt.secret);
      if (!decoded || !decoded.userId) {
        throw new HttpException(401, 'Invalid or expired token');
      }

      // Check if user exists and is active
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new HttpException(401, 'User not found or inactive');
      }

      // Attach user to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role
      };

      next();
    } catch (error) {
      throw new HttpException(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new HttpException(401, 'Unauthorized');
      }

      if (!roles.includes(req.user.role)) {
        throw new HttpException(403, 'Forbidden: Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};