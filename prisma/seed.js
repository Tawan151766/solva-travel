import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedPassword = await bcryptjs.hash('admin123', 10)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@solva.com' },
    update: {},
    create: {
      email: 'admin@solva.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create staff users with profiles
  const staffData = [
    {
      email: 'sarah.johnson@solva.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0123',
      department: 'TOURS',
      position: 'Senior Tour Guide',
      bio: 'Passionate about sharing the beauty of our destinations with over 8 years of experience.',
      specializations: ['Cultural Tours', 'Adventure Travel', 'Photography'],
      languages: ['English', 'Spanish', 'French'],
    },
    {
      email: 'michael.chen@solva.com',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1-555-0124',
      department: 'CUSTOMER_SERVICE',
      position: 'Customer Service Manager',
      bio: 'Dedicated to ensuring exceptional customer experiences and satisfaction.',
      specializations: ['Customer Relations', 'Problem Resolution', 'Travel Planning'],
      languages: ['English', 'Mandarin', 'Japanese'],
    },
    {
      email: 'emma.rodriguez@solva.com',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      phone: '+1-555-0125',
      department: 'SALES',
      position: 'Travel Sales Specialist',
      bio: 'Expert in creating customized travel packages that exceed expectations.',
      specializations: ['Luxury Travel', 'Group Tours', 'Corporate Travel'],
      languages: ['English', 'Spanish', 'Portuguese'],
    },
  ]

  for (const staff of staffData) {
    const staffPassword = await bcryptjs.hash('staff123', 10)
    
    const user = await prisma.user.upsert({
      where: { email: staff.email },
      update: {},
      create: {
        email: staff.email,
        password: staffPassword,
        firstName: staff.firstName,
        lastName: staff.lastName,
        phone: staff.phone,
        role: 'STAFF',
        isEmailVerified: true,
        staffProfile: {
          create: {
            employeeId: `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            department: staff.department,
            position: staff.position,
            hireDate: new Date('2022-01-01'),
            bio: staff.bio,
            specializations: staff.specializations,
            languages: staff.languages,
            rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            totalReviews: Math.floor(Math.random() * 50) + 10,
          }
        }
      },
    })

    console.log('✅ Staff user created:', user.email)
  }

  // Create travel packages
  const packages = [
    {
      name: 'Tropical Paradise Getaway',
      description: 'Experience pristine beaches, crystal clear waters, and luxury accommodations in our most popular tropical destination.',
      price: 1299.99,
      duration: 7,
      maxCapacity: 20,
      location: 'Maldives',
      images: [
        '/images/tropical-1.jpg',
        '/images/tropical-2.jpg',
        '/images/tropical-3.jpg'
      ],
    },
    {
      name: 'Mountain Adventure Trek',
      description: 'Challenge yourself with breathtaking mountain views, guided hiking trails, and cozy mountain lodges.',
      price: 899.99,
      duration: 5,
      maxCapacity: 15,
      location: 'Swiss Alps',
      images: [
        '/images/mountain-1.jpg',
        '/images/mountain-2.jpg',
        '/images/mountain-3.jpg'
      ],
    },
    {
      name: 'Cultural Heritage Tour',
      description: 'Immerse yourself in rich history, ancient architecture, and local traditions with expert local guides.',
      price: 1099.99,
      duration: 10,
      maxCapacity: 25,
      location: 'Italy',
      images: [
        '/images/cultural-1.jpg',
        '/images/cultural-2.jpg',
        '/images/cultural-3.jpg'
      ],
    },
    {
      name: 'Safari Wildlife Experience',
      description: 'Witness incredible wildlife in their natural habitat with comfortable safari lodges and expert guides.',
      price: 1599.99,
      duration: 8,
      maxCapacity: 12,
      location: 'Kenya',
      images: [
        '/images/safari-1.jpg',
        '/images/safari-2.jpg',
        '/images/safari-3.jpg'
      ],
    },
  ]

  for (const pkg of packages) {
    const travelPackage = await prisma.travelPackage.create({
      data: pkg,
    })

    console.log('✅ Travel package created:', travelPackage.name)
  }

  // Create gallery images
  const galleryData = [
    {
      title: "Tropical Beach Paradise",
      description: "Crystal clear waters and pristine white sand beaches",
      imageUrl: "/images/gallery/beach-1.jpg",
      category: "BEACH",
      location: "Maldives",
      tags: ["beach", "tropical", "paradise", "clear water", "sand"],
    },
    {
      title: "Sunset Over Ocean",
      description: "Breathtaking sunset view over the endless ocean",
      imageUrl: "/images/gallery/beach-2.jpg",
      category: "BEACH",
      location: "Bali",
      tags: ["sunset", "ocean", "romantic", "evening", "peaceful"],
    },
    {
      title: "Mountain Peak Adventure",
      description: "Majestic mountain peaks reaching towards the sky",
      imageUrl: "/images/gallery/mountain-1.jpg",
      category: "MOUNTAIN",
      location: "Swiss Alps",
      tags: ["mountain", "peak", "adventure", "hiking", "alpine"],
    },
    {
      title: "Alpine Lake View",
      description: "Serene alpine lake surrounded by snow-capped mountains",
      imageUrl: "/images/gallery/mountain-2.jpg",
      category: "MOUNTAIN",
      location: "Canada",
      tags: ["lake", "alpine", "snow", "reflection", "serene"],
    },
    {
      title: "Modern City Skyline",
      description: "Impressive city skyline with modern architecture",
      imageUrl: "/images/gallery/city-1.jpg",
      category: "CITY",
      location: "Tokyo",
      tags: ["city", "skyline", "modern", "architecture", "urban"],
    },
    {
      title: "Historic City Center",
      description: "Charming historic buildings and cobblestone streets",
      imageUrl: "/images/gallery/city-2.jpg",
      category: "CITY",
      location: "Prague",
      tags: ["historic", "cobblestone", "architecture", "culture", "old town"],
    },
    {
      title: "Dense Forest Path",
      description: "Mystical forest path through ancient trees",
      imageUrl: "/images/gallery/forest-1.jpg",
      category: "FOREST",
      location: "Amazon",
      tags: ["forest", "trees", "nature", "path", "mystical"],
    },
    {
      title: "Desert Dunes",
      description: "Golden sand dunes stretching to the horizon",
      imageUrl: "/images/gallery/desert-1.jpg",
      category: "DESERT",
      location: "Sahara",
      tags: ["desert", "sand", "dunes", "golden", "horizon"],
    },
    {
      title: "Cultural Heritage Site",
      description: "Ancient temple showcasing rich cultural heritage",
      imageUrl: "/images/gallery/cultural-1.jpg",
      category: "CULTURAL",
      location: "Angkor Wat",
      tags: ["temple", "ancient", "culture", "heritage", "history"],
    },
    {
      title: "Safari Wildlife",
      description: "Magnificent wildlife in their natural habitat",
      imageUrl: "/images/gallery/wildlife-1.jpg",
      category: "WILDLIFE",
      location: "Kenya",
      tags: ["safari", "wildlife", "nature", "animals", "habitat"],
    },
  ];

  for (const gallery of galleryData) {
    const galleryImage = await prisma.gallery.create({
      data: {
        ...gallery,
        uploadedBy: adminUser.id,
      },
    });

    console.log('✅ Gallery image created:', galleryImage.title);
  }

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
