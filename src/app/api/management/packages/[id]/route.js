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
      
      // Check if user has operator or admin role
      if (!['OPERATOR', 'ADMIN'].includes(decoded.role)) {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Operator or Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;

      // Fetch package by ID with booking count
      const travelPackage = await prisma.travelPackage.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              bookings: true
            }
          },
          bookings: {
            select: {
              id: true,
              status: true,
              createdAt: true,
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

      if (!travelPackage) {
        return NextResponse.json({ 
          message: 'Travel package not found' 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: travelPackage
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error fetching package:', error);
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
      
      // Check if user has operator or admin role
      if (!['OPERATOR', 'ADMIN'].includes(decoded.role)) {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Operator or Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;
      const body = await request.json();

      // Check if package exists
      const existingPackage = await prisma.travelPackage.findUnique({
        where: { id }
      });

      if (!existingPackage) {
        return NextResponse.json({ 
          message: 'Travel package not found' 
        }, { status: 404 });
      }

      // Prepare update data
      const updateData = {};
      
      if (body.name !== undefined) {
        if (!body.name.trim()) {
          return NextResponse.json({ 
            message: 'Package name cannot be empty' 
          }, { status: 400 });
        }
        updateData.name = body.name.trim();
      }

      if (body.description !== undefined) {
        if (!body.description.trim()) {
          return NextResponse.json({ 
            message: 'Package description cannot be empty' 
          }, { status: 400 });
        }
        updateData.description = body.description.trim();
      }

      if (body.location !== undefined) {
        if (!body.location.trim()) {
          return NextResponse.json({ 
            message: 'Package location cannot be empty' 
          }, { status: 400 });
        }
        updateData.location = body.location.trim();
      }

      if (body.duration !== undefined) {
        const duration = parseInt(body.duration);
        if (isNaN(duration) || duration <= 0) {
          return NextResponse.json({ 
            message: 'Duration must be a positive number' 
          }, { status: 400 });
        }
        updateData.duration = duration;
      }

      if (body.price !== undefined) {
        const price = parseFloat(body.price);
        if (isNaN(price) || price <= 0) {
          return NextResponse.json({ 
            message: 'Price must be a positive number' 
          }, { status: 400 });
        }
        updateData.price = price;
      }

      if (body.maxTravelers !== undefined) {
        const maxTravelers = parseInt(body.maxTravelers);
        if (isNaN(maxTravelers) || maxTravelers <= 0) {
          return NextResponse.json({ 
            message: 'Max travelers must be a positive number' 
          }, { status: 400 });
        }
        updateData.maxTravelers = maxTravelers;
      }

      if (body.highlights !== undefined) {
        updateData.highlights = Array.isArray(body.highlights) ? body.highlights : [];
      }

      if (body.included !== undefined) {
        updateData.included = Array.isArray(body.included) ? body.included : [];
      }

      if (body.excluded !== undefined) {
        updateData.excluded = Array.isArray(body.excluded) ? body.excluded : [];
      }

      if (body.images !== undefined) {
        updateData.images = Array.isArray(body.images) ? body.images : [];
      }

      // Update package
      const updatedPackage = await prisma.travelPackage.update({
        where: { id },
        data: updateData,
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
        message: 'Travel package updated successfully',
        data: updatedPackage
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error updating package:', error);
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
      
      // Check if user has operator or admin role
      if (!['OPERATOR', 'ADMIN'].includes(decoded.role)) {
        return NextResponse.json({ 
          message: 'Insufficient permissions. Operator or Admin role required.' 
        }, { status: 403 });
      }

      const { id } = params;

      // Check if package exists
      const existingPackage = await prisma.travelPackage.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              bookings: true
            }
          }
        }
      });

      if (!existingPackage) {
        return NextResponse.json({ 
          message: 'Travel package not found' 
        }, { status: 404 });
      }

      // Check if package has bookings
      if (existingPackage._count.bookings > 0) {
        return NextResponse.json({ 
          message: 'Cannot delete package with existing bookings. Please handle all bookings first.' 
        }, { status: 400 });
      }

      // Delete package
      await prisma.travelPackage.delete({
        where: { id }
      });

      return NextResponse.json({
        success: true,
        message: 'Travel package deleted successfully'
      });

    } catch (tokenError) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
