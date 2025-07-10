"use client";

import DropdownSelect from "@/components/ui/DropdownSelect";
import PriceRangeSlider from "@/components/ui/PriceRangeSlider";
import { useTravelContext } from "@/core/context";
import CustomTourModal from "./CustomTourModal";
import { useState, useMemo } from "react";
import ButtonSolva from "@/components/ui/ButtonSolva";

export function SearchFilters() {
  const { filters, updateFilters, getCountries, getCities, getPriceStats } = useTravelContext();

  // Get dynamic country and city options from context
  const countryOptions = useMemo(() => getCountries(), []);
  const cityOptions = useMemo(() => getCities(), []);
  const priceStats = useMemo(() => getPriceStats(), []);

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
        <p className="text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Travel Packages
        </p>
      </div>

      <div className="flex gap-3 p-3 flex-wrap pr-4">
        <DropdownSelect
          label="Country"
          options={countryOptions}
          value={filters.country}
          onChange={handleCountryChange}
        />
        <DropdownSelect
          label="City"
          options={cityOptions}
          value={filters.city}
          onChange={handleCityChange}
        />

        <ButtonSolva
          label="Customize Tour"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div className="@container">
        <div className="flex h-[38px] w-full pt-1.5">
          <PriceRangeSlider
            value={filters.priceRange}
            onChange={handlePriceRangeChange}
            min={priceStats.min}
            max={priceStats.max}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 bg-gradient-to-r from-black/60 to-[#0a0804]/60 backdrop-blur-xl border border-[#FFD700]/20 rounded-xl px-4 min-h-14 justify-between">
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">
          Only recommended
        </p>
        <div className="shrink-0">
          <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#FFD700]/20 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#FFD700]">
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
