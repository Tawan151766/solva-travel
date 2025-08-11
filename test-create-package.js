const testCreatePackage = async () => {
  // Test data that matches our current schema
  const packageData = {
    name: "ทดสอบแพ็กเกจใหม่",
    title: "ทดสอบแพ็กเกจใหม่",
    description: "แพ็กเกจทดสอบสำหรับระบบสร้างแพ็กเกจใหม่",
    overview: "ภาพรวมของแพ็กเกจทดสอบ",
    location: "กรุงเทพฯ",
    destination: "กรุงเทพฯ และปริมณฑล",
    category: "Cultural",
    difficulty: "Easy",
    durationDays: 3,
    durationText: "3 วัน 2 คืน",
    maxCapacity: 20,
    priceNumber: 5000,
    price: 5000,
    priceDetails: {
      "2_people": { total: 10000, per_person: 5000 },
      "4_people": { total: 18000, per_person: 4500 },
      "6_people": { total: 25500, per_person: 4250 },
      "8_people": { total: 32000, per_person: 4000 }
    },
    highlights: ["สถานที่สำคัญ", "อาหารท้องถิ่น", "การแสดงวัฒนธรรม"],
    includes: ["ที่พัก", "อาหาร", "รถรับส่ง", "ไกด์"],
    excludes: ["ตั๋วเครื่องบิน", "ค่าใช้จ่ายส่วนตัว"],
    tags: ["วัฒนธรรม", "ประวัติศาสตร์", "อาหาร"],
    images: ["https://example.com/image1.jpg"],
    imageUrl: "https://example.com/main-image.jpg",
    accommodation: {
      "hotel_name": "โรงแรมทดสอบ",
      "room_type": "Deluxe Room",
      "rating": 4
    },
    itinerary: {
      "day1": {
        "title": "วันที่ 1 - เดินทางถึง",
        "activities": ["เช็คอิน", "ทานอาหารเย็น"],
        "accommodation": "โรงแรมทดสอบ"
      },
      "day2": {
        "title": "วันที่ 2 - ชมสถานที่สำคัญ",
        "activities": ["เยี่ยมชมวัด", "ช้อปปิ้ง", "ชมการแสดง"],
        "accommodation": "โรงแรมทดสอบ"
      },
      "day3": {
        "title": "วันที่ 3 - เดินทางกลับ",
        "activities": ["เช็คเอาต์", "เดินทางกลับ"],
        "accommodation": null
      }
    },
    isRecommended: true,
    isActive: true,
    rating: 4.8,
    totalReviews: 0
  };

  try {
    // Get token from localStorage (you need to be logged in as admin)
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found. Please login as admin first.');
      return;
    }

    const response = await fetch('/api/management/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(packageData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Package created successfully:', result);
      return result;
    } else {
      console.error('❌ Failed to create package:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating package:', error);
    return null;
  }
};

// Export for browser console testing
window.testCreatePackage = testCreatePackage;
