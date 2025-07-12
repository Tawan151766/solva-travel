import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// GET /api/bookings - Get user's bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    const where = {
      customerId: userId,
      ...(status && { status })
    };

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: true,
        customTourRequest: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.booking.count({ where });

    return NextResponse.json({
      bookings,
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      bookingType,
      packageId,
      customTourRequestId,
      selectedGroupSize,
      startDate,
      endDate,
      numberOfPeople,
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
      notes
    } = body;

    // Validate required fields
    if (!bookingType || !startDate || !endDate || !numberOfPeople || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate booking type and related IDs
    if (bookingType === 'PACKAGE' && !packageId) {
      return NextResponse.json(
        { error: 'Package ID is required for package booking' },
        { status: 400 }
      );
    }

    if (bookingType === 'CUSTOM' && !customTourRequestId) {
      return NextResponse.json(
        { error: 'Custom tour request ID is required for custom booking' },
        { status: 400 }
      );
    }

    // Get user from token (optional for guest bookings)
    let userId = null;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (error) {
        console.log('Invalid token, proceeding as guest booking');
      }
    }

    // If no userId, create a guest user account
    if (!userId) {
      // Check if user exists with this email
      let user = await prisma.user.findUnique({
        where: { email: customerEmail }
      });

      if (!user) {
        // Create guest user
        user = await prisma.user.create({
          data: {
            email: customerEmail,
            firstName: customerName.split(' ')[0] || customerName,
            lastName: customerName.split(' ').slice(1).join(' ') || '',
            phone: customerPhone,
            password: Math.random().toString(36).substring(7), // Random password for guest
            role: 'USER'
          }
        });
      }
      userId = user.id;
    }

    let totalAmount = 0;
    let packageData = null;
    let customTourRequestData = null;

    // Calculate total amount based on booking type
    if (bookingType === 'PACKAGE') {
      packageData = await prisma.travelPackage.findUnique({
        where: { id: packageId }
      });

      if (!packageData) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        );
      }

      // Calculate price based on group pricing if available
      if (packageData.groupPricing && selectedGroupSize) {
        const groupPricing = JSON.parse(packageData.groupPricing);
        if (groupPricing[selectedGroupSize]) {
          totalAmount = parseFloat(groupPricing[selectedGroupSize].price) * numberOfPeople;
        } else {
          totalAmount = parseFloat(packageData.price) * numberOfPeople;
        }
      } else {
        totalAmount = parseFloat(packageData.price) * numberOfPeople;
      }
    } else if (bookingType === 'CUSTOM') {
      customTourRequestData = await prisma.customTourRequest.findUnique({
        where: { id: customTourRequestId }
      });

      if (!customTourRequestData) {
        return NextResponse.json(
          { error: 'Custom tour request not found' },
          { status: 404 }
        );
      }

      // Use estimated cost from custom tour request or default amount
      totalAmount = customTourRequestData.estimatedCost || 0;
    }

    // Generate unique booking number
    const bookingNumber = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerId: userId,
        bookingType,
        packageId: bookingType === 'PACKAGE' ? packageId : null,
        customTourRequestId: bookingType === 'CUSTOM' ? customTourRequestId : null,
        selectedGroupSize: bookingType === 'PACKAGE' && selectedGroupSize ? selectedGroupSize : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        numberOfPeople: parseInt(numberOfPeople),
        totalAmount,
        customerName,
        customerEmail,
        customerPhone,
        specialRequirements,
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        package: true,
        customTourRequest: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Update custom tour request status if applicable
    if (bookingType === 'CUSTOM') {
      await prisma.customTourRequest.update({
        where: { id: customTourRequestId },
        data: { status: 'CONFIRMED' }
      });
    }

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
