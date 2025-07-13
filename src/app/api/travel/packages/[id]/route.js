import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual travel package API called for ID:', id);

    // Find the travel package by ID using Prisma
    const travelPackage = await prisma.travelPackage.findUnique({
      where: { 
        id: id,
        isActive: true 
      },
      include: {
        bookings: {
          select: {
            id: true,
            status: true,
            customer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!travelPackage) {
      return NextResponse.json({
        success: false,
        message: 'Travel package not found'
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
      itinerary: travelPackage.itinerary,
      price: travelPackage.price.toString(), // Keep as string for display
      priceNumber: parseFloat(travelPackage.price), // Add numeric version for calculations
      priceDetails: travelPackage.priceDetails,
      duration: travelPackage.durationText || `${travelPackage.duration} days`,
      durationDays: travelPackage.duration,
      maxCapacity: travelPackage.maxCapacity,
      location: travelPackage.location,
      destination: travelPackage.destination,
      category: travelPackage.category,
      difficulty: travelPackage.difficulty,
      includes: travelPackage.includes || [],
      excludes: travelPackage.excludes || [],
      accommodation: travelPackage.accommodation,
      imageUrl: travelPackage.imageUrl || (travelPackage.images && travelPackage.images[0]),
      images: travelPackage.images || [],
      galleryImages: travelPackage.galleryImages || [],
      isRecommended: travelPackage.isRecommended,
      rating: travelPackage.rating || 0,
      totalReviews: travelPackage.totalReviews || 0,
      tags: travelPackage.tags || [],
      images: travelPackage.images,
      imageUrl: travelPackage.images[0] || '/images/default-package.jpg',
      isActive: travelPackage.isActive,
      totalBookings: travelPackage.bookings.length,
      activeBookings: travelPackage.bookings.filter(b => b.status === 'CONFIRMED').length,
      createdAt: travelPackage.createdAt,
      updatedAt: travelPackage.updatedAt,
      // Add default highlights if not in database
      highlights: [
        "Premium accommodation with modern amenities",
        "Expert local guides and cultural experiences", 
        "Authentic local cuisine and dining experiences",
        "Carefully curated activities and excursions",
        "24/7 customer support throughout your journey"
      ],
      // Group pricing options
      groupPricing: {
        "2": {
          price: (travelPackage.price * 1.5).toFixed(0),
          label: "2 People"
        },
        "4": {
          price: (travelPackage.price * 1.2).toFixed(0),
          label: "4 People"
        },
        "6": {
          price: travelPackage.price.toFixed(0),
          label: "6 People"
        },
        "8": {
          price: (travelPackage.price * 0.9).toFixed(0),
          label: "8+ People"
        }
      }
    };

    console.log(`Retrieved travel package: ${transformedPackage.title}`);

    return NextResponse.json({
      success: true,
      message: 'Travel package retrieved successfully',
      data: transformedPackage
    }, { status: 200 });

  } catch (error) {
    console.error('Get travel package error:', error);
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