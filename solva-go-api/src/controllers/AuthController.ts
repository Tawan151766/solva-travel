import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';
import { logger } from '@/utils/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const result = await this.authService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh access token
   */
  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Send password reset email
   */
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      
      res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password with token
   */
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);
      
      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify email address
   */
  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      await this.authService.verifyEmail(token);
      
      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend email verification
   */
  public resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.resendVerification(email);
      
      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}