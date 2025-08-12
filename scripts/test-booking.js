const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestBooking() {
  try {
    // Get a travel package
    const pkg = await prisma.travelPackage.findFirst({
      where: { isActive: true }
    });
    
    if (!pkg) {
      console.log('No active travel packages found');
      return;
    }
    
    // Generate unique identifiers
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const trackingId = `TRK${timestamp.slice(-6)}${random}`;
    const bookingNumber = `BK${timestamp}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        trackingId,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com', 
        customerPhone: '+1234567890',
        packageId: pkg.id,
        packageName: pkg.name,
        packageLocation: pkg.location,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-20'),
        numberOfPeople: 2,
        totalAmount: 2000,
        pricePerPerson: 1000,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });
    
    console.log('Test booking created successfully!');
    console.log('Booking Number:', booking.bookingNumber);
    console.log('Tracking ID:', booking.trackingId);
    console.log('Package:', booking.packageName);
    
  } catch (error) {
    console.error('Error creating test booking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBooking();
