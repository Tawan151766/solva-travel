import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user has operator or admin role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || (user.role !== 'OPERATOR' && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Fetch statistics
    const [totalUsers, totalBookings, totalPackages, pendingBookings] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.travelPackage.count(),
      prisma.booking.count({
        where: { status: 'PENDING' }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalPackages,
        pendingBookings
      }
    });

  } catch (error) {
    console.error('Management stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
