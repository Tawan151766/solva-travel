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