"use client";

import { SearchFilters } from "./SearchFilters";
import { TravelPackages } from "./TravelPackages";
import { Pagination } from "./Pagination";
import { FilterProvider } from "@/contexts/FilterContext";

export function Home() {
  return (
    <FilterProvider>
      <div className="relative flex w-full min-h-screen flex-col bg-gradient-to-br from-black via-[#0a0804] to-black overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
        {/* Luxury Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
        
        <div className="layout-container flex h-full grow flex-col relative">
          <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8">
            <div className="layout-content-container flex flex-col max-w-6xl flex-1">
              <SearchFilters />
              <TravelPackages />
              {/* Pagination ปิดไว้ก่อน เพื่อความง่าย */}
              {/* <Pagination /> */}
            </div>
          </div>
        </div>
      </div>
    </FilterProvider>
  );
}
