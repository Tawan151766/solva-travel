import { GalleryHero } from "@/components/pages/gallery/GalleryHero";
import { GalleryCategories } from "@/components/pages/gallery/GalleryCategories";
import { GalleryGrid } from "@/components/pages/gallery/GalleryGrid";
import { GalleryProvider } from "@/contexts/GalleryContext";

export default function GalleryPage() {
  return (
    <GalleryProvider>
      <div className="px-4 sm:px-8 lg:px-40 flex flex-1 justify-center py-5 bg-[#231f10]">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
              Gallery
            </p>
          </div>
          
          <GalleryHero />
          <GalleryCategories />
          <GalleryGrid />
        </div>
      </div>
    </GalleryProvider>
  );
}
