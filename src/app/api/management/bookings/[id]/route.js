import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request, { params }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verify(token, JWT_SECRET);
      
      // Check if user has admin role
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;

      // Fetch booking by ID with related data
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          travelPackage: {
            select: {
              id: true,
              name: true,
              location: true,
              duration: true,
              price: true,
              description: true
            }
          }
        }
      });

      if (!booking) {
        return NextResponse.json({ 
          message: 'Booking not found' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: booking
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verify(token, JWT_SECRET);
      
      // Check if user has admin role
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;
      const body = await request.json();

      // Check if booking exists
      const existingBooking = await prisma.booking.findUnique({
        where: { id }
      });

      if (!existingBooking) {
        return NextResponse.json({ 
          message: 'Booking not found' 
        }, { status: 404 });
      }

      // Prepare update data
      const updateData = {};
      
      if (body.status !== undefined) {
        // Validate status
        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(body.status)) {
          return NextResponse.json({ 
            message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
          }, { status: 400 });
        }
        updateData.status = body.status;
      }

      if (body.notes !== undefined) {
        updateData.notes = body.notes;
      }

      if (body.travelDate !== undefined) {
        updateData.travelDate = new Date(body.travelDate);
      }

      if (body.numberOfTravelers !== undefined) {
        updateData.numberOfTravelers = parseInt(body.numberOfTravelers);
      }

      if (body.totalAmount !== undefined) {
        updateData.totalAmount = parseFloat(body.totalAmount);
      }

      if (body.specialRequests !== undefined) {
        updateData.specialRequests = body.specialRequests;
      }

      // Update booking
      const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          travelPackage: {
            select: {
              id: true,
              name: true,
              location: true,
              duration: true,
              price: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Booking updated successfully',
        data: updatedBooking
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = verify(token, JWT_SECRET);
      
      // Check if user has admin role
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;

      // Check if booking exists
      const existingBooking = await prisma.booking.findUnique({
        where: { id }
      });

      if (!existingBooking) {
        return NextResponse.json({ 
          message: 'Booking not found' 
        }, { status: 404 });
      }

      // Check if booking can be deleted (e.g., not in completed status)
      if (existingBooking.status === 'COMPLETED') {
        return NextResponse.json({ 
          message: 'Cannot delete completed bookings' 
        }, { status: 400 });
      }

      // Delete booking
      await prisma.booking.delete({
        where: { id }
      });

      return NextResponse.json({
        success: true,
        message: 'Booking deleted successfully'
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
