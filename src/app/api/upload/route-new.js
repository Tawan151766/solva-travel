import { NextRequest, NextResponse } from 'next/server';
import CloudinaryService from '../../../lib/cloudinary.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/nextauth';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    // Debug request headers
    console.log('🔍 Upload API - Request received');
    console.log('Upload API - Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Upload API - Cookies:', request.headers.get('cookie'));
    
    // Check authentication - try NextAuth first, then fallback to legacy auth
    const session = await getServerSession(authOptions);
    console.log('Upload API - NextAuth Session:', session);
    
    let user = null;
    let authHeader = null;
    
    if (session?.user) {
      // NextAuth user
      user = session.user;
      console.log('Upload API - Using NextAuth user:', user.email);
    } else {
      // Try legacy auth token
      authHeader = request.headers.get('authorization');
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      if (bearerToken) {
        try {
          // Verify legacy JWT token
          const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
          user = { 
            id: decoded.userId, 
            email: decoded.email, 
            role: decoded.role,
            firstName: decoded.firstName 
          };
          console.log('Upload API - Using legacy auth user:', user.email);
        } catch (error) {
          console.log('Upload API - Invalid legacy token:', error.message);
        }
      }
    }
    
    if (!user) {
      console.log('Upload API - No valid authentication found');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          debug: {
            hasNextAuthSession: !!session,
            hasAuthHeader: !!authHeader,
            headers: Object.fromEntries(request.headers.entries()),
            cookies: request.headers.get('cookie') || 'No cookies'
          }
        },
        { status: 401 }
      );
    }

    // Check if user has permission (ADMIN, OPERATOR, or STAFF)
    const allowedRoles = ['ADMIN', 'OPERATOR', 'STAFF'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'package'; // 'package', 'gallery', etc.

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const cloudinaryService = new CloudinaryService();
    const uploadResult = await cloudinaryService.uploadBuffer(
      buffer,
      file.name,
      {
        folder: `solva-travel/${type}`, // Organize by upload type
        tags: [type, user.role, 'travel-package']
      }
    );

    console.log('✅ Upload successful:', uploadResult.public_id);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully to Cloudinary',
      data: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        url: uploadResult.url,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        created_at: uploadResult.created_at,
        uploadedBy: user.id,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('🚨 Upload API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
