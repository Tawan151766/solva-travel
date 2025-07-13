// Sample data for TravelPackage with enhanced structure
const samplePackages = [
  {
    name: "Amazing Thailand Adventure",
    title: "Discover the Wonders of Thailand",
    description: "Experience the best of Thailand with our comprehensive adventure package",
    overview: "Escape to paradise with our Amazing Thailand Adventure package. This exclusive experience includes premium accommodations, authentic local cuisine, and a range of activities designed for both relaxation and adventure. From cultural immersion to scenic excursions, every detail is crafted to provide an unforgettable vacation experience.",
    highlights: [
      "Visit ancient temples in Bangkok and Chiang Mai",
      "Enjoy authentic Thai cooking classes",
      "Relax on pristine beaches in Phuket",
      "Experience traditional floating markets", 
      "Guided elephant sanctuary tour"
    ],
    itinerary: {
      "day1": {
        "title": "Arrival in Bangkok",
        "activities": ["Airport pickup", "Hotel check-in", "Welcome dinner"],
        "accommodation": "Bangkok Luxury Hotel"
      },
      "day2": {
        "title": "Bangkok Temple Tour",
        "activities": ["Wat Pho Temple", "Grand Palace", "Wat Arun", "Khao San Road"],
        "accommodation": "Bangkok Luxury Hotel"
      },
      "day3": {
        "title": "Flight to Phuket",
        "activities": ["Morning flight", "Beach time", "Sunset dinner"],
        "accommodation": "Phuket Beach Resort"
      },
      "day4": {
        "title": "Island Hopping",
        "activities": ["Phi Phi Islands", "Snorkeling", "Beach BBQ"],
        "accommodation": "Phuket Beach Resort"
      },
      "day5": {
        "title": "Departure",
        "activities": ["Free time", "Airport transfer", "Flight home"],
        "accommodation": null
      }
    },
    price: 1299.00,
    priceDetails: {
      "2_people": { "per_person": 1299, "total": 2598 },
      "4_people": { "per_person": 1099, "total": 4396 },
      "6_people": { "per_person": 999, "total": 5994 },
      "8_people": { "per_person": 899, "total": 7192 }
    },
    duration: 5,
    durationText: "5 days 4 nights",
    maxCapacity: 15,
    location: "Bangkok, Thailand",
    destination: "Thailand",
    category: "Cultural",
    difficulty: "Easy",
    includes: [
      "4 nights accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Professional tour guide",
      "All entrance fees",
      "Domestic flights"
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional activities",
      "Visa fees"
    ],
    accommodation: {
      "bangkok": {
        "name": "Bangkok Luxury Hotel",
        "rating": 5,
        "amenities": ["Pool", "Spa", "Gym", "Restaurant"]
      },
      "phuket": {
        "name": "Phuket Beach Resort",
        "rating": 4,
        "amenities": ["Beach Access", "Pool", "Restaurant", "Bar"]
      }
    },
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1519451241324-20b4bd2b1ff8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop"
    ],
    isRecommended: true,
    rating: 4.8,
    totalReviews: 127,
    tags: ["thailand", "culture", "beach", "adventure", "temples"],
    seoTitle: "Amazing Thailand Adventure - 5 Days Cultural & Beach Tour",
    seoDescription: "Discover Thailand's temples, culture, and beaches in 5 amazing days. Professional guides, luxury accommodation, and authentic experiences included."
  },
  {
    name: "Japanese Cultural Journey",
    title: "Experience the Magic of Japan",
    description: "Immerse yourself in Japanese culture from Tokyo to Kyoto",
    overview: "Journey through Japan's most iconic destinations in this carefully curated cultural experience. From the bustling streets of Tokyo to the serene temples of Kyoto, discover the perfect blend of modern innovation and ancient tradition.",
    highlights: [
      "Visit iconic Mount Fuji",
      "Experience traditional tea ceremony",
      "Explore Tokyo's vibrant neighborhoods",
      "Stay in a traditional ryokan",
      "Bullet train experience"
    ],
    itinerary: {
      "day1": {
        "title": "Arrival in Tokyo",
        "activities": ["Airport pickup", "Shibuya crossing", "Welcome dinner"],
        "accommodation": "Tokyo City Hotel"
      },
      "day2": {
        "title": "Tokyo Exploration",
        "activities": ["Senso-ji Temple", "Tokyo Skytree", "Harajuku district"],
        "accommodation": "Tokyo City Hotel"
      },
      "day3": {
        "title": "Mount Fuji Day Trip",
        "activities": ["Lake Kawaguchi", "Fuji viewing", "Hot springs"],
        "accommodation": "Tokyo City Hotel"
      },
      "day4": {
        "title": "Bullet Train to Kyoto",
        "activities": ["Shinkansen experience", "Fushimi Inari Shrine", "Gion district"],
        "accommodation": "Traditional Ryokan"
      },
      "day5": {
        "title": "Kyoto Temples",
        "activities": ["Kinkaku-ji Temple", "Bamboo Grove", "Tea ceremony"],
        "accommodation": "Traditional Ryokan"
      },
      "day6": {
        "title": "Departure",
        "activities": ["Free time", "Airport transfer"],
        "accommodation": null
      }
    },
    price: 1899.00,
    priceDetails: {
      "2_people": { "per_person": 1899, "total": 3798 },
      "4_people": { "per_person": 1699, "total": 6796 },
      "6_people": { "per_person": 1599, "total": 9594 },
      "8_people": { "per_person": 1499, "total": 11992 }
    },
    duration: 6,
    durationText: "6 days 5 nights",
    maxCapacity: 12,
    location: "Tokyo, Japan",
    destination: "Japan",
    category: "Cultural",
    difficulty: "Easy",
    includes: [
      "5 nights accommodation",
      "Daily breakfast",
      "Airport transfers",
      "Professional English-speaking guide",
      "All entrance fees",
      "Bullet train tickets",
      "Traditional ryokan experience"
    ],
    excludes: [
      "International flights",
      "Travel insurance",
      "Lunch and dinner (except welcome dinner)",
      "Personal expenses",
      "Visa fees"
    ],
    accommodation: {
      "tokyo": {
        "name": "Tokyo City Hotel",
        "rating": 4,
        "amenities": ["Free WiFi", "Restaurant", "Concierge"]
      },
      "kyoto": {
        "name": "Traditional Ryokan",
        "rating": 5,
        "amenities": ["Hot Springs", "Traditional Meals", "Garden", "Tea Room"]
      }
    },
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop"
    ],
    galleryImages: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1561758033-48d52648ae8b?w=800&h=600&fit=crop"
    ],
    isRecommended: true,
    rating: 4.9,
    totalReviews: 89,
    tags: ["japan", "culture", "temples", "tokyo", "kyoto", "traditional"],
    seoTitle: "Japanese Cultural Journey - 6 Days Tokyo to Kyoto Experience",
    seoDescription: "Experience Japan's culture from Tokyo to Kyoto. Traditional ryokan, bullet trains, temples, and authentic cultural experiences included."
  }
];

module.exports = { samplePackages };
