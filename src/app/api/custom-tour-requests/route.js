import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const {
      userId,
      contactName,
      contactEmail,
      contactPhone,
      destination,
      startDate,
      endDate,
      numberOfPeople,
      budget,
      accommodation,
      transportation,
      activities,
      specialRequirements,
      description
    } = await request.json();

    // Validate required fields
    const requiredFields = ['contactName', 'contactEmail', 'contactPhone', 'destination', 'startDate', 'endDate', 'numberOfPeople'];
    const missingFields = requiredFields.filter(field => !eval(field));
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return NextResponse.json(
        { success: false, message: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { success: false, message: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Validate number of people
    if (numberOfPeople < 1 || numberOfPeople > 50) {
      return NextResponse.json(
        { success: false, message: 'Number of people must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Create custom tour request
    const customRequest = await prisma.customTourRequest.create({
      data: {
        userId: userId || null,
        contactName,
        contactEmail,
        contactPhone,
        destination,
        startDate: start,
        endDate: end,
        numberOfPeople: parseInt(numberOfPeople),
        budget: budget ? parseFloat(budget) : null,
        accommodation: accommodation || null,
        transportation: transportation || null,
        activities: activities || null,
        specialRequirements: specialRequirements || null,
        description: description || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Custom tour request submitted successfully',
      data: customRequest
    }, { status: 201 });

  } catch (error) {
    console.error('Custom tour request error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.customTourRequest.findMany({
        where,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customTourRequest.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        requests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get custom tour requests error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
