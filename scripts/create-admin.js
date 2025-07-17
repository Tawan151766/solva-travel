import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@solva.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@solva.com',
        password: hashedPassword,
        phone: '0812345678',
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true
      }
    });
    
    console.log('✅ Admin user created/updated successfully:');
    console.log('📧 Email: admin@solva.com');
    console.log('🔐 Password: admin123');
    console.log('👤 Role: ADMIN');
    console.log('📱 Phone: 0812345678');
    console.log('🆔 User ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();