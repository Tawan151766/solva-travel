import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

// Function to generate tracking number for custom bookings
function generateCustomBookingId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `CB-${year}${month}${day}-${random}`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received custom booking data:', body);

    // Validate required fields
    const requiredFields = ['destination', 'startDate', 'endDate', 'numberOfPeople', 'budget', 'contactName', 'contactEmail', 'contactPhone'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return NextResponse.json({
        success: false,
        error: 'Start date cannot be in the past'
      }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date'
      }, { status: 400 });
    }

    // Generate unique booking ID
    const customBookingId = generateCustomBookingId();

    // Create custom booking in database
    const customBooking = await prisma.customBooking.create({
      data: {
        customBookingId: customBookingId,
        destination: body.destination,
        tripType: body.tripType || null,
        startDate: startDate,
        endDate: endDate,
        numberOfPeople: parseInt(body.numberOfPeople),
        budget: parseFloat(body.budget),
        contactName: body.contactName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        accommodation: body.accommodation || null,
        transportation: body.transportation || null,
        specialRequirements: body.specialRequirements || null,
        description: body.description || null,
        requireGuide: body.requireGuide || false,
        proposalType: body.proposalType || 'custom_booking',
        userId: body.userId || null,
        status: 'PENDING'
      }
    });

    console.log('Custom booking created successfully:', customBooking);

    return NextResponse.json({
      success: true,
      message: 'Custom booking proposal submitted successfully',
      data: {
        id: customBooking.id,
        customBookingId: customBooking.customBookingId,
        destination: customBooking.destination,
        startDate: customBooking.startDate,
        endDate: customBooking.endDate,
        numberOfPeople: customBooking.numberOfPeople,
        budget: customBooking.budget,
        status: customBooking.status
      }
    });

  } catch (error) {
    console.error('Error creating custom booking:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'A booking with this information already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookingId = searchParams.get('bookingId');

    let customBookings;

    if (bookingId) {
      // Get specific booking
      customBookings = await prisma.customBooking.findUnique({
        where: {
          customBookingId: bookingId
        }
      });
    } else if (userId) {
      // Get bookings for specific user
      customBookings = await prisma.customBooking.findMany({
        where: {
          userId: parseInt(userId)
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Get all bookings (admin only - should add auth check)
      customBookings = await prisma.customBooking.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: customBookings
    });

  } catch (error) {
    console.error('Error fetching custom bookings:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
