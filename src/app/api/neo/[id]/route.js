import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual TravelPackageAPI called for ID:', id);

    // Find the TravelPackage by ID
    const TravelPackage = await prisma.TravelPackage.findUnique({
      where: { 
        id: id,
        isActive: true 
      },
      
    });



    


    if (!TravelPackage) {
      return NextResponse.json({
        success: false,
        message: 'TravelPackage not found'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    const transformedImage = {
      id: TravelPackage.id,
      name: TravelPackage.name,
      description: TravelPackage.description,
      price: TravelPackage.price,
      duration: TravelPackage.duration,
      maxCapacity: TravelPackage.maxCapacity,
      location: TravelPackage.location,
      imageUrl: TravelPackage.imageUrl,
      isActive: TravelPackage.isActive,
      createdAt: TravelPackage.createdAt,
      updatedAt: TravelPackage.updatedAt,
      accommodation: TravelPackage.accommodation,
      category: TravelPackage.category.toLowerCase(),
      destinations: TravelPackage.destinations,
      difficulty: TravelPackage.difficulty,
      durationText: TravelPackage.durationText,
      excludes: TravelPackage.excludes,
      highlights: TravelPackage.highlights,
      imageUrls: TravelPackage.imageUrls,
      includes: TravelPackage.includes,
      isRecommended: TravelPackage.isRecommended,
      itinerary: TravelPackage.itinerary,
      overview: TravelPackage.overview,
      priceDetails: TravelPackage.priceDetails,
      rating: TravelPackage.rating,
      seoDescription: TravelPackage.seoDescription,
      seoTitle: TravelPackage.seoTitle,
      tags: TravelPackage.tags,
      title: TravelPackage.title,
      totalReviews: TravelPackage.totalReviews,
      bookings: TravelPackage.bookings,
      TravelPackageImages: TravelPackage.TravelPackageImages,
      reviews: TravelPackage.reviews,
      UserId: TravelPackage.UserId,
      userId: TravelPackage.userId,
    };

    console.log(`Retrieved TravelPackage: ${transformedImage.name}`);

    return NextResponse.json({
      success: true,
      message: 'TravelPackage  retrieved successfully',
      data: transformedImage
    }, { status: 200 });

  } catch (error) {
    console.error('Get TravelPackage  error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const { id } = await params;
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

    // Check if TravelPackage  exists
    const existingTravelPackage = await prisma.TravelPackage.findUnique({
      where: { id }
    });

    if (!existingTravelPackage) {
      return NextResponse.json({
        success: false,
        message: 'TravelPackage not found'
      }, { status: 404 });
    }

    // Update TravelPackage 
    const updatedTravelPackage = await prisma.TravelPackage.update({
      where: { id },
      data: {

        ...(name && { name }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category: category.toUpperCase() }),
        ...(destination && { destination }),
        ...(location && { location }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(isActive !== undefined && { isActive }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(maxCapacity !== undefined && { maxCapacity }),
        ...(difficulty && { difficulty }),
        ...(durationText && { durationText }),
        ...(excludes !== undefined && { excludes: Array.isArray(excludes) ? excludes : [] }),
        ...(highlights !== undefined && { highlights: Array.isArray(highlights) ? highlights : [] }),
        ...(includes !== undefined && { includes: Array.isArray(includes) ? includes : [] }),
        ...(isRecommended !== undefined && { isRecommended }),
        ...(itinerary !== undefined && { itinerary }),
        ...(overview && { overview }),
        ...(priceDetails !== undefined && { priceDetails }),
        ...(rating !== undefined && { rating }),
        ...(seoDescription && { seoDescription }),
        ...(seoTitle && { seoTitle }),
        ...(totalReviews !== undefined && { totalReviews }),
        ...(accommodation !== undefined && { accommodation })
      },
    });

    return NextResponse.json({
      success: true,
      message: 'TravelPackage  updated successfully',
      data: {
        travelPackage: {
          id: updatedTravelPackage.id,
          name:updatedTravelPackage.name,
          title: updatedTravelPackage.title,
          description: updatedTravelPackage.description,
          imageUrl: updatedTravelPackage.imageUrl,
          category: updatedTravelPackage.category?.toLowerCase(),
          location: updatedTravelPackage.location,
          tags: updatedTravelPackage.tags,
          isActive: updatedTravelPackage.isActive,
          createdAt: updatedTravelPackage.createdAt,
          updatedAt: updatedTravelPackage.updatedAt,
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update TravelPackage  error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const { id } = await params;

    // Check if TravelPackage  exists
    const existingTravelPackage = await prisma.TravelPackage.findUnique({
      where: { id }
    });

    if (!existingTravelPackage) {
      return NextResponse.json({
        success: false,
        message: 'TravelPackage  not found'
      }, { status: 404 });
    }

    // Delete TravelPackage 
    await prisma.TravelPackage.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'TravelPackage  deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete TravelPackage  error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}