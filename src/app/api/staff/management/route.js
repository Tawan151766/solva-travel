import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// Verify JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.verify(token, secret);
};

export async function GET(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Only admin can view all staff
    if (!['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient permissions'
      }, { status: 403 });
    }

    const url = new URL(request.url);
    const department = url.searchParams.get('department');
    const isAvailable = url.searchParams.get('isAvailable');

    let where = {
      role: {
        in: ['STAFF', 'ADMIN']
      },
      isActive: true
    };

    let include = {
      staffProfile: {
        where: {}
      },
      reviewsReceived: {
        select: {
          rating: true,
          reviewType: true,
          createdAt: true,
          reviewer: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      managing: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      }
    };

    // Filter by department
    if (department) {
      include.staffProfile.where.department = department;
    }

    // Filter by availability
    if (isAvailable !== null) {
      include.staffProfile.where.isAvailable = isAvailable === 'true';
    }

    const staff = await prisma.user.findMany({
      where,
      include,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        profileImage: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        staffProfile: true,
        reviewsReceived: true,
        managing: true,
        _count: {
          select: {
            reviewsReceived: true,
            managing: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter out users without staff profiles if department filter is applied
    const filteredStaff = staff.filter(user => user.staffProfile !== null);

    return NextResponse.json({
      success: true,
      data: { staff: filteredStaff }
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff list error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Access token is required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Only admin can manage staff relationships
    if (!['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient permissions'
      }, { status: 403 });
    }

    const body = await request.json();
    const { managerId, staffId, action } = body; // action: 'add' or 'remove'

    if (!managerId || !staffId || !action) {
      return NextResponse.json({
        success: false,
        message: 'Manager ID, Staff ID, and action are required'
      }, { status: 400 });
    }

    // Verify both users exist and are staff
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: { staffProfile: true }
    });

    const staff = await prisma.user.findUnique({
      where: { id: staffId },
      include: { staffProfile: true }
    });

    if (!manager || !staff) {
      return NextResponse.json({
        success: false,
        message: 'Manager or staff member not found'
      }, { status: 404 });
    }

    if (!manager.staffProfile || !staff.staffProfile) {
      return NextResponse.json({
        success: false,
        message: 'Both users must have staff profiles'
      }, { status: 400 });
    }

    let result;

    if (action === 'add') {
      // Add management relationship
      result = await prisma.user.update({
        where: { id: staffId },
        data: {
          managedBy: {
            connect: { id: managerId }
          }
        },
        include: {
          managedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
              staffProfile: {
                select: {
                  position: true,
                  department: true
                }
              }
            }
          }
        }
      });
    } else if (action === 'remove') {
      // Remove management relationship
      result = await prisma.user.update({
        where: { id: staffId },
        data: {
          managedBy: {
            disconnect: { id: managerId }
          }
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid action. Use "add" or "remove"'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Management relationship ${action}ed successfully`,
      data: { result }
    }, { status: 200 });

  } catch (error) {
    console.error('Staff management error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
