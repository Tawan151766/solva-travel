import { NextResponse } from 'next/server';
import { prisma as sharedPrisma } from '../../../../lib/prisma.js';
import { PrismaClient } from '@prisma/client';

const prisma = (sharedPrisma && sharedPrisma.blog) ? sharedPrisma : new PrismaClient();

// GET id
export async function GET(request, { params }) {
  try {
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog retrieved successfully',
      data: {
        blog: {
          id: blog.id,
          title: blog.title,
          content: blog.content,
          authorId: blog.authorId,
          authorName: blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : null,
          published: blog.published,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get blog by id error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// PUT id
export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, published } = body || {};

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'id is required to update a blog'
      }, { status: 400 });
    }

    const data = {};
    if (typeof title === 'string') data.title = title.trim();
    if (typeof content === 'string') data.content = content.trim();
    if (typeof published === 'boolean') data.published = published;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid fields to update'
      }, { status: 400 });
    }

    const updated = await prisma.blog.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        blog: {
          id: updated.id,
          title: updated.title,
          content: updated.content,
          authorId: updated.authorId,
          authorName: updated.author ? `${updated.author.firstName} ${updated.author.lastName}` : null,
          published: updated.published,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Update blog error:', error);
    const notFound = /Record to update not found/i.test(String(error?.message || ''));
    return NextResponse.json({
      success: false,
      message: notFound ? 'Blog not found' : 'Internal server error',
      error: error.message
    }, { status: notFound ? 404 : 500 });
  }
}

// DELETE id 
export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Access token is required' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 });
    }

    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete blog by id error:', error);
    const notFound = /Record to delete does not exist/i.test(String(error?.message || '')) || /Record to delete not found/i.test(String(error?.message || ''));
    return NextResponse.json({ success: false, message: notFound ? 'Blog not found' : 'Internal server error', error: error.message }, { status: notFound ? 404 : 500 });
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

