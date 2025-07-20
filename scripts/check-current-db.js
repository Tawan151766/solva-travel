import dotenv from 'dotenv';

// Load environment files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('🎯 CURRENT DATABASE_URL:');
console.log(process.env.DATABASE_URL || 'NOT SET');

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('\n📊 Connection Details:');
    console.log('🏠 Host:', url.hostname);
    console.log('🚪 Port:', url.port || '5432');
    console.log('💾 Database:', url.pathname.substring(1));
    
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      console.log('\n🏠 Using LOCAL DATABASE');
    } else if (url.hostname.includes('amazonaws.com')) {
      console.log('\n☁️  Using AWS RDS');
    }
  } catch (error) {
    console.log('❌ Error parsing URL:', error.message);
  }
}