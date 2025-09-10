import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Package ID is required'
      }, { status: 400 });
    }

    console.log('Fetching package with ID:', id);

    // Get package with related data
    const travelPackage = await prisma.travelPackage.findUnique({
      where: { 
        id: id,
        isActive: true // Only return active packages
      },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            numberOfPeople: true,
          },
        },
        reviews: {
          where: {
            isPublic: true
          },
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            userName: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!travelPackage) {
      return NextResponse.json({
        success: false,
        message: 'Package not found'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    const transformedPackage = {
      id: travelPackage.id,
      title: travelPackage.title || travelPackage.name,
      name: travelPackage.name,
      description: travelPackage.description,
      overview: travelPackage.overview,
      highlights: travelPackage.highlights || [],
      price: `$${travelPackage.price.toFixed(2)}`,
      priceNumber: travelPackage.price,
      priceDetails: travelPackage.priceDetails || {},
      duration: travelPackage.durationText || `${travelPackage.duration} days`,
      durationDays: travelPackage.duration,
      maxCapacity: travelPackage.maxCapacity,
      location: travelPackage.location,
      destination: travelPackage.destination,
      category: travelPackage.category,
      difficulty: travelPackage.difficulty,
      imageUrl: travelPackage.imageUrl || (travelPackage.images && travelPackage.images[0]) || '/placeholder-image.jpg',
      images: travelPackage.images || [],
      galleryImages: travelPackage.galleryImages || [],
      isRecommended: travelPackage.isRecommended,
      isActive: travelPackage.isActive,
      rating: travelPackage.rating || 0,
      totalReviews: travelPackage.totalReviews || 0,
      tags: travelPackage.tags || [],
      includes: travelPackage.includes || [],
      excludes: travelPackage.excludes || [],
      itinerary: travelPackage.itinerary || {},
      accommodation: travelPackage.accommodation || {},
      
      // Booking statistics
      totalBookings: travelPackage.bookings.length,
      activeBookings: travelPackage.bookings.filter(b => b.status === 'CONFIRMED').length,
      availableSpots: travelPackage.maxCapacity - travelPackage.bookings
        .filter(b => ['CONFIRMED', 'PENDING'].includes(b.status))
        .reduce((sum, booking) => sum + booking.numberOfPeople, 0),
      
      // Reviews
      reviews: travelPackage.reviews || [],
      
      // Timestamps
      createdAt: travelPackage.createdAt,
      updatedAt: travelPackage.updatedAt,
    };

    console.log(`Package ${id} retrieved successfully`);

    return NextResponse.json({
      success: true,
      message: 'Package retrieved successfully',
      data: transformedPackage
    }, { status: 200 });

  } catch (error) {
    console.error('Get package error:', error);
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