# Solva Travel - Business Logic & Database Patterns

## User Management
- **Roles**: USER (customer), STAFF (tour guide), OPERATOR (booking manager), ADMIN (system admin), SUPER_ADMIN
- **Authentication**: JWT tokens with proper expiration
- **Registration**: Email verification required for new accounts
- **Profile Management**: Separate StaffProfile for staff members with specializations and ratings

## Package Management
- **Pricing**: Support multiple group sizes with different per-person rates
- **Availability**: Check maxCapacity against existing bookings
- **Status**: isActive flag to enable/disable packages
- **Categories**: Cultural, Adventure, Nature, Historical, Wellness
- **Difficulty Levels**: Easy, Moderate, Challenging

## Booking System
- **Booking Numbers**: Auto-generated unique identifiers (format: BK-YYYYMMDD-XXXX)
- **Status Flow**: PENDING → CONFIRMED → COMPLETED (or CANCELLED/REFUNDED)
- **Payment Status**: PENDING → PAID (or PARTIAL/FAILED/REFUNDED)
- **Validation**: Check package availability, dates, and capacity before confirming

## Custom Tour Requests
- **Tracking Numbers**: Auto-generated unique identifiers (format: CTR-YYYYMMDD-XXXX)
- **Status Flow**: PENDING → IN_PROGRESS → QUOTED → CONFIRMED → COMPLETED
- **Staff Assignment**: Assign qualified staff based on destination and specialization
- **Budget Handling**: Customer budget vs. quoted price comparison

## Review System
- **Types**: SERVICE, GUIDE, OVERALL, BOOKING, PACKAGE
- **Ratings**: 1-5 star system with optional comments
- **Verification**: Mark reviews as verified for actual bookings
- **Public/Private**: Control review visibility

## Gallery Management
- **Categories**: BEACH, MOUNTAIN, CITY, FOREST, DESERT, CULTURAL, ADVENTURE, LUXURY, WILDLIFE, OTHER
- **Image Handling**: Support multiple image URLs with proper validation
- **Tagging**: Use tags for better searchability and organization

## Data Validation Rules

### Booking Validation
```javascript
// Check package availability
const existingBookings = await prisma.booking.count({
  where: {
    packageId: packageId,
    startDate: { lte: endDate },
    endDate: { gte: startDate },
    status: { in: ['CONFIRMED', 'PENDING'] }
  }
});

// Validate capacity
if (existingBookings + numberOfPeople > package.maxCapacity) {
  throw new Error('Package capacity exceeded');
}
```

### Date Validation
- Start date must be in the future
- End date must be after start date
- Booking dates must align with package duration
- Custom tour dates must allow reasonable preparation time

### Price Calculation
- Apply group discounts based on number of people
- Calculate total from per-person rates
- Handle special pricing for custom tours
- Include taxes and fees in final amount

## System Logging
- Log all user actions for audit trail
- Track booking status changes
- Monitor system errors and performance
- Store IP addresses and user agents for security

## Email Notifications
- Booking confirmations with details
- Custom tour request updates
- Payment confirmations
- Booking reminders before travel dates
- Staff assignment notifications

## Security Considerations
- Validate all user inputs
- Sanitize data before database operations
- Implement rate limiting for API endpoints
- Use parameterized queries to prevent SQL injection
- Hash passwords with bcrypt
- Implement CSRF protection for forms