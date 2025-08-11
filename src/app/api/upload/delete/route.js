import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    // Security check: only allow deletion from uploads directory
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    try {
      await unlink(fullPath);
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json(
          { success: false, error: 'File not found' },
          { status: 404 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
