import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// Verify JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.verify(token, secret);
};

export async function POST(request) {
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
    const decoded = verifyToken(token);

    const body = await request.json();
    const { 
      reviewedUserId, 
      rating, 
      title, 
      comment, 
      reviewType = 'SERVICE', 
      bookingId 
    } = body;

    // Validation
    if (!reviewedUserId || !rating) {
      return NextResponse.json({
        success: false,
        message: 'Reviewed user ID and rating are required'
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        message: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // Verify reviewed user exists and is staff
    const reviewedUser = await prisma.user.findUnique({
      where: { id: reviewedUserId },
      include: { staffProfile: true }
    });

    if (!reviewedUser) {
      return NextResponse.json({
        success: false,
        message: 'Reviewed user not found'
      }, { status: 404 });
    }

    if (!['STAFF', 'ADMIN'].includes(reviewedUser.role)) {
      return NextResponse.json({
        success: false,
        message: 'You can only review staff members'
      }, { status: 400 });
    }

    // Prevent self-review
    if (decoded.userId === reviewedUserId) {
      return NextResponse.json({
        success: false,
        message: 'You cannot review yourself'
      }, { status: 400 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        reviewerId: decoded.userId,
        reviewedUserId,
        rating,
        title,
        comment,
        reviewType,
        bookingId,
        isPublic: true,
        isVerified: false
      },
      include: {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        reviewedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        booking: true
      }
    });

    // Update staff profile rating
    const reviews = await prisma.review.findMany({
      where: { reviewedUserId },
      select: { rating: true }
    });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / reviews.length;

    await prisma.staffProfile.update({
      where: { userId: reviewedUserId },
      data: {
        rating: averageRating,
        totalReviews: reviews.length
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    }, { status: 201 });

  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type'); // 'given' or 'received'
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    let where = {};
    let include = {};

    if (type === 'given') {
      where = { reviewerId: userId };
      include = {
        reviewedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            staffProfile: {
              select: {
                position: true,
                department: true
              }
            }
          }
        },
        booking: true
      };
    } else {
      where = { reviewedUserId: userId };
      include = {
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        booking: true
      };
    }

    const reviews = await prisma.review.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { reviews }
    }, { status: 200 });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
