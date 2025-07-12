import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/custom-tour-requests/search - Search custom tour requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'กรุณาใส่หมายเลขคำขอ' },
        { status: 400 }
      );
    }

    // Search by partial ID match (case insensitive)
    const customTourRequest = await prisma.customTourRequest.findFirst({
      where: {
        OR: [
          {
            id: {
              endsWith: query.toLowerCase(),
              mode: 'insensitive'
            }
          },
          {
            id: {
              contains: query.toLowerCase(),
              mode: 'insensitive'
            }
          }
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
        }
      }
    });

    if (!customTourRequest) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ไม่พบคำขอที่ตรงกับหมายเลขที่ระบุ กรุณาตรวจสอบหมายเลขอีกครั้ง' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customTourRequest
    });

  } catch (error) {
    console.error('Error searching custom tour request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง' 
      },
      { status: 500 }
    );
  }
}
