/*
  Warnings:

  - You are about to drop the column `customTourRequestId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `galleryImages` on the `travel_packages` table. All the data in the column will be lost.
  - You are about to drop the `custom_bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `custom_tour_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CustomRequestType" AS ENUM ('TOUR_REQUEST', 'CUSTOM_BOOKING');

-- CreateEnum
CREATE TYPE "GalleryImageType" AS ENUM ('MAIN', 'ADDITIONAL', 'GALLERY');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customTourRequestId_fkey";

-- DropForeignKey
ALTER TABLE "custom_bookings" DROP CONSTRAINT "custom_bookings_assignedStaffId_fkey";

-- DropForeignKey
ALTER TABLE "custom_bookings" DROP CONSTRAINT "custom_bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "custom_tour_requests" DROP CONSTRAINT "custom_tour_requests_assignedStaffId_fkey";

-- DropForeignKey
ALTER TABLE "custom_tour_requests" DROP CONSTRAINT "custom_tour_requests_userId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "customTourRequestId",
ADD COLUMN     "customRequestId" TEXT;

-- AlterTable
ALTER TABLE "gallery_images" ADD COLUMN     "imageType" "GalleryImageType" NOT NULL DEFAULT 'GALLERY',
ADD COLUMN     "packageId" TEXT;

-- AlterTable
ALTER TABLE "travel_packages" DROP COLUMN "galleryImages";

-- DropTable
DROP TABLE "custom_bookings";

-- DropTable
DROP TABLE "custom_tour_requests";

-- CreateTable
CREATE TABLE "custom_requests" (
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

-- CreateIndex
CREATE UNIQUE INDEX "custom_requests_requestNumber_key" ON "custom_requests"("requestNumber");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customRequestId_fkey" FOREIGN KEY ("customRequestId") REFERENCES "custom_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "travel_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "staff_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_requests" ADD CONSTRAINT "custom_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
