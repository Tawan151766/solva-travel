import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createOperatorUser() {
  try {
    const hashedPassword = await bcrypt.hash('operator123', 10);
    
    const operator = await prisma.user.upsert({
      where: { email: 'operator@solva.com' },
      update: {
        password: hashedPassword,
        role: 'OPERATOR'
      },
      create: {
        firstName: 'Operator',
        lastName: 'Admin',
        email: 'operator@solva.com',
        password: hashedPassword,
        phone: '0987654321',
        role: 'OPERATOR',
        isActive: true
      }
    });
    
    console.log('✅ Operator user created/updated successfully:');
    console.log('📧 Email: operator@solva.com');
    console.log('🔐 Password: operator123');
    console.log('👤 Role: OPERATOR');
    console.log('📱 Phone: 0987654321');
    console.log('🆔 User ID:', operator.id);
    
  } catch (error) {
    console.error('❌ Error creating operator user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOperatorUser();
