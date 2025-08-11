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
      
      // Check if user has admin role
      if (decoded.role !== 'ADMIN') {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Admin role required.' 
        }, { status: 403 });
      }

      const body = await request.json();
      
      // Validate required fields based on current Prisma schema
      if (!body.name || !body.description || !body.location || !body.durationDays || !body.priceNumber || !body.maxCapacity) {
        return NextResponse.json({ 
          message: 'Missing required fields: name, description, location, durationDays, priceNumber, maxCapacity' 
        }, { status: 400 });
      }

      // Validate numeric fields
      if (isNaN(body.durationDays) || isNaN(body.priceNumber) || isNaN(body.maxCapacity)) {
        return NextResponse.json({ 
          message: 'durationDays, priceNumber, and maxCapacity must be valid numbers' 
        }, { status: 400 });
      }

      if (body.durationDays <= 0 || body.priceNumber <= 0 || body.maxCapacity <= 0) {
        return NextResponse.json({ 
          message: 'durationDays, priceNumber, and maxCapacity must be positive numbers' 
        }, { status: 400 });
      }

      // Create new travel package with current schema
      const newPackage = await prisma.travelPackage.create({
        data: {
          name: body.name.trim(),
          title: body.title?.trim() || body.name.trim(), // Use name as fallback for title
          description: body.description.trim(),
          overview: body.overview?.trim() || '',
          highlights: body.highlights || [],
          price: parseFloat(body.priceNumber),
          priceDetails: body.priceDetails || {},
          duration: parseInt(body.durationDays),
          durationText: body.durationText?.trim() || `${body.durationDays} days`,
          maxCapacity: parseInt(body.maxCapacity),
          location: body.location.trim(),
          destination: body.destination?.trim() || body.location.trim(),
          category: body.category || 'Cultural',
          difficulty: body.difficulty || 'Easy',
          includes: body.includes || [],
          excludes: body.excludes || [],
          accommodation: body.accommodation || {},
          images: body.images || [],
          imageUrl: body.imageUrl || (body.images && body.images[0]) || '',
          isRecommended: body.isRecommended || false,
          isActive: body.isActive !== false,
          rating: parseFloat(body.rating) || 0,
          totalReviews: parseInt(body.totalReviews) || 0,
          tags: body.tags || [],
          itinerary: body.itinerary || {},
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