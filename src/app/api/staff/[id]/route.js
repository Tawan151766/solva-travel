import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual staff API called for ID:', id);

    // Find the staff member by ID
    const user = await prisma.user.findUnique({
      where: { 
        id: id,
        role: 'STAFF' 
      },
      include: {
        staffProfile: true,
        reviewsReceived: {
          select: {
            id: true,
            rating: true,
            comment: true,
            reviewType: true,
            reviewer: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Staff member not found'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    const staffWithReviews = {
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
      employeeId: user.staffProfile?.employeeId,
      reviews: user.reviewsReceived.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewType: review.reviewType,
        reviewer: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
        reviewerImage: review.reviewer.profileImage,
        date: review.createdAt,
      })),
    };

    console.log(`Retrieved staff member: ${staffWithReviews.name} with ${staffWithReviews.reviews.length} reviews`);

    return NextResponse.json({
      success: true,
      message: 'Staff member retrieved successfully',
      data: staffWithReviews
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff member error:', error);
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
