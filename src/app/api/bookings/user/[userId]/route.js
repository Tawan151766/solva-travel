import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/nextauth.js';

// GET /api/bookings/user/[userId] - Get bookings for specific user
export async function GET(request, { params }) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    // Fallback to JWT token
    if (!currentUserId) {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const tokenUserId = decoded.userId;
          // Only allow access if token matches requested user
          if (tokenUserId !== userId) {
            return NextResponse.json(
              { success: false, error: 'Access denied' },
              { status: 403 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { success: false, error: 'Invalid token' },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
    } else if (currentUserId !== userId) {
      // Check if current user has access to this user's bookings
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    const where = {
      userId,
      ...(status && { status })
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: {
          select: {
            id: true,
            name: true,
            location: true,
            duration: true,
            imageUrl: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        assignedStaff: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.booking.count({ where });

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
