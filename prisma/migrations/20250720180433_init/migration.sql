-- AlterEnum
ALTER TYPE "ReviewType" ADD VALUE 'PACKAGE';

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_reviewedUserId_fkey";

-- AlterTable
ALTER TABLE "custom_tour_requests" ADD COLUMN     "packageId" INTEGER,
ADD COLUMN     "pricePerPerson" DOUBLE PRECISION,
ADD COLUMN     "selectedGroupSize" INTEGER,
ADD COLUMN     "totalPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userName" TEXT,
ALTER COLUMN "reviewedUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "travel_packages" ADD COLUMN     "accommodation" JSONB,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "destination" TEXT,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "durationText" TEXT,
ADD COLUMN     "excludes" TEXT[],
ADD COLUMN     "galleryImages" TEXT[],
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "includes" TEXT[],
ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itinerary" JSONB,
ADD COLUMN     "overview" TEXT,
ADD COLUMN     "priceDetails" JSONB,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "custom_bookings" (
    "id" TEXT NOT NULL,
    "customBookingId" TEXT NOT NULL,
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
    "proposalType" TEXT NOT NULL DEFAULT 'custom_booking',
    "status" "CustomRequestStatus" NOT NULL DEFAULT 'PENDING',
    "assignedStaffId" TEXT,
    "responseNotes" TEXT,
    "quotedPrice" DOUBLE PRECISION,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_bookings_customBookingId_key" ON "custom_bookings"("customBookingId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "travel_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewedUserId_fkey" FOREIGN KEY ("reviewedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_bookings" ADD CONSTRAINT "custom_bookings_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "staff_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_bookings" ADD CONSTRAINT "custom_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
