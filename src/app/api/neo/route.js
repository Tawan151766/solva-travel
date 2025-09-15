import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  try {
    const packages = await prisma.TravelPackage.findMany({
      where: {
        isActive: true
      }
    });

    const transformed = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      maxCapacity: pkg.maxCapacity,
      location: pkg.location,
      price: pkg.price,
      isActive: pkg.isActive,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
      accommodation: pkg.accommodation,
      category: pkg.category?.toLowerCase(),
      destination: pkg.destination,
      difficulty: pkg.difficulty,
      durationText: pkg.durationText,
      excludes: pkg.excludes,
      highlights: pkg.highlights,
      prices: pkg.prices,
      includes: pkg.includes,
      isRecommended: pkg.isRecommended,
      itinerary: pkg.itinerary,
      overview: pkg.overview,
      priceDetails: pkg.priceDetails,
      rating: pkg.rating,
      seoDescription: pkg.seoDescription,
      seoname: pkg.seoname,
      tags: pkg.tags,
      name: pkg.name,
      totalReviews: pkg.totalReviews,
      bookings: pkg.bookings,
      galleryImages: pkg.galleryImages,
      reviews: pkg.reviews,
      UserId: pkg.UserId,
      userId: pkg.userId,
    }));

    return NextResponse.json({
      success: true,
      message: 'TravelPackages retrieved successfully',
      data: transformed
    }, { status: 200 });

  } catch (error) {
    console.error('Get all TravelPackages error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token (you might want to add proper JWT verification here)
    // For now, we'll assume the token is valid if it exists
    
    const body = await request.json();
    const {
      name,
      description,
      price,
      duration,
      maxCapacity,
      location,
      imageUrl,
      isActive = true,
      accommodation,
      category,
      destination,
      difficulty,
      durationText,
      excludes,
      highlights,
      includes,
      isRecommended,
      itinerary,
      overview,
      priceDetails,
      rating,
      seoDescription,
      seoTitle,
      tags,
      title,
      totalReviews
    } = body;

    // Validation
    if (!name || !price || !category || !location) {
      return NextResponse.json({
        success: false,
        message: 'name, description, price, category, location, tags are required'
      }, { status: 400 });
    }

    // Create new TravelPackage
    const newPackage = await prisma.TravelPackage.create({
      data: {
        name,
        description,
        price,
        duration,
        maxCapacity,
        location,
        imageUrl,
        isActive,
        accommodation,
        category: category.toUpperCase(),
        destination,
        difficulty,
        durationText,
        excludes,
        highlights,
        includes,
        isRecommended,
        itinerary,
        overview,
        priceDetails,
        rating,
        seoDescription,
        seoTitle,
        tags: Array.isArray(tags) ? tags : [],
        title,
        totalReviews
      },
      
    });

    return NextResponse.json({
      success: true,
      message: 'TravelPackage created successfully',
      data: {
        id: newPackage.id,
        name: newPackage.name,
        description: newPackage.description,
        price: newPackage.price,
        category: newPackage.category.toLowerCase(),
        destination:newPackage.destination,
        location: newPackage.location,
        tags: newPackage.tags,
        isActive: newPackage.isActive,
        createdAt: newPackage.createdAt,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create TravelPackage error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
