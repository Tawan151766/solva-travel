"use client";

import DropdownSelect from "@/components/ui/DropdownSelect";
import PriceRangeSlider from "@/components/ui/PriceRangeSlider";
import { useTravelContext } from "@/contexts/TravelContext";
import CustomTourModal from "./CustomTourModal";
import { useState } from "react";

export function SearchFilters() {
  const { filters, updateFilters } = useTravelContext();

  // Extract unique countries and cities from the travel data
  const countries = [
    { label: "All Countries", value: "" },
    { label: "France", value: "france" },
    { label: "Japan", value: "japan" },
    { label: "Italy", value: "italy" },
    { label: "UK", value: "uk" },
    { label: "USA", value: "usa" },
    { label: "Australia", value: "australia" },
    { label: "Greece", value: "greece" },
    { label: "Iceland", value: "iceland" },
    { label: "Indonesia", value: "indonesia" },
    { label: "Kenya", value: "kenya" },
    { label: "Egypt", value: "egypt" },
    { label: "Norway", value: "norway" },
    { label: "Peru", value: "peru" },
    { label: "Brazil", value: "brazil" },
    { label: "Alaska", value: "alaska" },
    { label: "Morocco", value: "morocco" },
    { label: "Thailand", value: "thailand" },
  ];

  const cityOptions = [
    { label: "All Cities", value: "" },
    { label: "Paris", value: "paris" },
    { label: "Tokyo", value: "tokyo" },
    { label: "Rome", value: "rome" },
    { label: "London", value: "london" },
    { label: "New York", value: "new york" },
    { label: "Sydney", value: "sydney" },
    { label: "Athens", value: "athens" },
    { label: "Reykjavik", value: "reykjavik" },
    { label: "Bali", value: "bali" },
    { label: "Nairobi", value: "nairobi" },
    { label: "Cairo", value: "cairo" },
    { label: "Bergen", value: "bergen" },
    { label: "Cusco", value: "cusco" },
    { label: "Kyoto", value: "kyoto" },
    { label: "Manaus", value: "manaus" },
    { label: "Fairbanks", value: "fairbanks" },
    { label: "Marrakech", value: "marrakech" },
    { label: "Phuket", value: "phuket" },
  ];

  const handleCountryChange = (value) => {
    updateFilters({ country: value });
  };

  const handleCityChange = (value) => {
    updateFilters({ city: value });
  };

  const handlePriceRangeChange = (values) => {
    updateFilters({ priceRange: values });
  };

  const handleRecommendedToggle = (checked) => {
    updateFilters({ isRecommendedOnly: checked });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
          Travel Packages
        </p>
      </div>

      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <DropdownSelect
          label="Country"
          options={countries}
          value={filters.country}
          onChange={handleCountryChange}
        />
        <DropdownSelect
          label="City"
          options={cityOptions}
          value={filters.city}
          onChange={handleCityChange}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-[#efc004] text-[#231f10] font-medium px-4 py-2 hover:bg-[#ddb900] transition"
        >
          Customize Tour
        </button>
      </div>

      <div className="@container">
        <div className="flex h-[38px] w-full pt-1.5">
          <PriceRangeSlider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-[#231f10] px-4 min-h-14 justify-between">
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">
          Only recommended
        </p>
        <div className="shrink-0">
          <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#4a4221] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#efc004]">
            <div
              className="h-full w-[27px] rounded-full bg-white"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
              }}
            />
            <input
              type="checkbox"
              className="invisible absolute"
              checked={filters.isRecommendedOnly}
              onChange={(e) => handleRecommendedToggle(e.target.checked)}
            />
          </label>
        </div>
      </div>
      <CustomTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
