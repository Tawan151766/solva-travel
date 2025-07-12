import { NextResponse } from 'next/server';

// Simple test API without Prisma
export async function GET(request) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Bookings API GET is working',
      bookings: []
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error: ' + error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const {
      bookingType,
      packageId,
      customTourRequestId,
      startDate,
      endDate,
      numberOfPeople,
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
      notes
    } = body;

    if (!bookingType || !startDate || !endDate || !numberOfPeople || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate fake booking response
    const mockBooking = {
      id: 'mock-booking-' + Date.now(),
      bookingNumber: `BK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      bookingType,
      packageId: bookingType === 'PACKAGE' ? packageId : null,
      customTourRequestId: bookingType === 'CUSTOM' ? customTourRequestId : null,
      startDate,
      endDate,
      numberOfPeople: parseInt(numberOfPeople),
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
      notes,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: bookingType === 'PACKAGE' ? numberOfPeople * 5000 : 15000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      booking: mockBooking,
      message: 'Mock booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
