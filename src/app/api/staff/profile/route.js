import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// Verify JWT token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.verify(token, secret);
};

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

    const body = await request.json();
    const { 
      userId, 
      employeeId, 
      department, 
      position, 
      salary, 
      hireDate, 
      bio, 
      specializations = [], 
      languages = [] 
    } = body;

    // Verify user exists and is staff/admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { staffProfile: true }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    if (!['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json({
        success: false,
        message: 'User is not a staff member'
      }, { status: 400 });
    }

    // Check if requesting user has permission (only admin or the user themselves)
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN' && decoded.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient permissions'
      }, { status: 403 });
    }

    let staffProfile;
    
    if (user.staffProfile) {
      // Update existing staff profile
      staffProfile = await prisma.staffProfile.update({
        where: { userId },
        data: {
          employeeId,
          department,
          position,
          salary: salary ? parseFloat(salary) : null,
          hireDate: new Date(hireDate),
          bio,
          specializations,
          languages
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      });
    } else {
      // Create new staff profile
      staffProfile = await prisma.staffProfile.create({
        data: {
          userId,
          employeeId,
          department,
          position,
          salary: salary ? parseFloat(salary) : null,
          hireDate: new Date(hireDate),
          bio,
          specializations,
          languages
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Staff profile updated successfully',
      data: { staffProfile }
    }, { status: 200 });

  } catch (error) {
    console.error('Staff profile error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: 'Employee ID already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    const staffProfile = await prisma.staffProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            profileImage: true,
            isActive: true,
            createdAt: true
          }
        }
      }
    });

    if (!staffProfile) {
      return NextResponse.json({
        success: false,
        message: 'Staff profile not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { staffProfile }
    }, { status: 200 });

  } catch (error) {
    console.error('Get staff profile error:', error);
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
