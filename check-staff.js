const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const staffUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ['STAFF', 'ADMIN', 'OPERATOR']
        }
      },
      include: {
        staffProfile: true
      }
    });
    
    console.log('Staff users:', staffUsers.length);
    console.log('Staff details:');
    staffUsers.forEach(user => {
      console.log(`- ${user.firstName} ${user.lastName} (${user.role}) - Profile: ${user.staffProfile ? 'EXISTS' : 'MISSING'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
