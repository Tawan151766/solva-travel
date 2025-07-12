import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create operator user
    const operator = await prisma.user.upsert({
      where: { email: 'operator@test.com' },
      update: {
        password: hashedPassword,
        role: 'OPERATOR'
      },
      create: {
        firstName: 'Operator',
        lastName: 'Admin',
        email: 'operator@test.com',
        password: hashedPassword,
        phone: '0987654321',
        role: 'OPERATOR',
        isActive: true,
        isEmailVerified: true
      }
    });

    const user = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {
        password: hashedPassword
      },
      create: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '0123456789',
        role: 'USER',
        isActive: true
      }
    });
    
    console.log('Test user created/updated:', user);
    console.log('Operator user created/updated:', operator);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
