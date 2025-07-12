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
      
      // Check if user has operator or admin role
      if (!['OPERATOR', 'ADMIN'].includes(decoded.role)) {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Operator or Admin role required.' 
        }, { status: 403 });
      }

      // Fetch all travel packages with booking count
      const packages = await prisma.travelPackage.findMany({
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return NextResponse.json({
        success: true,
        data: packages,
        total: packages.length
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching packages:', error);
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
      
      // Check if user has operator or admin role
      if (!['OPERATOR', 'ADMIN'].includes(decoded.role)) {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Operator or Admin role required.' 
        }, { status: 403 });
      }

      const body = await request.json();
      const { 
        name, 
        description, 
        location, 
        duration, 
        price, 
        maxTravelers,
        highlights,
        included,
        excluded,
        images
      } = body;

      // Validate required fields
      if (!name || !description || !location || !duration || !price || !maxTravelers) {
        return NextResponse.json({ 
          message: 'Missing required fields: name, description, location, duration, price, maxTravelers' 
        }, { status: 400 });
      }

      // Validate numeric fields
      if (isNaN(duration) || isNaN(price) || isNaN(maxTravelers)) {
        return NextResponse.json({ 
          message: 'Duration, price, and maxTravelers must be valid numbers' 
        }, { status: 400 });
      }

      if (duration <= 0 || price <= 0 || maxTravelers <= 0) {
        return NextResponse.json({ 
          message: 'Duration, price, and maxTravelers must be positive numbers' 
        }, { status: 400 });
      }

      // Create new travel package
      const newPackage = await prisma.travelPackage.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          duration: parseInt(duration),
          price: parseFloat(price),
          maxTravelers: parseInt(maxTravelers),
          highlights: highlights || [],
          included: included || [],
          excluded: excluded || [],
          images: images || []
        },
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Travel package created successfully',
        data: newPackage
      }, { status: 201 });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
