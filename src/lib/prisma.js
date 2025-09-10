import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// Create optimized Prisma client configuration for Prisma Accelerate
const createPrismaClient = () => {
  const baseConfig = {
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  }

  // Check if using Prisma Accelerate
  if (process.env.DATABASE_URL?.includes('accelerate.prisma-data.net')) {
    console.log('🚀 Configuring Prisma for Prisma Accelerate...')
    
    return new PrismaClient({
      ...baseConfig,
      // Prisma Accelerate handles connection pooling automatically
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
  }

  // Enhanced connection settings for direct PostgreSQL (fallback)
  if (process.env.DATABASE_URL?.includes('render.com') || process.env.DATABASE_URL?.includes('db.prisma.io')) {
    console.log('🔧 Configuring Prisma for direct PostgreSQL connection...')
    
    // Add connection pooling parameters to the URL
    const baseUrl = process.env.DATABASE_URL.split('?')[0]
    const optimizedUrl = `${baseUrl}?sslmode=require&connect_timeout=60&pool_timeout=60&pgbouncer=true&connection_limit=5&pool_size=5`
    
    return new PrismaClient({
      ...baseConfig,
      datasources: {
        db: {
          url: optimizedUrl
        }
      }
    })
  }

  return new PrismaClient(baseConfig)
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Add connection retry logic with better error handling
prisma.$connect().catch((error) => {
  console.error('❌ Failed to connect to database:', error)
  console.log('🔄 Retrying connection in 3 seconds...')
  setTimeout(() => {
    prisma.$connect().catch(console.error)
  }, 3000)
})

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔌 Disconnecting Prisma client...')
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  console.log('🔌 Disconnecting Prisma client...')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('🔌 Disconnecting Prisma client...')
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
