import Joi from 'joi';

/**
 * Login schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});

/**
 * Register schema
 */
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters',
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters',
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password is required',
    'any.required': 'Confirm password is required',
  }),
  phone: Joi.string().allow('', null),
  profileImage: Joi.string().allow('', null),
}).with('password', 'confirmPassword');

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
    'any.required': 'Token is required',
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password is required',
    'any.required': 'Confirm password is required',
  }),
}).with('password', 'confirmPassword');

/**
 * Verify email schema
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
    'any.required': 'Token is required',
  }),
});

/**
 * Resend verification schema
 */
export const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token is required',
    'any.required': 'Refresh token is required',
  }),
});