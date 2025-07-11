const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedReviews() {
  try {
    console.log('🌱 Seeding reviews...');

    // Get all staff users
    const staffUsers = await prisma.user.findMany({
      where: { role: 'STAFF' }
    });

    // Get all regular users
    const regularUsers = await prisma.user.findMany({
      where: { role: 'USER' }
    });

    if (staffUsers.length === 0) {
      console.log('❌ No staff users found. Please seed staff first.');
      return;
    }

    if (regularUsers.length === 0) {
      console.log('❌ No regular users found. Creating a test user...');
      
      // Create a test user
      const testUser = await prisma.user.create({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: '$2b$10$N9qo8uLOickgx2ZMRZoMye1m5n8nTXM3Zk1N1q2E.', // hashed password
          phone: '0812345678',
          role: 'USER',
          isActive: true
        }
      });
      
      regularUsers.push(testUser);
    }

    // Sample reviews data
    const reviewsData = [
      {
        rating: 5,
        comment: "James provided excellent service during our trip to Thailand. Very knowledgeable and helpful about local attractions and customs. Highly recommend!",
        tripType: "INTERNATIONAL"
      },
      {
        rating: 4,
        comment: "Great experience with James as our guide. He was professional and made sure we had everything we needed for our journey.",
        tripType: "DOMESTIC"
      },
      {
        rating: 5,
        comment: "Outstanding service! James went above and beyond to make our honeymoon trip perfect. Thank you so much!",
        tripType: "INTERNATIONAL"
      },
      {
        rating: 4,
        comment: "Emily was fantastic! Very organized and helped us plan the perfect family vacation. Kids loved her energy.",
        tripType: "DOMESTIC"
      },
      {
        rating: 5,
        comment: "Emily's attention to detail is amazing. She thought of everything for our European tour. Best travel experience ever!",
        tripType: "INTERNATIONAL"
      },
      {
        rating: 4,
        comment: "Professional and friendly service from our staff member. Made the booking process smooth and easy.",
        tripType: "DOMESTIC"
      }
    ];

    // Create reviews for each staff member
    for (let i = 0; i < staffUsers.length; i++) {
      const staff = staffUsers[i];
      const reviewsForThisStaff = reviewsData.slice(i * 2, (i * 2) + 2); // 2 reviews per staff
      
      for (const reviewData of reviewsForThisStaff) {
        const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        
        await prisma.review.create({
          data: {
            rating: reviewData.rating,
            comment: reviewData.comment,
            reviewType: 'SERVICE',
            reviewerId: randomUser.id,
            reviewedUserId: staff.id,
            isPublic: true,
            isVerified: true
          }
        });
      }
      
      console.log(`✅ Created reviews for staff: ${staff.name}`);
    }

    console.log('🎉 Reviews seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();
