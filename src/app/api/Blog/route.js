import { NextResponse } from 'next/server';
import { prisma as sharedPrisma } from '../../../lib/prisma.js';
import { PrismaClient } from '@prisma/client';

const prisma = (sharedPrisma && sharedPrisma.blog) ? sharedPrisma : new PrismaClient();

// POST GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const authorId = searchParams.get('authorId') || '';
    const search = searchParams.get('search') || '';
    const publishedParam = searchParams.get('published');

    const where = {
      ...(authorId && { authorId }),
      ...(publishedParam !== null && {
        published: publishedParam === 'true'
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const total = await prisma.blog.count({ where });

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const data = blogs.map(b => ({
      id: b.id,
      title: b.title,
      content: b.content,
      imageUrl: b.imageUrl || null,
      authorId: b.authorId,
      authorName: b.author ? `${b.author.firstName} ${b.author.lastName}` : null,
      published: b.published,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: {
        blogs: data,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

// POST 
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    let title, content, authorId, published = false, imageUrl = null;
    let formData;
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      // รับไฟล์จาก multipart/form-data
      const form = await request.formData();
      title = form.get('title');
      content = form.get('content');
      authorId = form.get('authorId');
      published = form.get('published') === 'true';
      const imageFile = form.get('image');
      if (imageFile && imageFile.size > 0) {
        // อัปโหลดไป Cloudinary
        const buffer = Buffer.from(await imageFile.arrayBuffer());
  const CloudinaryService = (await import('../../../lib/cloudinary.js')).default;
        const cloudinary = new CloudinaryService();
        const result = await cloudinary.uploadBuffer(buffer, imageFile.name);
        imageUrl = result.url;
      }
    } else {
      // รับข้อมูลแบบ json
      const body = await request.json();
      title = body.title;
      content = body.content;
      authorId = body.authorId;
      published = body.published || false;
      imageUrl = body.imageUrl || null;
    }

    if (!title || !content || !authorId) {
      return NextResponse.json({
        success: false,
        message: 'title, content, and authorId are required'
      }, { status: 400 });
    }

    const created = await prisma.blog.create({
      data: {
        title: String(title).trim(),
        content: String(content).trim(),
        authorId,
        published: Boolean(published),
        imageUrl,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: {
        blog: {
          id: created.id,
          title: created.title,
          content: created.content,
          authorId: created.authorId,
          authorName: created.author ? `${created.author.firstName} ${created.author.lastName}` : null,
          published: created.published,
          imageUrl: created.imageUrl,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        }
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



