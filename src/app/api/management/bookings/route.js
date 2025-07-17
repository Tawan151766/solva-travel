import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
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

      // Fetch all bookings with related data
      const bookings = await prisma.booking.findMany({
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
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: bookings,
        total: bookings.length
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
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

      const body = await request.json();
      const { 
        userId, 
        travelPackageId, 
        travelDate, 
        numberOfTravelers, 
        totalAmount,
        specialRequests,
        status = 'PENDING'
      } = body;

      // Validate required fields
      if (!userId || !travelPackageId || !travelDate || !numberOfTravelers || !totalAmount) {
        return NextResponse.json({ 
          message: 'Missing required fields: userId, travelPackageId, travelDate, numberOfTravelers, totalAmount' 
        }, { status: 400 });
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return NextResponse.json({ 
          message: 'User not found' 
        }, { status: 404 });
      }

      // Verify travel package exists
      const travelPackage = await prisma.travelPackage.findUnique({
        where: { id: travelPackageId }
      });

      if (!travelPackage) {
        return NextResponse.json({ 
          message: 'Travel package not found' 
        }, { status: 404 });
      }

      // Create new booking
      const newBooking = await prisma.booking.create({
        data: {
          userId,
          travelPackageId,
          travelDate: new Date(travelDate),
          numberOfTravelers: parseInt(numberOfTravelers),
          totalAmount: parseFloat(totalAmount),
          specialRequests,
          status
        },
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
        message: 'Booking created successfully',
        data: newBooking
      }, { status: 201 });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
