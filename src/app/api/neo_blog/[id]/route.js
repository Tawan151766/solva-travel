import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual blog called for ID:', id);

    // Find the blog by ID
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true }
      
    });

    if (!blog) {
      return NextResponse.json({
        success: false,
        message: 'blog not found'
      }, { status: 404 });
    }

    // Transform data to match frontend expectations
    const transformedblog = {
  id: blog.id,
  title: blog.title,
  content: blog.content,
  authorId: blog.authorId,
  published: blog.published,
  createdAt: blog.createdAt,
  updatedAt: blog.updatedAt,
  author: blog.author, 
};


    console.log(`Retrieved blog: ${transformedblog.title}`);

    return NextResponse.json({
      success: true,
      message: 'blog  retrieved successfully',
      data: transformedblog
    }, { status: 200 });

  } catch (error) {
    console.error('Get blog  error:', error);
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
      title,
      content,
      authorId,
      published = false
      
    } = body;

    // Check if blog  exists
    const existingblog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingblog) {
      return NextResponse.json({
        success: false,
        message: 'blog not found'
      }, { status: 404 });
    }

    // Update blog 
    const updatedblog = await prisma.blog.update({
      where: { id },
      include: { author: true },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(authorId && { authorId }),
        ...(published !== undefined && { published }),
    }
    });

    return NextResponse.json({
      success: true,
      message: 'blog  updated successfully',
      data: {
        blog: {
        id: updatedblog.id,
        title: updatedblog.title,
        content: updatedblog.content,
        authorId: updatedblog.authorId,
        published: updatedblog.published,
        createdAt: updatedblog.createdAt,
        updatedAt: updatedblog.updatedAt,
        author: updatedblog.author, 
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Update blog  error:', error);
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

    // Check if blog  exists
    const existingblog = await prisma.blog.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingblog) {
      return NextResponse.json({
        success: false,
        message: 'blog  not found'
      }, { status: 404 });
    }

    // Delete blog 
    await prisma.blog.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'blog  deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Delete blog  error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}