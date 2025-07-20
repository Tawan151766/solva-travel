import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdditionalData() {
  try {
    console.log('🌱 Seeding additional data...\n');

    // Get users and packages
    const users = await prisma.user.findMany({ where: { role: 'USER' } });
    const packages = await prisma.travelPackage.findMany();
    const staff = await prisma.staffProfile.findMany();

    console.log(`Found ${users.length} users, ${packages.length} packages, ${staff.length} staff`);

    // Create test user if none exist
    if (users.length === 0) {
      console.log('Creating test user...');
      const testUser = await prisma.user.create({
        data: {
          email: 'john.doe@example.com',
          password: '$2b$10$MP0AHJ4TchMj3.tYdM4Pb.sDw8FwCweE8qz91cLU5RM63J7YN099C', // password123
          firstName: 'John',
          lastName: 'Doe',
          phone: '0123456789',
          role: 'USER',
          isEmailVerified: true
        }
      });
      users.push(testUser);
      console.log('✅ Test user created');
    }

    // Create bookings
    console.log('\n📅 Creating bookings...');
    const bookingsData = [
      {
        customerId: users[0].id,
        packageId: packages[0]?.id,
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-08-22'),
        numberOfPeople: 2,
        totalAmount: 2598.00,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        customerEmail: users[0].email,
        customerName: `${users[0].firstName} ${users[0].lastName}`,
        customerPhone: users[0].phone || '0123456789',
        notes: 'Honeymoon trip - please arrange romantic dinner',
        specialRequirements: 'Vegetarian meals, sea view room'
      },
      {
        customerId: users[0].id,
        packageId: packages[1]?.id || packages[0]?.id,
        startDate: new Date('2025-09-10'),
        endDate: new Date('2025-09-15'),
        numberOfPeople: 4,
        totalAmount: 3596.00,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        customerEmail: users[0].email,
        customerName: `${users[0].firstName} ${users[0].lastName}`,
        customerPhone: users[0].phone || '0123456789',
        notes: 'Family vacation with 2 children',
        specialRequirements: 'Child-friendly activities, connecting rooms'
      }
    ];

    for (const bookingData of bookingsData) {
      if (bookingData.packageId) {
        const bookingNumber = `BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        const booking = await prisma.booking.create({
          data: { ...bookingData, bookingNumber }
        });

        console.log(`✅ Created booking: ${booking.bookingNumber}`);
      }
    }

    // Create custom tour requests
    console.log('\n🗺️ Creating custom tour requests...');
    const customToursData = [
      {
        userId: users[0]?.id,
        contactName: `${users[0].firstName} ${users[0].lastName}`,
        contactEmail: users[0].email,
        contactPhone: users[0].phone || '0123456789',
        destination: 'Northern Thailand',
        startDate: new Date('2025-10-01'),
        endDate: new Date('2025-10-07'),
        numberOfPeople: 6,
        budget: 8000.00,
        accommodation: 'Mid-range hotels and local guesthouses',
        transportation: 'Private van with driver',
        activities: 'Trekking, village visits, cooking classes, temple tours',
        specialRequirements: 'Vegetarian meals, English-speaking guide',
        description: 'Looking for an authentic cultural experience in Northern Thailand.',
        status: 'IN_PROGRESS',
        assignedStaffId: staff[0]?.id,
        responseNotes: 'Preparing detailed itinerary with local community visits',
        estimatedCost: 7500.00
      },
      {
        contactName: 'Mike Johnson',
        contactEmail: 'mike@example.com',
        contactPhone: '0555123456',
        destination: 'Adventure Mountains',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-10'),
        numberOfPeople: 8,
        budget: 12000.00,
        accommodation: 'Mountain lodges and camping',
        transportation: '4WD vehicles',
        activities: 'Rock climbing, hiking, white water rafting, camping',
        specialRequirements: 'Experienced adventure guide, safety equipment',
        description: 'Extreme adventure tour for experienced outdoor enthusiasts.',
        status: 'PENDING'
      }
    ];

    for (const tourData of customToursData) {
      const trackingNumber = `CTR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      const customTour = await prisma.customTourRequest.create({
        data: { ...tourData, trackingNumber }
      });

      console.log(`✅ Created custom tour: ${customTour.trackingNumber}`);
    }

    // Create reviews
    console.log('\n⭐ Creating reviews...');
    const reviewsData = [
      {
        reviewerId: users[0]?.id,
        packageId: packages[0]?.id,
        rating: 5,
        title: 'Amazing Experience!',
        comment: 'This was the best vacation ever! The guide was knowledgeable and the accommodations were perfect.',
        reviewType: 'PACKAGE',
        isPublic: true,
        isVerified: true,
        userEmail: users[0]?.email,
        userName: users[0] ? `${users[0].firstName} ${users[0].lastName}` : 'John Doe'
      },
      {
        reviewerId: users[0]?.id,
        packageId: packages[1]?.id || packages[0]?.id,
        rating: 4,
        title: 'Great Cultural Experience',
        comment: 'Loved the cultural aspects and the food was incredible. Would recommend to anyone interested in authentic experiences.',
        reviewType: 'PACKAGE',
        isPublic: true,
        isVerified: true,
        userEmail: users[0]?.email,
        userName: users[0] ? `${users[0].firstName} ${users[0].lastName}` : 'John Doe'
      }
    ];

    for (const reviewData of reviewsData) {
      if (reviewData.reviewerId && reviewData.packageId) {
        const review = await prisma.review.create({
          data: reviewData
        });
        console.log(`✅ Created review: ${review.title}`);
      }
    }

    // Final summary
    console.log('\n📊 Final database summary:');
    const finalCounts = {
      users: await prisma.user.count(),
      packages: await prisma.travelPackage.count(),
      bookings: await prisma.booking.count(),
      customTours: await prisma.customTourRequest.count(),
      reviews: await prisma.review.count(),
      gallery: await prisma.gallery.count(),
      staff: await prisma.staffProfile.count()
    };

    console.log(`👥 Users: ${finalCounts.users}`);
    console.log(`📦 Travel Packages: ${finalCounts.packages}`);
    console.log(`📅 Bookings: ${finalCounts.bookings}`);
    console.log(`🗺️ Custom Tours: ${finalCounts.customTours}`);
    console.log(`⭐ Reviews: ${finalCounts.reviews}`);
    console.log(`🖼️ Gallery Images: ${finalCounts.gallery}`);
    console.log(`👨‍💼 Staff Profiles: ${finalCounts.staff}`);

    console.log('\n🎉 Additional data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding additional data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdditionalData();