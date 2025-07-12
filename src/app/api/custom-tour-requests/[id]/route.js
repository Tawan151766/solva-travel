import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma.js';

// GET /api/custom-tour-requests/[id] - Get specific custom tour request
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    console.log('Fetching custom tour request with ID:', id);
    
    // Try to find by trackingNumber first, then by database id
    const customTourRequest = await prisma.customTourRequest.findFirst({
      where: {
        OR: [
          { trackingNumber: id },
          { id: id }
        ]
      },
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
        },
        bookings: {
          include: {
            customer: {
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

    if (!customTourRequest) {
      return NextResponse.json(
        { error: 'Custom tour request not found' },
        { status: 404 }
      );
    }

    // If there's a token, verify user can access this request
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        
        // Allow access if user owns the request or is staff
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
        
        if (user.role !== 'STAFF' && user.role !== 'ADMIN' && customTourRequest.userId !== userId) {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
      } catch (error) {
        // Continue as guest access for public requests
      }
    }

    return NextResponse.json({
      success: true,
      request: customTourRequest
    });

  } catch (error) {
    console.error('Get custom tour request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/custom-tour-requests/[id] - Update custom tour request
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Check if custom tour request exists
    const existingRequest = await prisma.customTourRequest.findUnique({
      where: { id }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Custom tour request not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = existingRequest.userId === userId;
    const isStaff = user.role === 'STAFF' || user.role === 'ADMIN';

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Prepare update data based on user role
    let updateData = {};

    if (isOwner && !isStaff) {
      // Regular users can only update basic information if status is PENDING
      if (existingRequest.status !== 'PENDING') {
        return NextResponse.json(
          { error: 'Cannot modify request that is already being processed' },
          { status: 400 }
        );
      }

      const {
        contactName,
        contactEmail,
        contactPhone,
        destination,
        startDate,
        endDate,
        numberOfPeople,
        budget,
        accommodation,
        transportation,
        activities,
        specialRequirements,
        description
      } = body;

      updateData = {
        ...(contactName && { contactName }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone && { contactPhone }),
        ...(destination && { destination }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(numberOfPeople && { numberOfPeople: parseInt(numberOfPeople) }),
        ...(budget !== undefined && { budget: parseFloat(budget) }),
        ...(accommodation !== undefined && { accommodation }),
        ...(transportation !== undefined && { transportation }),
        ...(activities !== undefined && { activities }),
        ...(specialRequirements !== undefined && { specialRequirements }),
        ...(description !== undefined && { description })
      };
    } else if (isStaff) {
      // Staff can update status, assignment, and response
      const {
        status,
        assignedStaffId,
        responseNotes,
        estimatedCost,
        responseDate
      } = body;

      updateData = {
        ...(status && { status }),
        ...(assignedStaffId !== undefined && { assignedStaffId }),
        ...(responseNotes !== undefined && { responseNotes }),
        ...(estimatedCost !== undefined && { estimatedCost: parseFloat(estimatedCost) }),
        ...(responseDate !== undefined && { responseDate: new Date(responseDate) })
      };

      // If providing a quote, update status and response date
      if (estimatedCost !== undefined && !responseDate) {
        updateData.status = 'QUOTED';
        updateData.responseDate = new Date();
      }
    }

    // Update the request
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
      request: updatedRequest,
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

// DELETE /api/custom-tour-requests/[id] - Cancel custom tour request
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check if custom tour request exists and belongs to user
    const existingRequest = await prisma.customTourRequest.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Custom tour request not found' },
        { status: 404 }
      );
    }

    // Check if request can be cancelled
    if (existingRequest.status === 'COMPLETED' || existingRequest.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed or already cancelled requests' },
        { status: 400 }
      );
    }

    // Update request status to cancelled
    const cancelledRequest = await prisma.customTourRequest.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    return NextResponse.json({
      success: true,
      request: cancelledRequest,
      message: 'Custom tour request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel custom tour request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
