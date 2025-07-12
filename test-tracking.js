const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTrackingNumber() {
  try {
    // Function to generate unique tracking number
    function generateTrackingNumber() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      
      return `CTR-${year}${month}${day}-${random}`;
    }

    // Generate unique tracking number
    let trackingNumber;
    let isUnique = false;
    
    while (!isUnique) {
      trackingNumber = generateTrackingNumber();
      const existing = await prisma.customTourRequest.findFirst({
        where: { trackingNumber }
      });
      if (!existing) {
        isUnique = true;
      }
    }

    console.log('Generated tracking number:', trackingNumber);

    // Create test request
    const testRequest = await prisma.customTourRequest.create({
      data: {
        trackingNumber,
        contactName: 'Test User',
        contactEmail: 'test@example.com',
        contactPhone: '0812345678',
        destination: 'Tokyo, Japan',
        startDate: new Date('2024-12-25'),
        endDate: new Date('2024-12-30'),
        numberOfPeople: 2,
        description: 'Test custom tour request with tracking number',
        status: 'PENDING'
      }
    });

    console.log('Created test request with tracking number:', testRequest.trackingNumber);
    console.log('Request ID:', testRequest.id);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTrackingNumber();
