-- Phase 2: Database Schema Consolidation Migration
-- This script consolidates CustomTourRequest and CustomBooking into CustomRequest
-- and enhances the Gallery system with package relationships

-- Step 1: Create the new unified custom_requests table
CREATE TABLE IF NOT EXISTS "custom_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "requestType" "CustomRequestType" NOT NULL DEFAULT 'TOUR_REQUEST',
    "userId" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "tripType" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numberOfPeople" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "accommodation" TEXT,
    "transportation" TEXT,
    "specialRequirements" TEXT,
    "description" TEXT,
    "requireGuide" BOOLEAN NOT NULL DEFAULT false,
    "status" "CustomRequestStatus" NOT NULL DEFAULT 'PENDING',
    "assignedStaffId" TEXT,
    "responseNotes" TEXT,
    "quotedPrice" DOUBLE PRECISION,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "custom_requests_requestNumber_key" ON "custom_requests"("requestNumber");

-- Step 2: Create new enums if they don't exist
DO $$ BEGIN
    CREATE TYPE "CustomRequestType" AS ENUM ('TOUR_REQUEST', 'CUSTOM_BOOKING', 'PACKAGE_INQUIRY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "GalleryImageType" AS ENUM ('GENERAL', 'PACKAGE', 'DESTINATION', 'ACTIVITY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 3: Add new columns to gallery_images table
ALTER TABLE "gallery_images" 
ADD COLUMN IF NOT EXISTS "imageType" "GalleryImageType" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN IF NOT EXISTS "packageId" TEXT;

-- Step 4: Migrate data from custom_tour_requests if it exists
INSERT INTO "custom_requests" (
    "id", "requestNumber", "requestType", "userId", "contactName", 
    "contactEmail", "contactPhone", "destination", "tripType",
    "startDate", "endDate", "numberOfPeople", "budget",
    "accommodation", "transportation", "specialRequirements", 
    "description", "requireGuide", "status", "assignedStaffId",
    "responseNotes", "quotedPrice", "responseDate", "createdAt", "updatedAt"
)
SELECT 
    "id", 
    "tourRequestId" as "requestNumber",
    'TOUR_REQUEST' as "requestType",
    "userId", "contactName", "contactEmail", "contactPhone",
    "destination", "tripType", "startDate", "endDate",
    "numberOfPeople", "budget", "accommodation", 
    "transportation", "specialRequirements", "description",
    "requireGuide", "status", "assignedStaffId",
    "responseNotes", "quotedPrice", "responseDate",
    "createdAt", "updatedAt"
FROM "custom_tour_requests"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_tour_requests');

-- Step 5: Migrate data from custom_bookings if it exists
INSERT INTO "custom_requests" (
    "id", "requestNumber", "requestType", "userId", "contactName", 
    "contactEmail", "contactPhone", "destination", "tripType",
    "startDate", "endDate", "numberOfPeople", "budget",
    "accommodation", "transportation", "specialRequirements", 
    "description", "requireGuide", "status", "assignedStaffId",
    "responseNotes", "quotedPrice", "responseDate", "createdAt", "updatedAt"
)
SELECT 
    "id", 
    "customBookingId" as "requestNumber",
    'CUSTOM_BOOKING' as "requestType",
    "userId", "contactName", "contactEmail", "contactPhone",
    "destination", "tripType", "startDate", "endDate",
    "numberOfPeople", "budget", "accommodation", 
    "transportation", "specialRequirements", "description",
    "requireGuide", "status", "assignedStaffId",
    "responseNotes", "quotedPrice", "responseDate",
    "createdAt", "updatedAt"
FROM "custom_bookings"
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_bookings');

-- Step 6: Add foreign key constraints
ALTER TABLE "custom_requests" 
ADD CONSTRAINT "custom_requests_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "custom_requests" 
ADD CONSTRAINT "custom_requests_assignedStaffId_fkey" 
FOREIGN KEY ("assignedStaffId") REFERENCES "staff_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "gallery_images" 
ADD CONSTRAINT "gallery_images_packageId_fkey" 
FOREIGN KEY ("packageId") REFERENCES "travel_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 7: Drop old tables (after data migration)
-- Note: Uncomment these lines after verifying data migration was successful
-- DROP TABLE IF EXISTS "custom_tour_requests";
-- DROP TABLE IF EXISTS "custom_bookings";

-- Verification queries
-- SELECT COUNT(*) as tour_requests_migrated FROM "custom_requests" WHERE "requestType" = 'TOUR_REQUEST';
-- SELECT COUNT(*) as custom_bookings_migrated FROM "custom_requests" WHERE "requestType" = 'CUSTOM_BOOKING';
-- SELECT COUNT(*) as total_custom_requests FROM "custom_requests";
