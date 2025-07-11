import { NextResponse } from 'next/server';
import { staffData, reviewsData } from '../../../data/staffData.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';

    console.log('Staff API called with params:', { page, limit, search });

    // Start with all staff data
    let filteredStaff = [...staffData];

    // Add search filter
    if (search) {
      filteredStaff = filteredStaff.filter(staff =>
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.title.toLowerCase().includes(search.toLowerCase()) ||
        staff.bio.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Add reviews to each staff member
    filteredStaff = filteredStaff.map(staff => {
      const staffReviews = reviewsData.filter(review => review.staffId === staff.id);
      return {
        ...staff,
        reviews: staffReviews
      };
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

    const totalCount = filteredStaff.length;
    const totalPages = Math.ceil(totalCount / limit);

    console.log(`Retrieved ${paginatedStaff.length} staff members out of ${totalCount} total`);

    return NextResponse.json({
      success: true,
      message: 'Staff data retrieved successfully',
      data: {
        staff: paginatedStaff,
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
