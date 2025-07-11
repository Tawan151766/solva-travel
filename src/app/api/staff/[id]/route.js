import { NextResponse } from 'next/server';
import { staffData, reviewsData } from '../../../../data/staffData.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual staff API called for ID:', id);

    // Find the staff member by ID
    const staff = staffData.find(member => member.id === id);

    if (!staff) {
      return NextResponse.json({
        success: false,
        message: 'Staff member not found'
      }, { status: 404 });
    }

    // Get reviews for this staff member
    const staffReviews = reviewsData.filter(review => review.staffId === id);

    // Combine staff data with reviews
    const staffWithReviews = {
      ...staff,
      reviews: staffReviews
    };

    console.log(`Retrieved staff member: ${staff.name} with ${staffReviews.length} reviews`);

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
