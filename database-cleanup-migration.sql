-- Migration: Remove redundant tables and consolidate data structure
-- Step 1: Create unified CustomRequest table to replace CustomTourRequest and CustomBooking

-- First, let's create the new unified table
CREATE TYPE "CustomRequestType" AS ENUM ('TOUR_REQUEST', 'CUSTOM_BOOKING');

CREATE TABLE "custom_requests_new" (
  "id" TEXT NOT NULL,
  "requestNumber" TEXT NOT NULL,
  "requestType" "CustomRequestType" NOT NULL DEFAULT 'TOUR_REQUEST',
  "userId" TEXT,
  "contactName" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "numberOfPeople" INTEGER NOT NULL,
  "budget" DOUBLE PRECISION,
  "accommodation" TEXT,
  "transportation" TEXT,
  "activities" TEXT,
  "specialRequirements" TEXT,
  "description" TEXT,
  "requireGuide" BOOLEAN NOT NULL DEFAULT false,
  "tripType" TEXT,
  "status" "CustomRequestStatus" NOT NULL DEFAULT 'PENDING',
  "assignedStaffId" TEXT,
  "responseNotes" TEXT,
  "estimatedCost" DOUBLE PRECISION,
  "quotedPrice" DOUBLE PRECISION,
  "responseDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "custom_requests_new_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "custom_requests_new_requestNumber_key" ON "custom_requests_new"("requestNumber");

-- Add foreign key constraints
ALTER TABLE "custom_requests_new" ADD CONSTRAINT "custom_requests_new_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "custom_requests_new" ADD CONSTRAINT "custom_requests_new_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "staff_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 2: Migrate data from old tables to new table

-- Migrate from custom_tour_requests
INSERT INTO "custom_requests_new" (
  "id", "requestNumber", "requestType", "userId", "contactName", "contactEmail", 
  "contactPhone", "destination", "startDate", "endDate", "numberOfPeople", 
  "budget", "accommodation", "transportation", "activities", "specialRequirements", 
  "description", "status", "assignedStaffId", "responseNotes", "estimatedCost", 
  "responseDate", "createdAt", "updatedAt"
)
SELECT 
  "id",
  "trackingNumber" as "requestNumber",
  'TOUR_REQUEST' as "requestType",
  "userId",
  "contactName",
  "contactEmail",
  "contactPhone",
  "destination",
  "startDate",
  "endDate",
  "numberOfPeople",
  "budget",
  "accommodation",
  "transportation",
  "activities",
  "specialRequirements",
  "description",
  "status",
  "assignedStaffId",
  "responseNotes",
  "estimatedCost",
  "responseDate",
  "createdAt",
  "updatedAt"
FROM "custom_tour_requests";

-- Migrate from custom_bookings
INSERT INTO "custom_requests_new" (
  "id", "requestNumber", "requestType", "userId", "contactName", "contactEmail", 
  "contactPhone", "destination", "startDate", "endDate", "numberOfPeople", 
  "budget", "accommodation", "transportation", "specialRequirements", 
  "description", "requireGuide", "tripType", "status", "assignedStaffId", 
  "responseNotes", "quotedPrice", "responseDate", "createdAt", "updatedAt"
)
SELECT 
  "id",
  "customBookingId" as "requestNumber",
  'CUSTOM_BOOKING' as "requestType",
  "userId",
  "contactName",
  "contactEmail",
  "contactPhone",
  "destination",
  "startDate",
  "endDate",
  "numberOfPeople",
  "budget",
  "accommodation",
  "transportation",
  "specialRequirements",
  "description",
  "requireGuide",
  "tripType",
  "status",
  "assignedStaffId",
  "responseNotes",
  "quotedPrice",
  "responseDate",
  "createdAt",
  "updatedAt"
FROM "custom_bookings";

-- Step 3: Update bookings table to reference new table
-- Add new column
ALTER TABLE "bookings" ADD COLUMN "customRequestId" TEXT;

-- Update existing records
UPDATE "bookings" 
SET "customRequestId" = "customTourRequestId" 
WHERE "customTourRequestId" IS NOT NULL;

-- Add foreign key constraint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customRequestId_fkey" FOREIGN KEY ("customRequestId") REFERENCES "custom_requests_new"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 4: Drop old tables and columns
DROP TABLE "custom_tour_requests";
DROP TABLE "custom_bookings";
ALTER TABLE "bookings" DROP COLUMN "customTourRequestId";

-- Step 5: Rename new table
ALTER TABLE "custom_requests_new" RENAME TO "custom_requests";

-- Step 6: Update gallery system to link with packages
ALTER TABLE "gallery_images" ADD COLUMN "packageId" TEXT;
ALTER TABLE "gallery_images" ADD COLUMN "imageType" TEXT DEFAULT 'GALLERY';

-- Add foreign key for package relation
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "travel_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 7: Remove redundant image fields from travel_packages (will be done in next migration)
-- We'll keep them for now until we migrate the data to gallery_images
