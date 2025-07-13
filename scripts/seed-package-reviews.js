const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedPackageReviews() {
  try {
    console.log('Starting to seed package reviews...');

    // First, get or create a test user for reviews
    let testUser = await prisma.user.findUnique({
      where: { email: 'reviewer@test.com' }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          firstName: 'Test',
          lastName: 'Reviewer',
          email: 'reviewer@test.com',
          password: '$2b$10$N9qo8uLOickgx2ZMRZoMye1m5n8nTXM3Zk1N1q2E.',
          phone: '0800000000',
          role: 'USER',
          isActive: true
        }
      });
      console.log('Created test reviewer user');
    }

    // Get existing packages
    const packages = await prisma.travelPackage.findMany({
      where: {
        name: {
          in: ['Amazing Thailand Adventure', 'Japanese Cultural Journey']
        }
      },
      select: { id: true, name: true }
    });

    console.log('Found packages:', packages);

    // Sample reviews data
    const reviewsData = [
      // Thailand Adventure Reviews
      {
        packageName: 'Amazing Thailand Adventure',
        reviews: [
          {
            userName: 'Sarah Johnson',
            userEmail: 'sarah@email.com',
            rating: 5,
            comment: 'Absolutely incredible experience! The temples were breathtaking and our guide was fantastic. The cooking class was a highlight!',
            isVerified: true
          },
          {
            userName: 'Michael Chen',
            userEmail: 'michael@email.com',
            rating: 5,
            comment: 'Perfect blend of culture and relaxation. The beaches in Phuket were pristine and the elephant sanctuary was ethical and amazing.',
            isVerified: true
          },
          {
            userName: 'Emma Wilson',
            userEmail: 'emma@email.com',
            rating: 4,
            comment: 'Great tour overall! Hotel accommodations were excellent. Only minor issue was some activities felt rushed.',
            isVerified: true
          },
          {
            userName: 'David Rodriguez',
            userEmail: 'david@email.com',
            rating: 5,
            comment: 'This was our honeymoon trip and it exceeded all expectations. Every detail was perfectly planned!',
            isVerified: true
          },
          {
            userName: 'Lisa Thompson',
            userEmail: 'lisa@email.com',
            rating: 4,
            comment: 'Wonderful cultural immersion. The floating market visit was unique and the food was incredible throughout.',
            isVerified: true
          }
        ]
      },
      // Japanese Cultural Journey Reviews
      {
        packageName: 'Japanese Cultural Journey',
        reviews: [
          {
            userName: 'Robert Kim',
            userEmail: 'robert@email.com',
            rating: 5,
            comment: 'The ryokan experience was unforgettable! Seeing Mount Fuji and riding the bullet train were bucket list items completed.',
            isVerified: true
          },
          {
            userName: 'Jennifer Park',
            userEmail: 'jennifer@email.com',
            rating: 5,
            comment: 'Perfect introduction to Japanese culture. The tea ceremony was so peaceful and educational.',
            isVerified: true
          },
          {
            userName: 'Mark Williams',
            userEmail: 'mark@email.com',
            rating: 4,
            comment: 'Amazing temples and the bamboo grove in Kyoto was magical. Would definitely recommend!',
            isVerified: true
          },
          {
            userName: 'Amanda Davis',
            userEmail: 'amanda@email.com',
            rating: 5,
            comment: 'Everything was perfectly organized. Our guide spoke excellent English and was very knowledgeable about Japanese history.',
            isVerified: true
          }
        ]
      }
    ];

    // Create reviews for each package
    for (const packageReviews of reviewsData) {
      const packageData = packages.find(p => p.name === packageReviews.packageName);
      
      if (packageData) {
        console.log(`\nCreating reviews for ${packageData.name}...`);
        
        for (const reviewData of packageReviews.reviews) {
          const createdReview = await prisma.review.create({
            data: {
              reviewerId: testUser.id,
              userName: reviewData.userName,
              userEmail: reviewData.userEmail,
              rating: reviewData.rating,
              comment: reviewData.comment,
              isVerified: reviewData.isVerified,
              packageId: packageData.id,
              reviewType: 'PACKAGE',
              isPublic: true,
              createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
              updatedAt: new Date()
            }
          });
          
          console.log(`  ✅ Created review by ${reviewData.userName} - ${reviewData.rating} stars`);
        }
      }
    }

    // Update package ratings and review counts
    console.log('\nUpdating package ratings...');
    
    for (const pkg of packages) {
      const reviews = await prisma.review.findMany({
        where: { 
          packageId: pkg.id,
          reviewType: 'PACKAGE'
        },
        select: { rating: true }
      });

      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await prisma.travelPackage.update({
          where: { id: pkg.id },
          data: {
            rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviews.length
          }
        });
        
        console.log(`  ✅ Updated ${pkg.name}: ${avgRating.toFixed(1)} stars (${reviews.length} reviews)`);
      }
    }

    console.log('\n✅ Successfully seeded all package reviews!');

    // Display summary
    const reviewSummary = await prisma.review.groupBy({
      by: ['packageId'],
      where: {
        reviewType: 'PACKAGE',
        packageId: { not: null }
      },
      _count: { id: true },
      _avg: { rating: true }
    });

    console.log('\n📊 Package Review Summary:');
    for (const summary of reviewSummary) {
      const pkg = packages.find(p => p.id === summary.packageId);
      console.log(`- ${pkg?.name}: ${summary._count.id} reviews, avg rating: ${summary._avg.rating?.toFixed(1)}`);
    }

  } catch (error) {
    console.error('❌ Error seeding package reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedPackageReviews();
}

module.exports = { seedPackageReviews };
