# Core Architecture Documentation

## โครงสร้างโฟลเดอร์ Core

```
src/core/
├── context/                    # Context API providers
│   ├── TravelContext.jsx      # Travel packages management
│   ├── StaffContext.jsx       # Staff and reviews management  
│   ├── GalleryContext.jsx     # Gallery and images management
│   ├── AppProvider.jsx        # Main app provider wrapper
│   └── index.js              # Context exports
├── hooks/                     # Custom hooks
│   ├── useApi.js             # API and utility hooks
│   ├── useTravelHooks.js     # Travel-specific hooks
│   └── index.js              # Hooks exports
└── index.js                  # Main core exports
```

## Context Providers

### TravelContext
จัดการข้อมูล travel packages ทั้งหมด รวมถึง:
- **Mock Data**: ข้อมูล travel packages ครบถ้วน
- **Filtering**: กรองตามประเทศ, เมือง, ราคา, หมวดหมู่
- **Search**: ค้นหา packages
- **Categories**: จัดกลุ่มตามประเภทการท่องเที่ยว
- **Pagination**: แบ่งหน้าข้อมูล

```javascript
// การใช้งาน
import { useTravelContext } from '@/core';

function MyComponent() {
  const {
    allTravelData,
    filteredData,
    currentItems,
    getTravelPackageById,
    getFeaturedPackages,
    searchPackages
  } = useTravelContext();
}
```

### StaffContext
จัดการข้อมูล staff และ reviews:
- **Staff Data**: ข้อมูลพนักงานทั้งหมด
- **Reviews**: รีวิวและคะแนนจากลูกค้า
- **Statistics**: สถิติการให้คะแนน
- **Filtering**: กรองรีวิวตามคะแนน, วันที่, ประเภทการเดินทาง

```javascript
// การใช้งาน
import { useStaffContext } from '@/core';

function MyComponent() {
  const {
    allStaffData,
    getStaffById,
    getStaffReviews,
    getStaffReviewStats
  } = useStaffContext();
}
```

### GalleryContext
จัดการข้อมูล gallery และรูปภาพ:
- **Gallery Images**: รูปภาพทั้งหมด
- **Categories**: หมวดหมู่รูปภาพ
- **Search**: ค้นหารูปภาพ
- **Related Images**: รูปภาพที่เกี่ยวข้อง

```javascript
// การใช้งาน
import { useGalleryContext } from '@/core';

function MyComponent() {
  const {
    allGalleryImages,
    filteredImages,
    allCategories,
    searchImages,
    getRelatedImages
  } = useGalleryContext();
}
```

## Custom Hooks

### API Hooks
```javascript
import { useApi, usePagination, useSearch } from '@/core';

// API calls with loading states
const { data, loading, error, execute } = useApi(apiFunction);

// Pagination
const { currentItems, currentPage, totalPages, goToPage } = usePagination(data);

// Search with debounce
const { searchTerm, results, loading } = useSearch(searchFunction);
```

### Travel Hooks
```javascript
import { useFavorites, useTravelFilters, useBooking } from '@/core';

// Favorites management
const { favorites, toggleFavorite, isFavorite } = useFavorites();

// Travel filters
const { filters, updateFilter, resetFilters } = useTravelFilters();

// Booking management
const { bookingData, updateBookingData, addExtra } = useBooking();
```

## Mock Data Structure

### Travel Packages
```javascript
{
  id: 1,
  title: "Explore the Wonders of Paris",
  location: "Paris, France", 
  price: "$899",
  duration: "5 days",
  imageUrl: "...",
  description: "...",
  highlights: ["Eiffel Tower", "Louvre Museum"],
  category: "Cultural",
  isRecommended: true
}
```

### Staff Data
```javascript
{
  id: "1",
  name: "Emily Carter",
  title: "Travel Expert",
  image: "...",
  bio: "...",
  rating: 4.6,
  totalReviews: 234,
  specialties: ["Adventure Travel", "Cultural Tours"],
  languages: ["English", "Thai", "Japanese"],
  experience: "10 years"
}
```

### Gallery Data
```javascript
{
  id: 1,
  url: "...",
  category: "destinations",
  title: "Eiffel Tower, Paris",
  description: "...",
  location: "Paris, France",
  photographer: "John Doe",
  tags: ["paris", "france", "tower"]
}
```

## การใช้งาน

### 1. Import Context
```javascript
// วิธีที่ 1: Import specific context
import { useTravelContext } from '@/core/context/TravelContext';

// วิธีที่ 2: Import from core index
import { useTravelContext } from '@/core';
```

### 2. ใช้งานใน Component
```javascript
function TravelPackages() {
  const {
    allTravelData,
    filteredData,
    filters,
    updateFilters,
    getFeaturedPackages
  } = useTravelContext();

  const featured = getFeaturedPackages(6);

  return (
    <div>
      {featured.map(package => (
        <div key={package.id}>{package.title}</div>
      ))}
    </div>
  );
}
```

### 3. ใช้งาน Custom Hooks
```javascript
function SearchComponent() {
  const { searchPackages } = useTravelContext();
  const { searchTerm, results, setSearchTerm } = useSearch(searchPackages);

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search packages..."
      />
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

## ข้อดีของโครงสร้างใหม่

1. **Centralized Data**: ข้อมูลทั้งหมดอยู่ใน Context API
2. **Mock Data**: ไม่ต้องพึ่งพา external API ในการพัฒนา
3. **Reusable Hooks**: Custom hooks ที่ใช้ซ้ำได้
4. **Type Safety**: ง่ายต่อการเพิ่ม TypeScript ในอนาคต
5. **Scalable**: ขยายได้ง่ายเมื่อเพิ่มฟีเจอร์ใหม่
6. **Testing**: ทดสอบได้ง่ายด้วย mock data

## การขยายระบบ

### เพิ่ม Context ใหม่
1. สร้างไฟล์ใหม่ใน `core/context/`
2. เพิ่ม Provider ใน `AppProvider.jsx`
3. Export ใน `index.js`

### เพิ่ม Hook ใหม่
1. สร้างไฟล์ใหม่ใน `core/hooks/`
2. Export ใน `index.js`

### เพิ่ม Mock Data
1. เพิ่มข้อมูลใน Context files
2. สร้าง functions สำหรับจัดการข้อมูล
3. Export functions ผ่าน Context value
