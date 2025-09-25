import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET() {
  try {
    const blog = await prisma.blog.findMany({
      include: { author: true },
    });

    const transformed = blog.map(blog => ({
        id: blog.id,
  title: blog.title,
  content: blog.content,
  authorId: blog.authorId,
  published: blog.published,
  createdAt: blog.createdAt,
  updatedAt: blog.updatedAt,
  author: blog.author, 
    }));

    return NextResponse.json({
      success: true,
      message: 'blog retrieved successfully',
      data: transformed
    }, { status: 200 });

  } catch (error) {
    console.error('Get all blog error:', error);
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
      title,
      content,
      authorId,
      published = false
    } = body;

    // Validation
    if (!title || !content || !authorId) {
      return NextResponse.json({
        success: false,
        message: 'title, content, authorId'
      }, { status: 400 });
    }

    // Create new blog
    const newblog = await prisma.blog.create({
      data: {
      title,
      content,
      authorId,
      published
      },
      include: { author: true },
      
    });

    return NextResponse.json({
      success: true,
      message: 'blog created successfully',
      data: {
        id: newblog.id,
        title: newblog.title,
        content: newblog.content,
        authorId: newblog.authorId,
        published: newblog.published,
        createdAt: newblog.createdAt,
        updatedAt: newblog.updatedAt,
        author: newblog.author,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}
