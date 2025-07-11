import { NextResponse } from 'next/server';
import { travelData } from '../../../../../data/travelData.js';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    console.log('Individual travel package API called for ID:', id);

    // Convert string ID to number for comparison
    const packageId = parseInt(id, 10);

    // Find the travel package by ID
    const travelPackage = travelData.find(pkg => pkg.id === packageId);

    if (!travelPackage) {
      return NextResponse.json({
        success: false,
        message: 'Travel package not found'
      }, { status: 404 });
    }

    console.log(`Retrieved travel package: ${travelPackage.title}`);

    return NextResponse.json({
      success: true,
      message: 'Travel package retrieved successfully',
      data: travelPackage
    }, { status: 200 });

  } catch (error) {
    console.error('Get travel package error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}