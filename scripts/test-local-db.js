import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('🔍 Testing Local Database Connection...\n');

const dbUrl = process.env.DATABASE_URL;
console.log('🎯 DATABASE_URL:', dbUrl);

if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log('📊 Connection Details:');
    console.log('🏠 Host:', url.hostname);
    console.log('🚪 Port:', url.port || '5432');
    console.log('💾 Database:', url.pathname.substring(1));
    console.log('👤 Username:', url.username);
    console.log('');
  } catch (error) {
    console.log('❌ Invalid DATABASE_URL format');
    process.exit(1);
  }
}

async function testLocalConnection() {
  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    console.log('🔄 Attempting to connect to local PostgreSQL...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to local database!');

    // Test a simple query
    console.log('🔄 Testing database query...');
    const result = await prisma.$queryRaw`SELECT version() as version, now() as current_time`;
    console.log('✅ Database query successful!');
    console.log('📋 Database Info:', result[0]);

    // Check if our tables exist
    console.log('🔄 Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log(`✅ Found ${tables.length} tables in database:`);
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Test data count
    console.log('🔄 Checking data counts...');
    try {
      const userCount = await prisma.user.count();
      const packageCount = await prisma.travelPackage.count();
      const bookingCount = await prisma.booking.count();
      
      console.log('📊 Data Summary:');
      console.log(`  👥 Users: ${userCount}`);
      console.log(`  📦 Travel Packages: ${packageCount}`);
      console.log(`  📅 Bookings: ${bookingCount}`);
      
      if (userCount === 0 && packageCount === 0) {
        console.log('\n⚠️  Database is empty! You may need to run:');
        console.log('   npm run db:seed');
      }
    } catch (error) {
      console.log('⚠️  Could not get data counts:', error.message);
    }

    return true;

  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('💬 Error:', error.message);
    
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Make sure PostgreSQL is running locally');
    console.log('2. Check if database "solva_travel" exists');
    console.log('3. Verify username/password are correct');
    console.log('4. Run: docker-compose up -d (if using Docker)');
    console.log('5. Or start PostgreSQL service manually');
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testLocalConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Local database connection test completed successfully!');
      console.log('💡 You can now restart your Next.js server: npm run dev');
      process.exit(0);
    } else {
      console.log('\n❌ Local database connection test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });