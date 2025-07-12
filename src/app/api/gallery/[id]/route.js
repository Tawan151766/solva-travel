import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual gallery image API called for ID:', id);

    // Find the gallery image by ID
    const galleryImage = await prisma.gallery.findUnique({
      where: { 
        id: id,
        isActive: true 
      },
      include: {
        uploader: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    if (!galleryImage) {
      return NextResponse.json({
        success: false,
        message: 'Gallery image not found'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    const transformedImage = {
      id: galleryImage.id,
      title: galleryImage.title,
      description: galleryImage.description,
      imageUrl: galleryImage.imageUrl,
      category: galleryImage.category.toLowerCase(),
      location: galleryImage.location,
      tags: galleryImage.tags,
      uploadedBy: galleryImage.uploader ? `${galleryImage.uploader.firstName} ${galleryImage.uploader.lastName}` : 'System',
      uploaderImage: galleryImage.uploader?.profileImage,
      createdAt: galleryImage.createdAt,
      updatedAt: galleryImage.updatedAt,
    };

    console.log(`Retrieved gallery image: ${transformedImage.title}`);

    return NextResponse.json({
      success: true,
      message: 'Gallery image retrieved successfully',
      data: transformedImage
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
