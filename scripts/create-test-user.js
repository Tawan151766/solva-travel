import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
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
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
