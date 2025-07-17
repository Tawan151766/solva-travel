import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Verify JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.verify(token, secret);
};

export async function PUT(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = verifyToken(token);
    } catch (tokenError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password and new password are required'
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'New password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect'
      }, { status: 400 });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json({
        success: false,
        message: 'New password must be different from current password'
      }, { status: 400 });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcryptjs.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}