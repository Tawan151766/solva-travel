import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    console.log('Staff API called with params:', { page, limit, search });

    // Build where clause for search
    const where = {
      role: 'STAFF',
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { staffProfile: { position: { contains: search, mode: 'insensitive' } } },
          { staffProfile: { department: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    // Get total count for pagination
    const totalStaff = await prisma.user.count({ where });

    // Get staff with pagination
    const staff = await prisma.user.findMany({
      where,
      include: {
        staffProfile: true,
        reviewsReceived: {
          select: {
            rating: true,
            comment: true,
            reviewer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Latest 5 reviews
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Transform data to match frontend expectations
    const transformedStaff = staff.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      title: user.staffProfile?.position || 'Staff Member',
      department: user.staffProfile?.department || 'GENERAL',
      bio: user.staffProfile?.bio || '',
      specializations: user.staffProfile?.specializations || [],
      languages: user.staffProfile?.languages || [],
      rating: user.staffProfile?.rating || 0,
      totalReviews: user.staffProfile?.totalReviews || 0,
      hireDate: user.staffProfile?.hireDate,
      isAvailable: user.staffProfile?.isAvailable || true,
      reviews: user.reviewsReceived.map(review => ({
        rating: review.rating,
        comment: review.comment,
        reviewer: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
        date: review.createdAt,
      })),
    }));

    const totalPages = Math.ceil(totalStaff / limit);

    console.log(`Retrieved ${transformedStaff.length} staff members out of ${totalStaff} total`);

    return NextResponse.json({
      success: true,
      message: 'Staff data retrieved successfully',
      data: {
        staff: transformedStaff,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalStaff,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
