import nodemailer from 'nodemailer';
import { config } from '@/config/env';
import { logger } from './logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: any[];
}

/**
 * Send email
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // In development mode, just log the email instead of sending
    if (config.env === 'development') {
      logger.info('📧 Email would be sent in production:', {
        to: options.to,
        subject: options.subject,
        from: options.from || `"Solva Travel" <${config.email.from}>`,
      });
      return;
    }

    // Create transporter for production
    const transporter = nodemailer.createTransporter({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true for 465, false for other ports
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: options.from || `"Solva Travel" <${config.email.from}>`,
      to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Generate email verification template
 */
export const generateVerificationEmailTemplate = (name: string, verificationUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { max-width: 150px; }
        .button { display: inline-block; background-color: #FFD700; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email Address</h1>
        </div>
        <p>Hello ${name},</p>
        <p>Thank you for registering with Solva Travel! Please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with Solva Travel, please ignore this email.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Solva Travel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate password reset template
 */
export const generatePasswordResetTemplate = (name: string, resetUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .logo { max-width: 150px; }
        .button { display: inline-block; background-color: #FFD700; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for your Solva Travel account. Click the button below to reset it:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Solva Travel. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};