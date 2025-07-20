import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const connectionTest = await prisma.$queryRaw`SELECT version() as version, now() as current_time`;
    const dbVersion = connectionTest[0];
    
    // Get database stats
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.travelPackage.count(),
      prisma.booking.count(),
      prisma.customTourRequest.count(),
      prisma.review.count(),
      prisma.gallery.count(),
      prisma.staffProfile.count()
    ]);

    // Get table information
    const tables = await prisma.$queryRaw`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    const responseTime = Date.now() - startTime;

    // Parse DATABASE_URL for display (hide password)
    let dbInfo = {};
    try {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        const url = new URL(dbUrl);
        dbInfo = {
          host: url.hostname,
          port: url.port || '5432',
          database: url.pathname.substring(1),
          username: url.username,
          type: url.hostname === 'localhost' ? 'Local PostgreSQL' : 
                url.hostname.includes('amazonaws.com') ? 'AWS RDS' : 'Remote PostgreSQL'
        };
      }
    } catch (error) {
      dbInfo = { error: 'Invalid DATABASE_URL format' };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: 'connected',
        info: dbInfo,
        version: dbVersion.version,
        serverTime: dbVersion.current_time,
        stats: {
          users: stats[0],
          travelPackages: stats[1],
          bookings: stats[2],
          customTourRequests: stats[3],
          reviews: stats[4],
          galleryImages: stats[5],
          staffProfiles: stats[6]
        },
        tables: tables.map(t => ({
          name: t.table_name,
          columns: Number(t.column_count)
        }))
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        nextVersion: process.env.npm_package_dependencies_next || 'unknown',
        prismaVersion: process.env.npm_package_dependencies_prisma || 'unknown'
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: 'disconnected',
        error: error.message,
        info: process.env.DATABASE_URL ? {
          url: process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@') // Hide password
        } : null
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    }, { status: 500 });
  }
}