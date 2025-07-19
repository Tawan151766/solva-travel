import { AppDataSource } from '@/config/database';
import { User, UserRole } from '@/entities/User';
import { config } from '@/config/env';
import { HttpException } from '@/utils/HttpException';
import { generateToken, verifyToken } from '@/utils/jwt';
import { comparePassword, hashPassword } from '@/utils/password';
import { sendEmail } from '@/utils/email';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';
import { MoreThan } from 'typeorm';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Register a new user
   */
  public async register(userData: Partial<User>): Promise<Partial<User>> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new HttpException(409, 'Email already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password!);

      // Create verification token
      const emailVerificationToken = uuidv4();

      // Create new user
      const newUser = this.userRepository.create({
        ...userData,
        password: hashedPassword,
        emailVerificationToken,
        role: userData.role || UserRole.USER,
      });

      // Save user to database
      const savedUser = await this.userRepository.save(newUser);

      // Send verification email
      await this.sendVerificationEmail(savedUser.email, emailVerificationToken);

      // Return user without sensitive data
      const { password, emailVerificationToken: token, ...userWithoutSensitiveData } = savedUser;
      return userWithoutSensitiveData;
    } catch (error) {
      logger.error('Error in register service:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  public async login(email: string, password: string): Promise<{ user: Partial<User>; tokens: { accessToken: string; refreshToken: string } }> {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new HttpException(403, 'Account is disabled');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Update last login timestamp
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);

      // Generate tokens
      const accessToken = generateToken(
        { userId: user.id, role: user.role },
        config.jwt.secret,
        config.jwt.expiresIn
      );

      const refreshToken = generateToken(
        { userId: user.id, tokenType: 'refresh' },
        config.jwt.refreshSecret,
        config.jwt.refreshExpiresIn
      );

      // Return user and tokens
      const { password: pwd, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        tokens: { accessToken, refreshToken }
      };
    } catch (error) {
      logger.error('Error in login service:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken, config.jwt.refreshSecret);
      if (!decoded || !decoded.userId || decoded.tokenType !== 'refresh') {
        throw new HttpException(401, 'Invalid refresh token');
      }

      // Find user
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new HttpException(401, 'User not found or inactive');
      }

      // Generate new tokens
      const newAccessToken = generateToken(
        { userId: user.id, role: user.role },
        config.jwt.secret,
        config.jwt.expiresIn
      );

      const newRefreshToken = generateToken(
        { userId: user.id, tokenType: 'refresh' },
        config.jwt.refreshSecret,
        config.jwt.refreshExpiresIn
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      logger.error('Error in refreshToken service:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  public async logout(refreshToken: string): Promise<void> {
    // In a real application, you might want to invalidate the refresh token
    // by adding it to a blacklist in Redis or database
    return;
  }

  /**
   * Send password reset email
   */
  public async forgotPassword(email: string): Promise<void> {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        // Don't reveal that the user doesn't exist
        return;
      }

      // Generate reset token
      const resetToken = uuidv4();
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour

      // Update user with reset token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await this.userRepository.save(user);

      // Send reset email
      await this.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      logger.error('Error in forgotPassword service:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Find user by reset token
      const user = await this.userRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: MoreThan(new Date())
        }
      });

      if (!user) {
        throw new HttpException(400, 'Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password and clear reset token
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await this.userRepository.save(user);
    } catch (error) {
      logger.error('Error in resetPassword service:', error);
      throw error;
    }
  }

  /**
   * Verify email address
   */
  public async verifyEmail(token: string): Promise<void> {
    try {
      // Find user by verification token
      const user = await this.userRepository.findOne({
        where: { emailVerificationToken: token }
      });

      if (!user) {
        throw new HttpException(400, 'Invalid verification token');
      }

      // Update user verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      await this.userRepository.save(user);
    } catch (error) {
      logger.error('Error in verifyEmail service:', error);
      throw error;
    }
  }

  /**
   * Resend email verification
   */
  public async resendVerification(email: string): Promise<void> {
    try {
      // Find user by email
      const user = await this.userRepository.findOne({
        where: { email }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (user.isEmailVerified) {
        throw new HttpException(400, 'Email already verified');
      }

      // Generate new verification token
      const emailVerificationToken = uuidv4();
      user.emailVerificationToken = emailVerificationToken;
      await this.userRepository.save(user);

      // Send verification email
      await this.sendVerificationEmail(email, emailVerificationToken);
    } catch (error) {
      logger.error('Error in resendVerification service:', error);
      throw error;
    }
  }

  /**
   * Send verification email
   */
  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const emailContent = `
      <h1>Email Verification</h1>
      <p>Thank you for registering with Solva Travel!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Verify Your Email - Solva Travel',
      html: emailContent
    });
  }

  /**
   * Send password reset email
   */
  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const emailContent = `
      <h1>Password Reset</h1>
      <p>You requested a password reset for your Solva Travel account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset - Solva Travel',
      html: emailContent
    });
  }
}