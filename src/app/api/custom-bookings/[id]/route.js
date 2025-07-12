import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    console.log('Fetching custom booking with ID:', id);

    // Try to find by customBookingId first, then by database id
    let customBooking = await prisma.customBooking.findUnique({
      where: {
        customBookingId: id
      }
    });

    // If not found by customBookingId, try by database id
    if (!customBooking) {
      customBooking = await prisma.customBooking.findUnique({
        where: {
          id: id
        }
      });
    }

    if (!customBooking) {
      return NextResponse.json({
        success: false,
        message: 'Custom booking not found'
      }, { status: 404 });
    }

    console.log('Custom booking found:', customBooking);

    return NextResponse.json({
      success: true,
      data: customBooking
    });

  } catch (error) {
    console.error('Error fetching custom booking:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
