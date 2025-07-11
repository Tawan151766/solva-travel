import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const role = searchParams.get('role') || '';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = {
      isActive: true,
      role: {
        in: ['STAFF', 'ADMIN'] // Only show staff and admin users
      }
    };

    // Add search filter
    if (search) {
      whereConditions.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add role filter
    if (role && role !== 'ALL') {
      whereConditions.role = role;
    }

    // Get staff with their profiles and reviews
    const staff = await prisma.user.findMany({
      where: whereConditions,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    });

    // Calculate average ratings for each staff member
    const staffWithRatings = await Promise.all(
      staff.map(async (member) => {
        const avgRating = await prisma.review.aggregate({
          where: {
            reviewedUserId: member.id
          },
          _avg: {
            rating: true
          }
        });

        return {
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          phone: member.phone,
          role: member.role,
          profileImage: member.profileImage,
          isActive: member.isActive,
          createdAt: member.createdAt,
          
          // Staff profile info
          title: member.staffProfile?.position || 'Staff Member',
          department: member.staffProfile?.department || 'General',
          bio: member.staffProfile?.bio || `Experienced ${member.role.toLowerCase()} at Solva Travel`,
          specialties: member.staffProfile?.specialties || [],
          languages: member.staffProfile?.languages || ['English'],
          experience: member.staffProfile?.experience || '1+ years',
          employeeId: member.staffProfile?.employeeId,
          
          // Review stats
          rating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 0,
          totalReviews: member._count.reviewsReceived,
          
          // Latest reviews
          recentReviews: member.reviewsReceived.slice(0, 5).map(review => ({
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            reviewerName: `${review.reviewer.firstName} ${review.reviewer.lastName}`,
            reviewerImage: review.reviewer.profileImage
          }))
        };
      })
    );

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereConditions
    });

    const totalPages = Math.ceil(totalCount / limit);

    console.log(`Retrieved ${staffWithRatings.length} staff members`);

    return NextResponse.json({
      success: true,
      message: 'Staff data retrieved successfully',
      data: {
        staff: staffWithRatings,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff error:', error);
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
