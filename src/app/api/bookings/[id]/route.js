import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// GET /api/bookings/[id] - Get specific booking
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        customerId: userId // Ensure user can only access their own bookings
      },
      include: {
        package: true,
        customTourRequest: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        customerId: userId
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Validate update permissions based on booking status
    if (existingBooking.status === 'COMPLETED' || existingBooking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot modify completed or cancelled bookings' },
        { status: 400 }
      );
    }

    const {
      startDate,
      endDate,
      numberOfPeople,
      customerName,
      customerEmail,
      customerPhone,
      specialRequirements,
      notes,
      status
    } = body;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(numberOfPeople && { numberOfPeople: parseInt(numberOfPeople) }),
        ...(customerName && { customerName }),
        ...(customerEmail && { customerEmail }),
        ...(customerPhone && { customerPhone }),
        ...(specialRequirements !== undefined && { specialRequirements }),
        ...(notes !== undefined && { notes }),
        ...(status && { status })
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

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if booking exists and belongs to user
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id,
        customerId: userId
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking can be cancelled
    if (existingBooking.status === 'COMPLETED' || existingBooking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed or already cancelled bookings' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        paymentStatus: existingBooking.paymentStatus === 'PAID' ? 'REFUNDED' : 'PENDING'
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

    return NextResponse.json({
      success: true,
      booking: cancelledBooking,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
