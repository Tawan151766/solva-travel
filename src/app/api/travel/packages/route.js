import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || 10000;
    const location = searchParams.get('location') || '';
    const durationFilter = searchParams.get('duration') || '';

    console.log('Travel packages API called with params:', { 
      page, limit, search, minPrice, maxPrice, location, durationFilter 
    });

    // Build where clause for filtering
    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(location && {
        location: { contains: location, mode: 'insensitive' },
      }),
      ...(durationFilter && {
        duration: parseInt(durationFilter),
      }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };

    // Get total count for pagination
    const totalPackages = await prisma.travelPackage.count({ where });

    // Get packages with pagination
    const packages = await prisma.travelPackage.findMany({
      where,
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Transform data to match frontend expectations
    const transformedPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.title || pkg.name,
      name: pkg.name,
      description: pkg.description,
      overview: pkg.overview,
      highlights: pkg.highlights || [],
      price: `$${pkg.price.toFixed(2)}`,
      priceNumber: pkg.price,
      duration: pkg.durationText || `${pkg.duration} days`,
      durationDays: pkg.duration,
      maxCapacity: pkg.maxCapacity,
      location: pkg.location,
      destination: pkg.destination,
      category: pkg.category,
      difficulty: pkg.difficulty,
      imageUrl: pkg.imageUrl || (pkg.images && pkg.images[0]),
      images: pkg.images || [],
      galleryImages: pkg.galleryImages || [],
      isRecommended: pkg.isRecommended,
      isActive: pkg.isActive,
      rating: pkg.rating || 0,
      totalReviews: pkg.totalReviews || 0,
      tags: pkg.tags || [],
      totalBookings: pkg.bookings.length,
      activeBookings: pkg.bookings.filter(b => b.status === 'CONFIRMED').length,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    }));

    const totalPages = Math.ceil(totalPackages / limit);

    console.log(`Retrieved ${transformedPackages.length} packages out of ${totalPackages} total`);

    return NextResponse.json({
      success: true,
      message: 'Travel packages retrieved successfully',
      data: {
        packages: transformedPackages,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalPackages,
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

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Process itinerary data with error handling
    let itinerary = body.itinerary;
    
    try {
      // Handle different formats of itinerary data
      if (typeof itinerary === 'string') {
        itinerary = JSON.parse(itinerary);
      }
      
      // Convert array format to object format if needed
      if (Array.isArray(itinerary)) {
        const obj = {};
        itinerary.forEach((day, i) => { obj[`day${i+1}`] = day; });
        itinerary = obj;
      }
      
      // Ensure itinerary is an object at this point
      if (typeof itinerary !== 'object' || itinerary === null) {
        return NextResponse.json({
          success: false,
          message: 'Invalid itinerary format. Must be an object or array.'
        }, { status: 400 });
      }
    } catch (error) {
      console.error('Itinerary parsing error:', error);
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON format in Itinerary field'
      }, { status: 400 });
    }
    
    // Process accommodation data with error handling if it exists
    if (body.accommodation !== undefined) {
      if (typeof body.accommodation === 'string') {
        try {
          body.accommodation = JSON.parse(body.accommodation);
        } catch (error) {
          console.error('Accommodation parsing error:', error);
          return NextResponse.json({
            success: false,
            message: 'Invalid JSON format in Accommodation field. Must be an object or array.'
          }, { status: 400 });
        }
      }
      
      // Validate that accommodation is an object or array
      if (body.accommodation !== null && 
          typeof body.accommodation !== 'object') {
        return NextResponse.json({
          success: false,
          message: 'Invalid JSON format in Accommodation field. Must be an object or array.'
        }, { status: 400 });
      }
    }
    
    // Create the travel package in the database
    const newPackage = await prisma.travelPackage.create({ 
      data: { 
        ...body, 
        itinerary 
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Travel package created successfully',
      data: newPackage
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create travel package error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}