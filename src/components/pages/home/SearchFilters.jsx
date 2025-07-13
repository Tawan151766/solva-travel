"use client";

import DropdownSelect from "@/components/ui/DropdownSelect";
import PriceRangeSlider from "@/components/ui/PriceRangeSlider";
import ButtonSolva from "@/components/ui/ButtonSolva";
import { RecommendedToggle } from "@/components/ui/RecommendedToggle";
import CustomTourModal from "./CustomTourModal";
import { useState, useMemo, useEffect } from "react";

export function SearchFilters() {
  // ใช้ state ธรรมดาแทน context ที่ซับซ้อน
  const [packages, setPackages] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    priceRange: [549, 2299],
    isRecommendedOnly: false,
  });
  
  // ดึงข้อมูลจาก API โดยตรง
  useEffect(() => {
    fetch('/api/travel/packages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPackages(data.data.packages || []);
        }
      })
      .catch(err => console.error('Error fetching packages:', err));
  }, []);

  // สร้าง options จากข้อมูลที่ได้มา
  const countryOptions = useMemo(() => {
    const countries = [...new Set(packages.map(pkg => pkg.destination || pkg.location))];
    return countries.filter(Boolean).map(country => ({ value: country, label: country }));
  }, [packages]);

  const cityOptions = useMemo(() => {
    const cities = [...new Set(packages.map(pkg => pkg.city))];
    return cities.filter(Boolean).map(city => ({ value: city, label: city }));
  }, [packages]);

  const priceStats = useMemo(() => {
    if (packages.length === 0) return { min: 549, max: 2299 };
    
    const prices = packages.map(pkg => {
      const price = pkg.priceNumber || parseFloat(pkg.price?.replace(/[^0-9.]/g, '')) || 0;
      return price;
    }).filter(price => price > 0);
    
    return {
      min: Math.min(...prices) || 549,
      max: Math.max(...prices) || 2299
    };
  }, [packages]);

  // อัพเดต filters แบบง่าย ๆ
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // ตรวจสอบ price range ให้ถูกต้อง
  const safePriceRange = useMemo(() => {
    if (!filters.priceRange || filters.priceRange.length !== 2) {
      return [priceStats.min, priceStats.max];
    }
    
    const [min, max] = filters.priceRange;
    const safeMin = Math.max(min, priceStats.min);
    const safeMax = Math.min(max, priceStats.max);
    
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
            min={priceStats.min}
            max={priceStats.max}
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
