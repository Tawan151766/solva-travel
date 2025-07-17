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
    const { title, description, imageUrl, category, location, tags, isActive } = body;

    // Check if gallery image exists
    const existingImage = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json({
        success: false,
        message: 'Gallery image not found'
      }, { status: 404 });
    }

    // Update gallery image
    const updatedImage = await prisma.gallery.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl && { imageUrl }),
        ...(category && { category: category.toUpperCase() }),
        ...(location && { location }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        uploader: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: {
        image: {
          id: updatedImage.id,
          title: updatedImage.title,
          description: updatedImage.description,
          imageUrl: updatedImage.imageUrl,
          category: updatedImage.category.toLowerCase(),
          location: updatedImage.location,
          tags: updatedImage.tags,
          isActive: updatedImage.isActive,
          uploadedBy: updatedImage.uploader ? `${updatedImage.uploader.firstName} ${updatedImage.uploader.lastName}` : 'System',
          createdAt: updatedImage.createdAt,
          updatedAt: updatedImage.updatedAt,
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update gallery image error:', error);
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

    // Check if gallery image exists
    const existingImage = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json({
        success: false,
        message: 'Gallery image not found'
      }, { status: 404 });
    }

    // Delete gallery image
    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete gallery image error:', error);
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
