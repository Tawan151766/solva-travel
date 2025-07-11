import { NextResponse } from 'next/server';
import { galleryImages } from '../../../../data/galleryData.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual gallery image API called for ID:', id);

    // Convert string ID to number for comparison
    const imageId = parseInt(id, 10);

    // Find the gallery image by ID
    const galleryImage = galleryImages.find(img => img.id === imageId);

    if (!galleryImage) {
      return NextResponse.json({
        success: false,
        message: 'Gallery image not found'
      }, { status: 404 });
    }

    console.log(`Retrieved gallery image: ${galleryImage.title}`);

    return NextResponse.json({
      success: true,
      message: 'Gallery image retrieved successfully',
      data: galleryImage
    }, { status: 200 });

  } catch (error) {
    console.error('Get gallery image error:', error);
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
