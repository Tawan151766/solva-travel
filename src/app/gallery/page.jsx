import { GalleryHero } from "@/components/pages/gallery/GalleryHero";
import { GalleryCategories } from "@/components/pages/gallery/GalleryCategories";
import { GalleryGrid } from "@/components/pages/gallery/GalleryGrid";
import { GalleryProvider } from "@/core/context";

export const metadata = {
  title: "Gallery - Solva Travel",
  description:
    "Explore stunning travel destinations through our curated photo gallery. Discover beautiful beaches, mountains, cities, forests, and desert landscapes.",
  keywords:
    "travel gallery, destination photos, travel photography, beach photos, mountain landscapes, city views, nature photography",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  openGraph: {
    title: "Travel Photo Gallery - Solva Travel",
    description: "Browse our collection of stunning travel destination photos",
    type: "website",
  },
};

export default function GalleryPage() {
  return (
    <GalleryProvider>
      <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-3 sm:py-5 bg-gradient-to-br from-black via-[#0a0804] to-black min-h-screen relative">
        {/* Luxury Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
        
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full relative">
          <div className="flex flex-wrap justify-between items-center gap-3 p-2 sm:p-4">
            <h1 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text tracking-light text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Gallery
            </h1>
          </div>

          <GalleryHero />
          <GalleryCategories />
          <GalleryGrid />
        </div>
      </div>
    </GalleryProvider>
  );
}
