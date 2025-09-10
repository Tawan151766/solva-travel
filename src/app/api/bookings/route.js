import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/nextauth.js';

// Helper function to generate unique tracking ID
function generateTrackingId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK${timestamp.slice(-6)}${random}`;
}

// Helper function to generate unique booking number
function generateBookingNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${timestamp}${random}`;
}

// GET /api/bookings - Get user's bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;
    
    // Fallback to JWT token
    if (!userId) {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId;
        } catch (error) {
          console.log('Invalid JWT token');
        }
      }
    }

    // If no user ID, return empty result
    if (!userId) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: 'No bookings found'
      });
    }

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    const where = {
      userId,
      ...(status && { status })
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: {
          select: {
            id: true,
            name: true,
            location: true,
            duration: true,
            imageUrl: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        assignedStaff: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.booking.count({ where });

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      packageId,
      startDate,
      endDate,
      numberOfPeople,
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
      notes,
      totalAmount,
      pricePerPerson
    } = body;

    // Validate required fields
    if (!packageId || !startDate || !endDate || !numberOfPeople || 
        !customerName || !customerEmail || !customerPhone || 
        !totalAmount || !pricePerPerson) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields',
          required: ['packageId', 'startDate', 'endDate', 'numberOfPeople', 
                    'customerName', 'customerEmail', 'customerPhone', 
                    'totalAmount', 'pricePerPerson']
        },
        { status: 400 }
      );
    }

    // Get package information
    const packageData = await prisma.travelPackage.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        name: true,
        location: true,
        maxCapacity: true,
        isActive: true
      }
    });

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    if (!packageData.isActive) {
      return NextResponse.json(
        { success: false, error: 'Package is no longer available' },
        { status: 400 }
      );
    }

    if (numberOfPeople > packageData.maxCapacity) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Number of people exceeds package capacity (${packageData.maxCapacity})` 
        },
        { status: 400 }
      );
    }

    // Try to get user ID from session or JWT
    let userId = null;
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Fallback to JWT token
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId;
        } catch (error) {
          console.log('Invalid JWT token, proceeding as guest booking');
        }
      }
    }

    // If no userId but we have email, try to find existing user
    if (!userId && customerEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: customerEmail }
      });
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    // Generate unique identifiers
    const bookingNumber = generateBookingNumber();
    const trackingId = generateTrackingId();

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        trackingId,
        userId,
        customerName,
        customerEmail,
        customerPhone,
        packageId,
        packageName: packageData.name,
        packageLocation: packageData.location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfPeople: parseInt(numberOfPeople),
        totalAmount: parseFloat(totalAmount),
        pricePerPerson: parseFloat(pricePerPerson),
        specialRequirements,
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            location: true,
            duration: true,
            imageUrl: true,
            images: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
      trackingId: trackingId,
      bookingNumber: bookingNumber
    }, { status: 201 });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
