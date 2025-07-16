# Solva Travel - API Patterns & Data Handling

## Authentication Patterns
- All management routes require JWT token in Authorization header
- Use `Bearer ${token}` format for authentication
- Implement role-based access control (USER, STAFF, OPERATOR, ADMIN, SUPER_ADMIN)
- Return 401 for unauthorized, 403 for forbidden access

## Package Management API
- **GET** `/api/management/packages` - List all packages with search/filter
- **POST** `/api/management/packages` - Create new package
- **PUT** `/api/management/packages/[id]` - Update existing package
- **DELETE** `/api/management/packages/[id]` - Delete package

## Booking Management API
- **GET** `/api/bookings` - List user bookings or all bookings (admin)
- **POST** `/api/bookings` - Create new booking
- **GET** `/api/bookings/[id]` - Get booking details
- **PUT** `/api/bookings/[id]` - Update booking status

## Data Transformation Patterns

### Package Data Structure
```javascript
{
  // Basic info
  title: string,
  name: string,
  description: string,
  overview: string,
  
  // Arrays (convert comma-separated strings to arrays)
  highlights: string[],
  includes: string[],
  excludes: string[],
  tags: string[],
  images: string[],
  galleryImages: string[],
  
  // JSON objects (convert strings to objects)
  itinerary: {
    day1: { title: string, activities: string[], accommodation: string },
    day2: { ... }
  },
  priceDetails: {
    "2_people": { total: number, per_person: number },
    "4_people": { ... }
  },
  accommodation: {
    city: { name: string, type: string, rating: number }
  }
}
```

### Booking Data Structure
```javascript
{
  bookingNumber: string, // Auto-generated unique ID
  customerId: string,
  packageId: string,
  startDate: DateTime,
  endDate: DateTime,
  totalAmount: Decimal,
  status: BookingStatus,
  numberOfPeople: number,
  customerEmail: string,
  customerName: string,
  customerPhone: string
}
```

## Error Handling Patterns
- Use try-catch blocks for all async operations
- Return consistent error responses
- Log errors with context information
- Handle Prisma constraint violations gracefully
- Provide user-friendly error messages in Thai/English

## Validation Patterns
- Validate required fields before database operations
- Check data types and formats (email, phone, dates)
- Validate JSON structure for complex fields
- Ensure foreign key relationships exist
- Implement business logic validation (booking dates, capacity, etc.)