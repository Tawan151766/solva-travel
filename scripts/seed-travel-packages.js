const { PrismaClient } = require('@prisma/client');
const { samplePackages } = require('../sample-travel-packages');

const prisma = new PrismaClient();

async function seedTravelPackages() {
  try {
    console.log('Starting to seed travel packages...');

    // Clear existing packages (optional)
    // await prisma.travelPackage.deleteMany({});
    // console.log('Cleared existing packages');

    // Add sample packages
    for (const packageData of samplePackages) {
      const createdPackage = await prisma.travelPackage.create({
        data: {
          name: packageData.name,
          title: packageData.title,
          description: packageData.description,
          overview: packageData.overview,
          highlights: packageData.highlights,
          itinerary: packageData.itinerary,
          price: packageData.price,
          priceDetails: packageData.priceDetails,
          duration: packageData.duration,
          durationText: packageData.durationText,
          maxCapacity: packageData.maxCapacity,
          location: packageData.location,
          destination: packageData.destination,
          category: packageData.category,
          difficulty: packageData.difficulty,
          includes: packageData.includes,
          excludes: packageData.excludes,
          accommodation: packageData.accommodation,
          imageUrl: packageData.imageUrl,
          images: packageData.images,
          galleryImages: packageData.galleryImages,
          isRecommended: packageData.isRecommended,
          rating: packageData.rating,
          totalReviews: packageData.totalReviews,
          tags: packageData.tags,
          seoTitle: packageData.seoTitle,
          seoDescription: packageData.seoDescription,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log(`✅ Created package: ${createdPackage.name} (ID: ${createdPackage.id})`);
    }

    console.log('✅ Successfully seeded all travel packages!');

    // Display created packages
    const allPackages = await prisma.travelPackage.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        price: true,
        duration: true,
        category: true,
        rating: true,
        isRecommended: true
      }
    });

    console.log('\n📋 Current packages in database:');
    allPackages.forEach(pkg => {
      console.log(`- ${pkg.name} (${pkg.category}) - $${pkg.price} - ${pkg.duration} days - Rating: ${pkg.rating} ${pkg.isRecommended ? '⭐' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error seeding travel packages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedTravelPackages();
}

module.exports = { seedTravelPackages };
