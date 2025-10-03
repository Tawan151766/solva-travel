import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma.js';

const MAX_LIMIT = 20;

const authorSelect = {
  select: {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
  },
};

const resolveAuthorName = (author) => {
  if (!author) {
    return null;
  }

  const first = typeof author.firstName === 'string' ? author.firstName.trim() : '';
  const last = typeof author.lastName === 'string' ? author.lastName.trim() : '';
  const combined = `${first} ${last}`.trim();

  if (combined) {
    return combined;
  }

  if (typeof author.email === 'string' && author.email.trim()) {
    return author.email.trim();
  }

  return null;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '5', 10), 1), MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = { published: true };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          author: authorSelect,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);

    const data = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      authorId: blog.authorId,
      authorName: resolveAuthorName(blog.author),
      published: blog.published,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }));

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return NextResponse.json(
      {
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
            limit,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Get all blog error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access token is required',
        },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      console.error('Invalid token when creating blog:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 },
      );
    }

    if (!payload?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authenticated user not found',
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, content, published = false } = body ?? {};

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: 'title and content are required fields',
        },
        { status: 400 },
      );
    }

    const trimmedTitle = String(title).trim();
    const trimmedContent = String(content).trim();

    if (!trimmedTitle || !trimmedContent) {
      return NextResponse.json(
        {
          success: false,
          message: 'title and content must not be empty',
        },
        { status: 400 },
      );
    }

    const newBlog = await prisma.blog.create({
      data: {
        title: trimmedTitle,
        content: trimmedContent,
        authorId: payload.userId,
        published: Boolean(published),
      },
      include: {
        author: authorSelect,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Blog created successfully',
        data: {
          blog: {
            id: newBlog.id,
            title: newBlog.title,
            content: newBlog.content,
            authorId: newBlog.authorId,
            authorName: resolveAuthorName(newBlog.author),
            published: newBlog.published,
            createdAt: newBlog.createdAt,
            updatedAt: newBlog.updatedAt,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create blog error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
}