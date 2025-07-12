const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'jane.new@example.com' }
    });
    console.log('User role:', user?.role);
    console.log('User data:', { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, role: user?.role });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
