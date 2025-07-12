import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

// PUT /api/management/custom-tour-requests/[id] - Update custom tour request
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if user has operator/admin role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (user.role !== 'OPERATOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, responseNotes, estimatedCost } = body;

    // Validate the custom tour request exists
    const existingRequest = await prisma.customTourRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Custom tour request not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      ...(status && { status }),
      ...(responseNotes !== undefined && { responseNotes }),
      ...(estimatedCost !== undefined && { estimatedCost: parseFloat(estimatedCost) }),
      responseDate: new Date()
    };

    const updatedRequest = await prisma.customTourRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        assignedStaff: {
          include: {
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

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'Custom tour request updated successfully'
    });

  } catch (error) {
    console.error('Update custom tour request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/management/custom-tour-requests/[id] - Delete custom tour request
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if user has operator/admin role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || (user.role !== 'OPERATOR' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { id } = await params;

    // Check if the request exists
    const existingRequest = await prisma.customTourRequest.findUnique({
      where: { id },
      include: {
        bookings: true
      }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Custom tour request not found' },
        { status: 404 }
      );
    }

    // Check if there are related bookings
    if (existingRequest.bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete custom tour request with associated bookings' },
        { status: 400 }
      );
    }

    await prisma.customTourRequest.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Custom tour request deleted successfully'
    });

  } catch (error) {
    console.error('Delete custom tour request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
