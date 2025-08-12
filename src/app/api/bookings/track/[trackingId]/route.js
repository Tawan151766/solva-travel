import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

// GET /api/bookings/track/[trackingId] - Track booking by tracking ID
export async function GET(request, { params }) {
  try {
    const { trackingId } = params;
    
    if (!trackingId) {
      return NextResponse.json(
        { success: false, error: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { trackingId },
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
        { success: false, error: 'Booking not found with this tracking ID' },
        { status: 404 }
      );
    }

    // Return booking data without sensitive information
    const publicBookingData = {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      trackingId: booking.trackingId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      packageName: booking.packageName,
      packageLocation: booking.packageLocation,
      startDate: booking.startDate,
      endDate: booking.endDate,
      numberOfPeople: booking.numberOfPeople,
      totalAmount: booking.totalAmount,
      pricePerPerson: booking.pricePerPerson,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      specialRequirements: booking.specialRequirements,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      package: booking.package,
      assignedStaff: booking.assignedStaff ? {
        name: `${booking.assignedStaff.user.firstName} ${booking.assignedStaff.user.lastName}`,
        email: booking.assignedStaff.user.email,
        phone: booking.assignedStaff.user.phoneNumber
      } : null
    };

    return NextResponse.json({
      success: true,
      data: publicBookingData
    });

  } catch (error) {
    console.error('Track booking error:', error);
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
