// Database connection test for Prisma Accelerate
import prisma from './src/lib/prisma.js'

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    console.log('📡 Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful:', result)
    
    // Test table access
    console.log('🔍 Testing table access...')
    
    try {
      const userCount = await prisma.user.count()
      console.log('👥 User count:', userCount)
    } catch (error) {
      console.log('⚠️  User table access error:', error.message)
    }
    
    try {
      const packageCount = await prisma.travelPackage.count()
      console.log('📦 Travel package count:', packageCount)
    } catch (error) {
      console.log('⚠️  Travel package table access error:', error.message)
    }
    
    try {
      const galleryCount = await prisma.gallery.count()
      console.log('🖼️  Gallery count:', galleryCount)
    } catch (error) {
      console.log('⚠️  Gallery table access error:', error.message)
    }
    
    console.log('🎉 Database connection test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
