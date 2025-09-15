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

  // Create regular users
  const regularUsersData = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-1001',
      password: 'user123',
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-1002',
      password: 'user123',
    },
    {
      email: 'robert.wilson@example.com',
      firstName: 'Robert',
      lastName: 'Wilson',
      phone: '+1-555-1003',
      password: 'user123',
    },
    {
      email: 'maria.garcia@example.com',
      firstName: 'Maria',
      lastName: 'Garcia',
      phone: '+1-555-1004',
      password: 'user123',
    },
    {
      email: 'david.brown@example.com',
      firstName: 'David',
      lastName: 'Brown',
      phone: '+1-555-1005',
      password: 'user123',
    },
  ]

  const regularUsers = []
  for (const userData of regularUsersData) {
    const hashedUserPassword = await bcryptjs.hash(userData.password, 10)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        password: hashedUserPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: 'USER',
        isEmailVerified: true,
      },
    })
    
    regularUsers.push(user)
    console.log('✅ Regular user created:', user.email)
  }

  // Create staff users with profiles
  const staffData = [
    {
      email: 'sarah.johnson@solva.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0123',
      department: 'TOURS',
      position: 'Senior Tour Guide',
      bio: 'Passionate about sharing the beauty of our destinations with over 8 years of experience in cultural and adventure tourism.',
      specializations: ['Cultural Tours', 'Adventure Travel', 'Photography', 'Historical Sites'],
      languages: ['English', 'Spanish', 'French', 'Italian'],
      salary: 55000.00,
    },
    {
      email: 'michael.chen@solva.com',
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1-555-0124',
      department: 'CUSTOMER_SERVICE',
      position: 'Customer Service Manager',
      bio: 'Dedicated to ensuring exceptional customer experiences and satisfaction with 6 years in hospitality.',
      specializations: ['Customer Relations', 'Problem Resolution', 'Travel Planning', 'Multilingual Support'],
      languages: ['English', 'Mandarin', 'Japanese', 'Korean'],
      salary: 48000.00,
    },
    {
      email: 'emma.rodriguez@solva.com',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      phone: '+1-555-0125',
      department: 'SALES',
      position: 'Travel Sales Specialist',
      bio: 'Expert in creating customized travel packages that exceed expectations with 5 years of sales experience.',
      specializations: ['Luxury Travel', 'Group Tours', 'Corporate Travel', 'Honeymoon Packages'],
      languages: ['English', 'Spanish', 'Portuguese', 'French'],
      salary: 52000.00,
    },
    {
      email: 'james.mitchell@solva.com',
      firstName: 'James',
      lastName: 'Mitchell',
      phone: '+1-555-0126',
      department: 'OPERATIONS',
      position: 'Operations Coordinator',
      bio: 'Ensures smooth operation of all travel logistics and coordinates with partners worldwide.',
      specializations: ['Logistics Management', 'Vendor Relations', 'Emergency Response', 'Quality Control'],
      languages: ['English', 'German', 'Dutch'],
      salary: 50000.00,
    },
    {
      email: 'lisa.thompson@solva.com',
      firstName: 'Lisa',
      lastName: 'Thompson',
      phone: '+1-555-0127',
      department: 'MARKETING',
      position: 'Marketing Specialist',
      bio: 'Creative marketing professional focused on promoting unique travel experiences through digital channels.',
      specializations: ['Digital Marketing', 'Content Creation', 'Social Media', 'Brand Management'],
      languages: ['English', 'Spanish'],
      salary: 46000.00,
    },
  ]

  const staffUsers = []
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
            salary: staff.salary,
            hireDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            bio: staff.bio,
            specializations: staff.specializations,
            languages: staff.languages,
            rating: 4.2 + Math.random() * 0.8, // Random rating between 4.2-5.0
            totalReviews: Math.floor(Math.random() * 75) + 25, // 25-100 reviews
          }
        }
      },
    })

    staffUsers.push(user)
    console.log('✅ Staff user created:', user.email)
  }

  // Create travel packages
  const packagesData = [
    {
      name: 'Tropical Paradise Getaway',
      title: 'Maldives Luxury Resort Experience',
      description: 'Experience pristine beaches, crystal clear waters, and luxury accommodations in our most popular tropical destination. Enjoy world-class dining, spa treatments, and water activities.',
      overview: 'Discover the ultimate tropical paradise in the Maldives with overwater bungalows, pristine coral reefs, and unmatched luxury service.',
      price: 2899.99,
      duration: 7,
      durationText: '7 Days, 6 Nights',
      maxCapacity: 20,
      location: 'Maldives',
      destination: 'Male, Maldives',
      category: 'Luxury',
      difficulty: 'Easy',
      rating: 4.8,
      totalReviews: 127,
      isRecommended: true,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800',
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      highlights: [
        'Overwater bungalow accommodation',
        'Private beach access',
        'Snorkeling with tropical fish',
        'Sunset dolphin cruise',
        'Spa treatments included'
      ],
      includes: [
        'Round-trip flights',
        '6 nights luxury accommodation',
        'All meals and beverages',
        'Airport transfers',
        'Snorkeling equipment',
        'Daily spa access'
      ],
      excludes: [
        'Personal expenses',
        'Additional excursions',
        'Travel insurance',
        'Tips and gratuities'
      ],
      tags: ['luxury', 'beach', 'romantic', 'honeymoon', 'snorkeling'],
      itinerary: {
        day1: 'Arrival and welcome dinner',
        day2: 'Snorkeling and beach relaxation',
        day3: 'Dolphin cruise and spa day',
        day4: 'Island hopping tour',
        day5: 'Water sports and sunset dinner',
        day6: 'Free day and farewell party',
        day7: 'Departure'
      },
      priceDetails: {
        basePrice: 2899.99,
        taxes: 289.99,
        serviceFee: 150.00
      },
      accommodation: {
        type: 'Overwater Bungalow',
        amenities: ['AC', 'WiFi', 'Minibar', 'Ocean view', 'Private deck']
      },
      seoTitle: 'Maldives Luxury Resort - 7 Day Tropical Paradise Getaway',
      seoDescription: 'Book your dream Maldives vacation with luxury overwater bungalows, pristine beaches, and world-class amenities. 7 days of paradise awaits!'
    },
    {
      name: 'Mountain Adventure Trek',
      title: 'Swiss Alps Hiking Experience',
      description: 'Challenge yourself with breathtaking mountain views, guided hiking trails, and cozy mountain lodges in the heart of the Swiss Alps.',
      overview: 'Embark on an unforgettable alpine adventure through Switzerland\'s most scenic mountain trails with expert guides.',
      price: 1599.99,
      duration: 6,
      durationText: '6 Days, 5 Nights',
      maxCapacity: 15,
      location: 'Swiss Alps',
      destination: 'Interlaken, Switzerland',
      category: 'Adventure',
      difficulty: 'Moderate',
      rating: 4.6,
      totalReviews: 89,
      isRecommended: true,
      images: [
        'https://images.unsplash.com/photo-1531736275454-adc48d079e9d?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1464822759844-d150265c4739?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1531736275454-adc48d079e9d?w=800',
      highlights: [
        'Professional mountain guides',
        'Scenic cable car rides',
        'Alpine lake visits',
        'Traditional Swiss cuisine',
        'Mountain lodge accommodation'
      ],
      includes: [
        'Round-trip transportation',
        '5 nights mountain lodge stay',
        'All meals',
        'Professional guide service',
        'Hiking equipment',
        'Cable car tickets'
      ],
      excludes: [
        'Personal hiking gear',
        'Travel insurance',
        'Additional activities',
        'Personal expenses'
      ],
      tags: ['adventure', 'hiking', 'mountains', 'nature', 'alpine'],
      itinerary: {
        day1: 'Arrival and equipment briefing',
        day2: 'Jungfraujoch - Top of Europe',
        day3: 'Lauterbrunnen Valley hike',
        day4: 'Grindelwald to Kleine Scheidegg',
        day5: 'Lake Brienz and farewell dinner',
        day6: 'Departure'
      },
      priceDetails: {
        basePrice: 1599.99,
        taxes: 159.99,
        serviceFee: 100.00
      },
      accommodation: {
        type: 'Mountain Lodge',
        amenities: ['Heating', 'Hot water', 'Restaurant', 'Mountain view']
      },
      seoTitle: 'Swiss Alps Hiking Tour - 6 Day Mountain Adventure',
      seoDescription: 'Experience the Swiss Alps with guided hiking tours, mountain lodges, and breathtaking alpine scenery. Book your mountain adventure today!'
    },
    {
      name: 'Cultural Heritage Tour',
      title: 'Italy Historical Discovery',
      description: 'Immerse yourself in rich history, ancient architecture, and local traditions with expert local guides through Italy\'s most iconic destinations.',
      overview: 'Journey through Italy\'s cultural treasures from Rome\'s ancient ruins to Florence\'s Renaissance art and Venice\'s romantic canals.',
      price: 2199.99,
      duration: 10,
      durationText: '10 Days, 9 Nights',
      maxCapacity: 25,
      location: 'Italy',
      destination: 'Rome, Florence, Venice',
      category: 'Cultural',
      difficulty: 'Easy',
      rating: 4.7,
      totalReviews: 156,
      isRecommended: true,
      images: [
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
      highlights: [
        'Vatican Museums and Sistine Chapel',
        'Colosseum and Roman Forum',
        'Uffizi Gallery private tour',
        'Gondola ride in Venice',
        'Local cooking classes'
      ],
      includes: [
        'Round-trip flights',
        '9 nights hotel accommodation',
        'Daily breakfast',
        'Professional tour guides',
        'Museum entrance fees',
        'High-speed train tickets'
      ],
      excludes: [
        'Lunch and dinner',
        'Optional excursions',
        'Travel insurance',
        'Personal shopping'
      ],
      tags: ['culture', 'history', 'art', 'architecture', 'museums'],
      itinerary: {
        day1: 'Arrival in Rome',
        day2: 'Vatican and St. Peters Basilica',
        day3: 'Colosseum and Roman Forum',
        day4: 'Travel to Florence',
        day5: 'Uffizi Gallery and Duomo',
        day6: 'Tuscan countryside day trip',
        day7: 'Travel to Venice',
        day8: 'St. Marks Square and Doge\'s Palace',
        day9: 'Murano and Burano islands',
        day10: 'Departure'
      },
      priceDetails: {
        basePrice: 2199.99,
        taxes: 219.99,
        serviceFee: 130.00
      },
      accommodation: {
        type: '4-Star Hotels',
        amenities: ['AC', 'WiFi', 'Breakfast', 'Central location']
      },
      seoTitle: 'Italy Cultural Tour - 10 Day Rome Florence Venice',
      seoDescription: 'Discover Italy\'s cultural heritage with visits to Rome, Florence, and Venice. Expert guides, museum tours, and luxury accommodations included.'
    },
    {
      name: 'Safari Wildlife Experience',
      title: 'Kenya Big Five Safari',
      description: 'Witness incredible wildlife in their natural habitat with comfortable safari lodges, expert guides, and once-in-a-lifetime game drives.',
      overview: 'Experience the thrill of African wildlife in Kenya\'s premier national parks with luxury safari lodges and expert naturalist guides.',
      price: 3299.99,
      duration: 8,
      durationText: '8 Days, 7 Nights',
      maxCapacity: 12,
      location: 'Kenya',
      destination: 'Masai Mara, Amboseli',
      category: 'Wildlife',
      difficulty: 'Easy',
      rating: 4.9,
      totalReviews: 73,
      isRecommended: true,
      images: [
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
      highlights: [
        'Big Five wildlife viewing',
        'Great Migration experience',
        'Luxury safari lodges',
        'Professional safari guides',
        'Cultural village visits'
      ],
      includes: [
        'Round-trip flights',
        '7 nights safari lodge accommodation',
        'All meals and beverages',
        '4x4 safari vehicles',
        'Professional guides',
        'Park entrance fees'
      ],
      excludes: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Optional activities',
        'Tips and gratuities'
      ],
      tags: ['safari', 'wildlife', 'big five', 'africa', 'photography'],
      itinerary: {
        day1: 'Arrival in Nairobi',
        day2: 'Masai Mara National Reserve',
        day3: 'Full day game drives',
        day4: 'Masai village visit',
        day5: 'Travel to Amboseli',
        day6: 'Amboseli game drives',
        day7: 'Return to Nairobi',
        day8: 'Departure'
      },
      priceDetails: {
        basePrice: 3299.99,
        taxes: 329.99,
        serviceFee: 200.00
      },
      accommodation: {
        type: 'Luxury Safari Lodge',
        amenities: ['En-suite bathroom', 'Game viewing deck', 'Restaurant', 'WiFi']
      },
      seoTitle: 'Kenya Safari Tour - 8 Day Big Five Wildlife Experience',
      seoDescription: 'Experience Kenya\'s incredible wildlife with luxury safari lodges, expert guides, and guaranteed Big Five sightings. Book your African adventure!'
    },
    {
      name: 'City Explorer Package',
      title: 'Tokyo Modern Culture Tour',
      description: 'Discover the perfect blend of traditional culture and modern innovation in Japan\'s bustling capital city.',
      overview: 'Explore Tokyo\'s vibrant neighborhoods, from ancient temples to futuristic districts, with insider access to local experiences.',
      price: 1899.99,
      duration: 5,
      durationText: '5 Days, 4 Nights',
      maxCapacity: 18,
      location: 'Tokyo, Japan',
      destination: 'Tokyo, Japan',
      category: 'Urban',
      difficulty: 'Easy',
      rating: 4.5,
      totalReviews: 94,
      isRecommended: false,
      images: [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
        'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      highlights: [
        'Shibuya and Harajuku districts',
        'Traditional sushi making class',
        'Senso-ji Temple visit',
        'Tokyo Skytree observation',
        'Robot restaurant show'
      ],
      includes: [
        'Round-trip flights',
        '4 nights hotel accommodation',
        'Daily breakfast',
        'JR Pass for transportation',
        'Guided city tours',
        'Cultural experiences'
      ],
      excludes: [
        'Lunch and dinner',
        'Personal shopping',
        'Optional activities',
        'Travel insurance'
      ],
      tags: ['city', 'culture', 'modern', 'traditional', 'food'],
      itinerary: {
        day1: 'Arrival and Shibuya exploration',
        day2: 'Asakusa and traditional Tokyo',
        day3: 'Harajuku and modern districts',
        day4: 'Day trip to Mount Fuji area',
        day5: 'Last-minute shopping and departure'
      },
      priceDetails: {
        basePrice: 1899.99,
        taxes: 189.99,
        serviceFee: 120.00
      },
      accommodation: {
        type: 'Modern City Hotel',
        amenities: ['AC', 'WiFi', 'City view', 'Breakfast included']
      },
      seoTitle: 'Tokyo City Tour - 5 Day Modern Culture Experience',
      seoDescription: 'Discover Tokyo\'s amazing blend of traditional and modern culture. City tours, cultural experiences, and modern accommodations included.'
    },
    {
      name: 'Adventure Sports Package',
      title: 'New Zealand Extreme Adventure',
      description: 'Get your adrenaline pumping with bungee jumping, skydiving, and white-water rafting in the adventure capital of the world.',
      overview: 'Experience New Zealand\'s most thrilling adventures in Queenstown with professional instructors and world-class safety standards.',
      price: 2499.99,
      duration: 7,
      durationText: '7 Days, 6 Nights',
      maxCapacity: 10,
      location: 'Queenstown, New Zealand',
      destination: 'Queenstown, New Zealand',
      category: 'Adventure',
      difficulty: 'Hard',
      rating: 4.8,
      totalReviews: 62,
      isRecommended: true,
      images: [
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      highlights: [
        'Kawarau Gorge bungee jump',
        'Tandem skydiving experience',
        'Shotover Jet boat ride',
        'White-water rafting',
        'Milford Sound cruise'
      ],
      includes: [
        'Round-trip flights',
        '6 nights accommodation',
        'All adventure activities',
        'Professional instruction',
        'Safety equipment',
        'Transportation to activities'
      ],
      excludes: [
        'Meals',
        'Travel insurance (required)',
        'Personal expenses',
        'Medical clearance fees'
      ],
      tags: ['extreme', 'adventure', 'adrenaline', 'sports', 'newzealand'],
      itinerary: {
        day1: 'Arrival and orientation',
        day2: 'Bungee jumping and jet boat',
        day3: 'Skydiving experience',
        day4: 'White-water rafting',
        day5: 'Milford Sound day trip',
        day6: 'Free day and relaxation',
        day7: 'Departure'
      },
      priceDetails: {
        basePrice: 2499.99,
        taxes: 249.99,
        serviceFee: 150.00
      },
      accommodation: {
        type: 'Adventure Lodge',
        amenities: ['Comfortable beds', 'Common areas', 'Equipment storage']
      },
      seoTitle: 'New Zealand Adventure Tour - 7 Day Extreme Sports Package',
      seoDescription: 'Experience ultimate adventure in Queenstown with bungee jumping, skydiving, and more. Professional guides and safety guaranteed.'
    },
  ]

  const travelPackages = []
  for (const pkg of packagesData) {
    const travelPackage = await prisma.travelPackage.create({
      data: pkg,
    })

    travelPackages.push(travelPackage)
    console.log('✅ Travel package created:', travelPackage.name)
  }

  // Create gallery images
  const galleryData = [
    {
      title: "Tropical Beach Paradise",
      description: "Crystal clear waters and pristine white sand beaches in the Maldives",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      category: "BEACH",
      location: "Maldives",
      tags: ["beach", "tropical", "paradise", "clear water", "sand"],
    },
    {
      title: "Maldivian Sunset",
      description: "Breathtaking sunset view over the endless ocean in the Maldives",
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800",
      category: "BEACH",
      location: "Maldives",
      tags: ["sunset", "ocean", "romantic", "evening", "peaceful"],
    },
    {
      title: "Swiss Mountain Peak",
      description: "Majestic mountain peaks reaching towards the sky in the Swiss Alps",
      imageUrl: "https://images.unsplash.com/photo-1531736275454-adc48d079e9d?w=800",
      category: "MOUNTAIN",
      location: "Swiss Alps",
      tags: ["mountain", "peak", "adventure", "hiking", "alpine"],
    },
    {
      title: "Alpine Lake Serenity",
      description: "Serene alpine lake surrounded by snow-capped mountains",
      imageUrl: "https://images.unsplash.com/photo-1464822759844-d150265c4739?w=800",
      category: "MOUNTAIN",
      location: "Swiss Alps",
      tags: ["lake", "alpine", "snow", "reflection", "serene"],
    },
    {
      title: "Tokyo Modern Skyline",
      description: "Impressive city skyline with modern architecture in Tokyo",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      category: "CITY",
      location: "Tokyo",
      tags: ["city", "skyline", "modern", "architecture", "urban"],
    },
    {
      title: "Roman Historic Architecture",
      description: "Charming historic buildings and ancient Roman architecture",
      imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
      category: "CITY",
      location: "Rome",
      tags: ["historic", "roman", "architecture", "culture", "ancient"],
    },
    {
      title: "Venetian Canals",
      description: "Beautiful canals and historic buildings in Venice",
      imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800",
      category: "CULTURAL",
      location: "Venice",
      tags: ["canals", "venice", "historic", "culture", "water"],
    },
    {
      title: "African Wildlife Safari",
      description: "Magnificent wildlife in their natural habitat in Kenya",
      imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      category: "WILDLIFE",
      location: "Kenya",
      tags: ["safari", "wildlife", "nature", "animals", "habitat"],
    },
    {
      title: "Lion Pride in Masai Mara",
      description: "Majestic lions resting in the golden savanna",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
      category: "WILDLIFE",
      location: "Kenya",
      tags: ["lions", "safari", "masai mara", "big five", "savanna"],
    },
    {
      title: "Elephant Family",
      description: "Beautiful elephant family crossing the savanna",
      imageUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
      category: "WILDLIFE",
      location: "Kenya",
      tags: ["elephants", "family", "wildlife", "nature", "africa"],
    },
    {
      title: "New Zealand Landscapes",
      description: "Breathtaking natural landscapes of New Zealand",
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      category: "ADVENTURE",
      location: "New Zealand",
      tags: ["landscape", "adventure", "nature", "mountains", "scenic"],
    },
    {
      title: "Queenstown Adventure",
      description: "Adventure activities in the beautiful Queenstown setting",
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      category: "ADVENTURE",
      location: "New Zealand",
      tags: ["adventure", "queenstown", "extreme", "sports", "adrenaline"],
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

  // Create reviews for packages
  const reviewsData = [
    {
      packageId: travelPackages[0].id, // Tropical Paradise
      reviewerId: regularUsers[0].id,
      rating: 5,
      title: "Absolutely Amazing Experience!",
      comment: "The Maldives trip exceeded all expectations. The overwater bungalow was incredible, and the staff was so friendly and helpful. The snorkeling was world-class!",
      reviewType: "PACKAGE",
      userEmail: regularUsers[0].email,
      userName: `${regularUsers[0].firstName} ${regularUsers[0].lastName}`,
    },
    {
      packageId: travelPackages[0].id,
      reviewerId: regularUsers[1].id,
      rating: 5,
      title: "Perfect Honeymoon Destination",
      comment: "My wife and I had the most romantic time. The sunset views, private dining, and spa treatments made this trip unforgettable. Highly recommended!",
      reviewType: "PACKAGE",
      userEmail: regularUsers[1].email,
      userName: `${regularUsers[1].firstName} ${regularUsers[1].lastName}`,
    },
    {
      packageId: travelPackages[1].id, // Mountain Adventure
      reviewerId: regularUsers[2].id,
      rating: 4,
      title: "Challenging but Rewarding",
      comment: "The Swiss Alps trek was physically demanding but absolutely worth it. The views were breathtaking, and our guide was knowledgeable and encouraging.",
      reviewType: "PACKAGE",
      userEmail: regularUsers[2].email,
      userName: `${regularUsers[2].firstName} ${regularUsers[2].lastName}`,
    },
    {
      packageId: travelPackages[2].id, // Cultural Heritage
      reviewerId: regularUsers[3].id,
      rating: 5,
      title: "Rich Cultural Experience",
      comment: "The Italy tour was perfectly organized. Our guide was incredibly knowledgeable about history and art. Vatican tour was a highlight!",
      reviewType: "PACKAGE",
      userEmail: regularUsers[3].email,
      userName: `${regularUsers[3].firstName} ${regularUsers[3].lastName}`,
    },
    {
      packageId: travelPackages[3].id, // Safari
      reviewerId: regularUsers[4].id,
      rating: 5,
      title: "Once in a Lifetime Safari",
      comment: "Saw all Big Five animals! The safari lodge was luxurious and the game drives were incredible. Professional guides made all the difference.",
      reviewType: "PACKAGE",
      userEmail: regularUsers[4].email,
      userName: `${regularUsers[4].firstName} ${regularUsers[4].lastName}`,
    },
  ];

  for (const review of reviewsData) {
    const createdReview = await prisma.review.create({
      data: review,
    });
    console.log('✅ Review created for package:', review.title);
  }

  // Create some bookings
  const bookingsData = [
    {
      bookingNumber: `BK${Date.now()}001`,
      userId: regularUsers[0].id,
      customerName: `${regularUsers[0].firstName} ${regularUsers[0].lastName}`,
      customerEmail: regularUsers[0].email,
      customerPhone: regularUsers[0].phone,
      packageId: travelPackages[0].id,
      packageName: travelPackages[0].name,
      packageLocation: travelPackages[0].location,
      startDate: new Date('2025-12-15'),
      endDate: new Date('2025-12-22'),
      numberOfPeople: 2,
      totalAmount: travelPackages[0].price * 2,
      pricePerPerson: travelPackages[0].price,
      specialRequirements: 'Vegetarian meals, ground floor room',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'Credit Card',
      paymentDate: new Date('2025-09-01'),
      assignedStaffId: staffUsers[0].staffProfile?.id,
      trackingId: `TRK${Date.now()}001`,
    },
    {
      bookingNumber: `BK${Date.now()}002`,
      userId: regularUsers[1].id,
      customerName: `${regularUsers[1].firstName} ${regularUsers[1].lastName}`,
      customerEmail: regularUsers[1].email,
      customerPhone: regularUsers[1].phone,
      packageId: travelPackages[1].id,
      packageName: travelPackages[1].name,
      packageLocation: travelPackages[1].location,
      startDate: new Date('2025-11-10'),
      endDate: new Date('2025-11-16'),
      numberOfPeople: 1,
      totalAmount: travelPackages[1].price,
      pricePerPerson: travelPackages[1].price,
      specialRequirements: 'Experience level: intermediate',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      paymentMethod: 'Bank Transfer',
      paymentDate: new Date('2025-08-25'),
      assignedStaffId: staffUsers[1].staffProfile?.id,
      trackingId: `TRK${Date.now()}002`,
    },
    {
      bookingNumber: `BK${Date.now()}003`,
      userId: regularUsers[2].id,
      customerName: `${regularUsers[2].firstName} ${regularUsers[2].lastName}`,
      customerEmail: regularUsers[2].email,
      customerPhone: regularUsers[2].phone,
      packageId: travelPackages[3].id,
      packageName: travelPackages[3].name,
      packageLocation: travelPackages[3].location,
      startDate: new Date('2025-10-20'),
      endDate: new Date('2025-10-28'),
      numberOfPeople: 4,
      totalAmount: travelPackages[3].price * 4,
      pricePerPerson: travelPackages[3].price,
      specialRequirements: 'Family with 2 children, need connecting rooms',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      paymentDate: null,
      assignedStaffId: staffUsers[2].staffProfile?.id,
      trackingId: `TRK${Date.now()}003`,
    },
  ];

  for (const booking of bookingsData) {
    // Add delay to ensure unique booking numbers
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const createdBooking = await prisma.booking.create({
      data: booking,
    });
    console.log('✅ Booking created:', createdBooking.bookingNumber);
  }

  // Create custom requests
  const customRequestsData = [
    {
      requestNumber: `CR${Date.now()}001`,
      userId: regularUsers[3].id,
      contactName: `${regularUsers[3].firstName} ${regularUsers[3].lastName}`,
      contactEmail: regularUsers[3].email,
      contactPhone: regularUsers[3].phone,
      destination: 'Bali, Indonesia',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-01-25'),
      numberOfPeople: 6,
      budget: 8000,
      accommodation: 'Luxury villa with private pool',
      transportation: 'Private car with driver',
      activities: 'Temple tours, cooking classes, spa treatments, volcano hiking',
      specialRequirements: 'Gluten-free meals, wheelchair accessibility for 1 person',
      description: 'Looking for a luxury family vacation in Bali with cultural experiences and relaxation.',
      requireGuide: true,
      tripType: 'Family Vacation',
      status: 'IN_PROGRESS',
      assignedStaffId: staffUsers[0].staffProfile?.id,
      responseNotes: 'Working on customized itinerary with luxury villa options',
      estimatedCost: 9500,
    },
    {
      requestNumber: `CR${Date.now()}002`,
      userId: regularUsers[4].id,
      contactName: `${regularUsers[4].firstName} ${regularUsers[4].lastName}`,
      contactEmail: regularUsers[4].email,
      contactPhone: regularUsers[4].phone,
      destination: 'Iceland',
      startDate: new Date('2025-11-05'),
      endDate: new Date('2025-11-12'),
      numberOfPeople: 2,
      budget: 5000,
      accommodation: 'Cozy guesthouse or boutique hotel',
      transportation: 'Rental car',
      activities: 'Northern lights viewing, hot springs, glacier tours, waterfall visits',
      specialRequirements: 'Photography equipment storage, early morning pickups for northern lights',
      description: 'Honeymoon trip focusing on natural wonders and northern lights photography.',
      requireGuide: false,
      tripType: 'Honeymoon',
      status: 'QUOTED',
      assignedStaffId: staffUsers[1].staffProfile?.id,
      responseNotes: 'Provided detailed itinerary with northern lights guarantee',
      estimatedCost: 4800,
      quotedPrice: 4650,
      responseDate: new Date('2025-09-05'),
    },
  ];

  for (const request of customRequestsData) {
    // Add delay to ensure unique request numbers
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const createdRequest = await prisma.customRequest.create({
      data: request,
    });
    console.log('✅ Custom request created:', createdRequest.requestNumber);
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
