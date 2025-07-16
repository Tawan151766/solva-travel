# Solva Travel - Project Overview

## Project Description
Solva Travel is a comprehensive travel booking and management system built with Next.js, featuring both customer-facing booking capabilities and administrative management tools.

## Tech Stack
- **Frontend**: Next.js 15.3.4, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **UI Components**: Radix UI, Lucide React icons
- **Styling**: Tailwind CSS with custom golden theme (#FFD700)
- **Development**: Docker Compose for local development

## Key Features
- **Customer Portal**: Package browsing, booking, custom tour requests
- **Admin Dashboard**: Package management, booking management, user management
- **Staff Management**: Role-based access, staff profiles, assignment system
- **Review System**: Customer reviews and ratings
- **Gallery Management**: Image galleries with categorization
- **Custom Booking System**: Flexible custom tour request handling

## Project Structure
- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/src/contexts` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility libraries and configurations
- `/src/services` - API service functions
- `/prisma` - Database schema and migrations

## Database Schema
The system uses a comprehensive PostgreSQL schema with the following main entities:
- Users (with role-based access)
- TravelPackages (tour packages)
- Bookings (customer bookings)
- CustomTourRequests (custom tour inquiries)
- Reviews (customer feedback)
- Gallery (image management)
- StaffProfiles (staff information)

## Development Environment
- Uses Docker Compose for PostgreSQL, Redis, and pgAdmin
- Environment variables configured in `.env` files
- Prisma for database management and migrations