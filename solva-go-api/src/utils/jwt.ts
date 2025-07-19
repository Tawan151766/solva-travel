import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { logger } from './logger';

/**
 * Generate JWT token
 */
export const generateToken = (
  payload: Record<string, any>,
  secret: string = config.jwt.secret,
  expiresIn: string = config.jwt.expiresIn
): string => {
  try {
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    logger.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = (
  token: string,
  secret: string = config.jwt.secret
): any => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Error verifying token:', error);
    throw error;
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Error decoding token:', error);
    throw error;
  }
};