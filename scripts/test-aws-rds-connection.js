import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('🔍 Testing AWS RDS Connection...\n');

// Show connection details
const dbUrl = process.env.DATABASE_URL;
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
} else {
  console.log('❌ No DATABASE_URL found');
  process.exit(1);
}

// Test connection with timeout
async function testConnection() {
  const prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    console.log('🔄 Attempting to connect to AWS RDS...');
    
    // Set a timeout for the connection test
    const connectionPromise = prisma.$connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('✅ Successfully connected to AWS RDS!');

    // Test a simple query
    console.log('🔄 Testing database query...');
    const result = await prisma.$queryRaw`SELECT version() as version, now() as current_time`;
    console.log('✅ Database query successful!');
    console.log('📋 Database Info:', result[0]);

    // Test if tables exist
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
    } catch (error) {
      console.log('⚠️  Could not get data counts:', error.message);
    }

  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('💬 Error:', error.message);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if AWS RDS instance is running');
    console.log('2. Verify Security Group allows port 5432 from your IP');
    console.log('3. Check VPC and Network ACL settings');
    console.log('4. Ensure RDS is publicly accessible (if connecting from outside VPC)');
    console.log('5. Verify database credentials are correct');
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
  
  return true;
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 AWS RDS connection test completed successfully!');
      process.exit(0);
    } else {
      console.log('\n❌ AWS RDS connection test failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });