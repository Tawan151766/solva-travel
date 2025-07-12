"use client";

import DropdownSelect from "@/components/ui/DropdownSelect";
import PriceRangeSlider from "@/components/ui/PriceRangeSlider";
import ButtonSolva from "@/components/ui/ButtonSolva";
import { RecommendedToggle } from "@/components/ui/RecommendedToggle";
import { useTravelContext } from "@/core/context";
import CustomTourModal from "./CustomTourModal";
import { useState, useMemo } from "react";

export function SearchFilters() {
  const { filters, updateFilters, getCountries, getCities, getPriceStats } =
    useTravelContext();

  // Get dynamic country and city options from context
  const countryOptions = useMemo(() => getCountries(), []);
  const cityOptions = useMemo(() => getCities(), []);
  const priceStats = useMemo(() => getPriceStats(), []);

  // Ensure price range is valid
  const safePriceRange = useMemo(() => {
    if (!filters.priceRange || filters.priceRange.length !== 2) {
      return [priceStats.min || 549, priceStats.max || 2299];
    }
    
    const [min, max] = filters.priceRange;
    const safeMin = Math.max(min, priceStats.min || 549);
    const safeMax = Math.min(max, priceStats.max || 2299);
    
    return [safeMin, safeMax];
  }, [filters.priceRange, priceStats]);

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
            value={safePriceRange}
            onChange={handlePriceRangeChange}
            min={priceStats.min || 549}
            max={priceStats.max || 2299}
          />
        </div>
      </div>

      <RecommendedToggle
        isChecked={filters.isRecommendedOnly}
        onChange={handleRecommendedToggle}
      />
      
      <CustomTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
