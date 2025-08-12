import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/nextauth.js';

// GET /api/bookings/[id] - Get specific booking by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            location: true,
            duration: true,
            imageUrl: true,
            images: true,
            description: true,
            includes: true,
            excludes: true
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
                email: true,
                phoneNumber: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user has access to this booking
    if (currentUserId && booking.userId && booking.userId !== currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
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

// PUT /api/bookings/[id] - Update booking
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (currentUserId && existingBooking.userId && existingBooking.userId !== currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData = {};
    const allowedFields = [
      'customerName', 'customerEmail', 'customerPhone',
      'startDate', 'endDate', 'numberOfPeople',
      'specialRequirements', 'notes', 'status',
      'paymentStatus', 'totalAmount', 'pricePerPerson'
    ];

    // Only include allowed fields in update
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updateData[field] = new Date(body[field]);
        } else if (field === 'numberOfPeople') {
          updateData[field] = parseInt(body[field]);
        } else if (field === 'totalAmount' || field === 'pricePerPerson') {
          updateData[field] = parseFloat(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
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
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    });

  } catch (error) {
    console.error('Update booking error:', error);
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

// DELETE /api/bookings/[id] - Cancel/Delete booking
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        status: true,
        startDate: true
      }
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (currentUserId && existingBooking.userId && existingBooking.userId !== currentUserId) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if booking can be cancelled
    const now = new Date();
    const startDate = new Date(existingBooking.startDate);
    const daysDifference = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));

    if (daysDifference < 3 && existingBooking.status === 'CONFIRMED') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot cancel booking less than 3 days before travel date' 
        },
        { status: 400 }
      );
    }

    // Update booking status to CANCELLED instead of deleting
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { 
        status: 'CANCELLED',
        cancelledAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
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
