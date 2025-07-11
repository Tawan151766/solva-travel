import { NextResponse } from 'next/server';
import { galleryImages } from '../../../data/galleryData.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    console.log('Gallery API called with params:', { page, limit, category, search });

    // Start with all gallery images
    let filteredImages = [...galleryImages];

    // Apply category filter
    if (category && category !== 'all') {
      filteredImages = filteredImages.filter(image =>
        image.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      filteredImages = filteredImages.filter(image =>
        image.title.toLowerCase().includes(search.toLowerCase()) ||
        image.location.toLowerCase().includes(search.toLowerCase()) ||
        image.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedImages = filteredImages.slice(startIndex, endIndex);

    const totalCount = filteredImages.length;
    const totalPages = Math.ceil(totalCount / limit);

    // Get unique categories for filtering
    const categories = [...new Set(galleryImages.map(img => img.category))];

    console.log(`Retrieved ${paginatedImages.length} images out of ${totalCount} total`);

    return NextResponse.json({
      success: true,
      message: 'Gallery images retrieved successfully',
      data: {
        images: paginatedImages,
        categories: categories,
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
    console.error('Get gallery images error:', error);
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
