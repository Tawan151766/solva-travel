"use client";

import { SearchFilters } from "./SearchFilters";
import { TravelPackages } from "./TravelPackages";
import { Pagination } from "./Pagination";

export function Home() {
  return (
    <div className="relative flex w-full min-h-screen flex-col bg-[#231f10] overflow-x-hidden font-['Plus_Jakarta_Sans','Noto_Sans',sans-serif]">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 lg:px-8">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1">
            <SearchFilters />
            <TravelPackages />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
}
