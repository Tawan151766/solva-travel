import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    console.log('Gallery API called with params:', { page, limit, category, search });

    // Build where clause for filtering
    const where = {
      isActive: true,
      ...(category && category !== 'all' && {
        category: category.toUpperCase(),
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { tags: { hasSome: [search.toLowerCase()] } },
        ],
      }),
    };

    // Get total count for pagination
    const totalImages = await prisma.gallery.count({ where });

    // Get images with pagination
    const images = await prisma.gallery.findMany({
      where,
      include: {
        uploader: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Transform data to match frontend expectations
    const transformedImages = images.map(img => ({
      id: img.id,
      title: img.title,
      description: img.description,
      imageUrl: img.imageUrl,
      category: img.category.toLowerCase(),
      location: img.location,
      tags: img.tags,
      uploadedBy: img.uploader ? `${img.uploader.firstName} ${img.uploader.lastName}` : 'System',
      createdAt: img.createdAt,
    }));

    // Get all categories for filtering
    const allCategories = await prisma.gallery.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    const categories = allCategories.map(cat => cat.category.toLowerCase());

    const totalPages = Math.ceil(totalImages / limit);

    console.log(`Retrieved ${transformedImages.length} images out of ${totalImages} total`);

    return NextResponse.json({
      success: true,
      message: 'Gallery images retrieved successfully',
      data: {
        images: transformedImages,
        categories: categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalImages,
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
