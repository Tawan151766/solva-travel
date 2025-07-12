import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma.js';

export async function GET(request) {
  try {
    // Get all custom tour requests for debugging
    const customTourRequests = await prisma.customTourRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get all bookings for debugging  
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        package: {
          select: {
            name: true,
            location: true
          }
        },
        customTourRequest: {
          select: {
            trackingNumber: true,
            destination: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        customTourRequests: {
          count: customTourRequests.length,
          items: customTourRequests
        },
        bookings: {
          count: bookings.length,
          items: bookings
        }
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
