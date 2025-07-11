import { NextResponse } from 'next/server';
import { travelData } from '../../../../data/travelData.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 10000;
    const location = searchParams.get('location') || '';
    const duration = searchParams.get('duration') || '';

    console.log('Travel packages API called with params:', { 
      page, limit, search, minPrice, maxPrice, location, duration 
    });

    // Start with all travel data
    let filteredPackages = [...travelData];

    // Apply search filter
    if (search) {
      filteredPackages = filteredPackages.filter(pkg =>
        pkg.title.toLowerCase().includes(search.toLowerCase()) ||
        pkg.location.toLowerCase().includes(search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply location filter
    if (location) {
      filteredPackages = filteredPackages.filter(pkg =>
        pkg.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply duration filter
    if (duration) {
      filteredPackages = filteredPackages.filter(pkg =>
        pkg.duration.toLowerCase().includes(duration.toLowerCase())
      );
    }

    // Apply price filter
    filteredPackages = filteredPackages.filter(pkg => {
      const packagePrice = parseFloat(pkg.price.replace(/[$,]/g, ''));
      return packagePrice >= minPrice && packagePrice <= maxPrice;
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPackages = filteredPackages.slice(startIndex, endIndex);

    const totalCount = filteredPackages.length;
    const totalPages = Math.ceil(totalCount / limit);

    console.log(`Retrieved ${paginatedPackages.length} packages out of ${totalCount} total`);

    return NextResponse.json({
      success: true,
      message: 'Travel packages retrieved successfully',
      data: {
        packages: paginatedPackages,
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
    console.error('Get travel packages error:', error);
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