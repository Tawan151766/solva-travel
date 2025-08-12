import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/nextauth.js';

export async function POST(request) {
  try {
    // Debug request headers
    console.log('Upload API - Headers:', Object.fromEntries(request.headers.entries()));
    console.log('Upload API - Cookies:', request.headers.get('cookie'));
    
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log('Upload API - Session:', session);
    
    if (!session || !session.user) {
      console.log('Upload API - No session found');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          debug: {
            hasSession: !!session,
            headers: Object.fromEntries(request.headers.entries()),
            cookies: request.headers.get('cookie') || 'No cookies'
          }
        },
        { status: 401 }
      );
    }

    // Check if user has permission (ADMIN, OPERATOR, or STAFF)
    const allowedRoles = ['ADMIN', 'OPERATOR', 'STAFF'];
    if (!allowedRoles.includes(session.user.role)) {
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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save to local storage instead of Google Drive
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Generate public URL
    const fileUrl = `/uploads/${fileName}`;

    const uploadResult = {
      id: timestamp.toString(),
      name: fileName,
      url: fileUrl,
      publicUrl: fileUrl,
      size: file.size,
      type: file.type
    };

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: uploadResult.id,
        name: uploadResult.name,
        url: uploadResult.url,
        publicUrl: uploadResult.publicUrl,
        size: uploadResult.size,
        type: uploadResult.type,
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check permissions
    const allowedRoles = ['ADMIN', 'OPERATOR', 'STAFF'];
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Delete from local storage
    // Extract filename from fileId (assuming fileId is the filename or contains the filename)
    let fileName = fileId;
    
    // If fileId is a timestamp, try to find the file by pattern
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);
    
    try {
      await unlink(filePath);
      console.log(`File deleted: ${fileName}`);
    } catch (fileError) {
      console.error(`Error deleting file ${fileName}:`, fileError);
      // File might not exist, but we'll still return success
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const googleDriveService = new GoogleDriveService();
    const files = await googleDriveService.listFiles();

    return NextResponse.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
