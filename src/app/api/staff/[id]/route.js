import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get staff member with full details
    const staff = await prisma.user.findUnique({
      where: {
        id: id,
        isActive: true,
        role: {
          in: ['STAFF', 'ADMIN']
        }
      },
      include: {
        staffProfile: true,
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            reviewsReceived: true
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json({
        success: false,
        message: 'Staff member not found'
      }, { status: 404 });
    }

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: {
        reviewedUserId: staff.id
      },
      _avg: {
        rating: true
      }
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        reviewedUserId: staff.id
      },
      _count: {
        rating: true
      }
    });

    // Format rating breakdown
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      ratingBreakdown[item.rating] = item._count.rating;
    });

    // Format staff data
    const staffData = {
      id: staff.id,
      name: `${staff.firstName} ${staff.lastName}`,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      profileImage: staff.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face`,
      isActive: staff.isActive,
      createdAt: staff.createdAt,
      
      // Staff profile info
      title: staff.staffProfile?.position || 'Staff Member',
      department: staff.staffProfile?.department || 'General',
      bio: staff.staffProfile?.bio || `Experienced ${staff.role.toLowerCase()} at Solva Travel with passion for creating memorable travel experiences.`,
      specialties: staff.staffProfile?.specialties || ['Customer Service', 'Travel Planning'],
      languages: staff.staffProfile?.languages || ['English'],
      experience: staff.staffProfile?.experience || '1+ years',
      employeeId: staff.staffProfile?.employeeId,
      
      // Review stats
      rating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
      totalReviews: staff._count.reviewsReceived,
      ratingBreakdown,
      
      // All reviews
      reviews: staff.reviewsReceived.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewType: review.reviewType,
        createdAt: review.createdAt,
        reviewerName: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
        reviewerImage: review.reviewer.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
        likes: 0, // Will be implemented when we add likes feature
        dislikes: 0,
        tripType: review.reviewType || 'General',
        destination: 'Thailand' // Mock data for now
      }))
    };

    console.log(`Retrieved staff member: ${staffData.name}`);

    return NextResponse.json({
      success: true,
      message: 'Staff member retrieved successfully',
      data: staffData
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff member error:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
