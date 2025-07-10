"use client";

import { useState, useRef } from "react";
import { GalleryCategoryCard } from "./GalleryCategoryCard";
import { useGalleryContext } from "@/core/context";

const categories = [
  {
    id: 1,
    name: "Beach",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG8y_CSV0QJbdsBg5-KbttQO1Zk09vTPnO7YcQw9nRwsmAA_YxpB3fYEIwfdNKGyFJbcGow9SADUQ_x3-FH17g7HMS2TrJptp6kPaR-KK3qq8J__yK7ZVHbYuYdf8SjemvJwgl29R3TANKjJZAC9TYcdMvi-v-yqYOmr5-7mNPGKXm5f87bczFQj7OkzPdJNw7Wmoi10N_Z0LocqbqQZfSGZY9Wbdm5hi-16CpITDyBnXY68FMsH2r91n5NRaAeSuqbe0LpAMFFydl",
    count: 3
  },
  {
    id: 2,
    name: "City",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA84t4PXkFyjoU1omDp7hyENjvc86cn28sFw5nrOdXgCHDFhnUb242OQzgDmuuWrXCQswLqm3H4JSO108l3JVY4NmZoEUoyrazaBAI6m-M59SvsxVMAnOnE9b_BHTLRXp0TcKkTU-gZF013GpDu9_9J2SWX1L1f2d0_4H0G1KI14vdTFtQfbZ2TLfxtw9HvIAFaNn4Og19BnjxdOiWDHU5b0CnpimrlR2B-gToZ_5iEKfcUiEcINwFK848knBc9hVr5wSDOWffVxnR8",
    count: 2
  },
  {
    id: 3,
    name: "Forest",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA76HPFH7lUvEBSU-41USE037HhpG4K6xU7_yLwj_3aNXWPioldrgsE1YJFCrqfz6XbkKx83yBQ8Zhjwtp8fSM6dFm6G6vtXcqs9LwqbQEAUhCRSxYPKerSBWldoNCqA5Jwxzh1dZLNu8a9HS8aMqWem_JYigKMQEwH-Y535YVrEShDF6QwPXzpGgBAydNgKNp40grosLbUUrVN0MpoRnKN2JJ1-HhV_3T0G0ju7SjRlzubFp5NC4uli4QeOfXN4tyStuiCXupZM2uz",
    count: 2
  },
  {
    id: 4,
    name: "Desert",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6m-iaMWhf-O34ujTDvWNTrFg8N9Dv3wTfeVREXBYRt8OCpeg9H4k0CGR0hz0OMUpjdIhl3iXGDgFff9x-C71rmKWJdeKgBRwiNhbBUg_bQEBRthG5iFw_TW_dErp0HdpuEBLec2i59RVii0iH8O1wUqAFXndj7YhZ3JL2iJ6rbTY1QvmheT9Jz7gdPkYxHTiy31PlsREeJRNjIpyFo29qvxn-RrQP8-E9_-venF8ZWXXRSxQZhyXUeHuKQNNIzgYXRjisFhnF6Hg8",
    count: 2
  },
  {
    id: 5,
    name: "Mountain",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH4T0XXO_GUV-jrIopqbcMqz_MVDYP5RufEt00knYff63LEte6L9VpIUG-jh0zlcRibJnm582hRn78Hv6LRc9ZIxti6gNL-hou4-krKZ8EMSLVYL_5LotyZTBE0E7W5gh3wFICJku_pk2XcwO15nXRAVwOgRmw8O7KnMkN17K6TX_vf1loar6fuGKATkXtOQruHx6GJClgpY6eaEJVGEJCjQ3Cpal3uriO7v-Ezdj6Qki1t_ROr5-5avR0yfcZNQ6bUQpBcAvJDst_",
    count: 3
  }
];

export function GalleryCategories() {
  const { selectedCategory, setSelectedCategory } = useGalleryContext();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between px-2 sm:px-4 pb-2 pt-4">
        <h3 className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text text-base sm:text-lg font-bold leading-tight tracking-[-0.015em]">
          Browse Categories
        </h3>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              canScrollLeft 
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700]' 
                : 'bg-[#FFD700]/10 text-[#FFD700]/30 cursor-not-allowed border border-[#FFD700]/10'
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
              canScrollRight 
                ? 'bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700]' 
                : 'bg-[#FFD700]/10 text-[#FFD700]/30 cursor-not-allowed border border-[#FFD700]/10'
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
        >
          <div className="flex items-stretch p-2 sm:p-4 gap-2 sm:gap-4">
            {/* All Categories Card */}
            <GalleryCategoryCard 
              name="All Images"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCoTOnBRsQvFW8jUzkabot7wsA5KLAfizO33873MigmnJqRi2YIDOM62IlqMXoEY4cBN8rWuZiI58LDlutJsRGj-BAPPBgICDGaOACUEObMA3h0xvJl72Y9EPiQ-pQVQERVHkGEObY0s5vOsLztqJGpN7BjkHa5mFIA_JhBEgv579sYzXuWtunun8Y9XwDiz_7BHxVMu3T5dT4OHGZ0jtPheGdbxl0mOIjBK3HMoh6wXmCjqxuHzWe7jcEQcqWwOsd_ksKqgMFIzUAF"
              count={12}
              onClick={() => handleCategorySelect("All")}
              isSelected={selectedCategory === "All"}
            />
            {categories.map((category) => (
              <GalleryCategoryCard 
                key={category.id}
                name={category.name}
                imageUrl={category.imageUrl}
                count={category.count}
                onClick={() => handleCategorySelect(category.name)}
                isSelected={selectedCategory === category.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
