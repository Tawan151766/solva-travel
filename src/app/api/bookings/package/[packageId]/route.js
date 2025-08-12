import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

// GET /api/bookings/package/[packageId] - Get bookings for specific package
export async function GET(request, { params }) {
  try {
    const { packageId } = params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where = {
      packageId,
      ...(status && { status }),
      ...(startDate && endDate && {
        startDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const bookings = await prisma.booking.findMany({
      where,
      select: {
        id: true,
        bookingNumber: true,
        trackingId: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        startDate: true,
        endDate: true,
        numberOfPeople: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
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

    // Get package info
    const packageInfo = await prisma.travelPackage.findUnique({
      where: { id: packageId },
      select: {
        id: true,
        name: true,
        location: true,
        duration: true,
        imageUrl: true,
        maxCapacity: true
      }
    });

    // Calculate occupancy statistics
    const occupancyStats = await prisma.booking.aggregate({
      where: {
        packageId,
        status: { in: ['CONFIRMED', 'PENDING'] }
      },
      _sum: {
        numberOfPeople: true
      }
    });

    const totalBookedPeople = occupancyStats._sum.numberOfPeople || 0;
    const occupancyRate = packageInfo?.maxCapacity 
      ? Math.round((totalBookedPeople / packageInfo.maxCapacity) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: bookings,
      package: packageInfo,
      statistics: {
        totalBookings: total,
        totalBookedPeople,
        occupancyRate,
        availableCapacity: packageInfo?.maxCapacity 
          ? packageInfo.maxCapacity - totalBookedPeople 
          : null
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get package bookings error:', error);
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
