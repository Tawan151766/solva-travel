-- Migration Phase 2: Safe Database Migration
-- Execute this step by step, checking each step before proceeding

-- Step 1: Add new enum for CustomRequestType
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CustomRequestType') THEN
        CREATE TYPE "CustomRequestType" AS ENUM ('TOUR_REQUEST', 'CUSTOM_BOOKING');
    END IF;
END $$;

-- Step 2: Add new enum for GalleryImageType  
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GalleryImageType') THEN
        CREATE TYPE "GalleryImageType" AS ENUM ('MAIN', 'ADDITIONAL', 'GALLERY');
    END IF;
END $$;

-- Step 3: Create the unified custom_requests table
CREATE TABLE IF NOT EXISTS "custom_requests" (
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

  CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id")
);

-- Step 4: Create indexes for new table
CREATE UNIQUE INDEX IF NOT EXISTS "custom_requests_requestNumber_key" ON "custom_requests"("requestNumber");

-- Step 5: Add foreign key constraints for new table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'custom_requests_userId_fkey'
    ) THEN
        ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'custom_requests_assignedStaffId_fkey'
    ) THEN
        ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_assignedStaffId_fkey" 
        FOREIGN KEY ("assignedStaffId") REFERENCES "staff_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 6: Add new columns to gallery_images table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gallery_images' AND column_name = 'packageId'
    ) THEN
        ALTER TABLE "gallery_images" ADD COLUMN "packageId" TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'gallery_images' AND column_name = 'imageType'
    ) THEN
        ALTER TABLE "gallery_images" ADD COLUMN "imageType" "GalleryImageType" DEFAULT 'GALLERY';
    END IF;
END $$;

-- Step 7: Add foreign key for gallery_images -> travel_packages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'gallery_images_packageId_fkey'
    ) THEN
        ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_packageId_fkey" 
        FOREIGN KEY ("packageId") REFERENCES "travel_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 8: Add new column to bookings table for new custom_requests relation
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'customRequestId'
    ) THEN
        ALTER TABLE "bookings" ADD COLUMN "customRequestId" TEXT;
    END IF;
END $$;

-- Verification queries (run these to check progress)
SELECT 'custom_requests table' as check_type, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_requests') 
            THEN 'EXISTS' ELSE 'NOT EXISTS' END as status;

SELECT 'gallery packageId column' as check_type,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_images' AND column_name = 'packageId')
            THEN 'EXISTS' ELSE 'NOT EXISTS' END as status;

SELECT 'bookings customRequestId column' as check_type,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'customRequestId')
            THEN 'EXISTS' ELSE 'NOT EXISTS' END as status;
