import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log('Searching bookings with query:', query);

    // Search bookings by booking number or customer info
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          {
            bookingNumber: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            customerEmail: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            customerName: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            customerPhone: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            location: true
          }
        },
        customTourRequest: {
          select: {
            id: true,
            trackingNumber: true,
            destination: true
          }
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit results
    });

    if (bookings.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบการจองที่ตรงกับข้อมูลที่ค้นหา' },
        { status: 404 }
      );
    }

    // If exact match found, return single result
    const exactMatch = bookings.find(booking => 
      booking.bookingNumber.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) {
      console.log('Found exact booking match:', exactMatch.bookingNumber);
      return NextResponse.json({
        success: true,
        data: exactMatch,
        type: 'booking'
      });
    }

    // Return multiple results
    console.log(`Found ${bookings.length} booking matches`);
    return NextResponse.json({
      success: true,
      data: bookings,
      type: 'bookings',
      count: bookings.length
    });

  } catch (error) {
    console.error('Search bookings error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการค้นหา' },
      { status: 500 }
    );
  }
}
