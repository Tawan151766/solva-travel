// Test API status endpoint directly
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('🧪 Testing API Status Logic...\n');

async function testStatusLogic() {
  const startTime = Date.now();
  
  try {
    console.log('🔄 Testing database connection...');
    
    const prisma = new PrismaClient();
    
    // Test database connection
    const connectionTest = await prisma.$queryRaw`SELECT version() as version, now() as current_time`;
    const dbVersion = connectionTest[0];
    
    console.log('✅ Database connection successful!');
    console.log('📋 Version:', dbVersion.version);
    
    // Get database stats
    console.log('🔄 Getting database statistics...');
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.travelPackage.count(),
      prisma.booking.count(),
      prisma.customTourRequest.count(),
      prisma.review.count(),
      prisma.gallery.count(),
      prisma.staffProfile.count()
    ]);

    console.log('📊 Database Statistics:');
    console.log(`  👥 Users: ${stats[0]}`);
    console.log(`  📦 Travel Packages: ${stats[1]}`);
    console.log(`  📅 Bookings: ${stats[2]}`);
    console.log(`  🗺️ Custom Tour Requests: ${stats[3]}`);
    console.log(`  ⭐ Reviews: ${stats[4]}`);
    console.log(`  🖼️ Gallery Images: ${stats[5]}`);
    console.log(`  👨‍💼 Staff Profiles: ${stats[6]}`);

    // Get table information
    console.log('🔄 Getting table information...');
    const tables = await prisma.$queryRaw`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    console.log(`🗂️ Database Tables (${tables.length}):`);
    tables.forEach(t => {
      console.log(`  - ${t.table_name} (${t.column_count} columns)`);
    });

    const responseTime = Date.now() - startTime;

    // Parse DATABASE_URL for display
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

    console.log('\n🎯 Connection Info:');
    console.log(`  Type: ${dbInfo.type}`);
    console.log(`  Host: ${dbInfo.host}`);
    console.log(`  Port: ${dbInfo.port}`);
    console.log(`  Database: ${dbInfo.database}`);
    console.log(`  Response Time: ${responseTime}ms`);

    await prisma.$disconnect();

    console.log('\n✅ API Status test completed successfully!');
    console.log('💡 Your /api/status endpoint should work now');
    
    return true;

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.log('\n❌ API Status test failed!');
    console.log('💬 Error:', error.message);
    console.log(`⏱️ Response Time: ${responseTime}ms`);
    
    return false;
  }
}

testStatusLogic().catch(console.error);