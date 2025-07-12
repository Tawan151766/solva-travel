import React from "react";
import { Range } from "react-range";

const STEP = 100;

export default function PriceRangeSlider({ 
  value = [0, 10000], 
  onChange, 
  min = 0, 
  max = 30000 
}) {
  const formatPrice = (price) => {
    if (price === null || price === undefined || !isFinite(price)) {
      return '0';
    }
    return price.toLocaleString();
  };

  const handleChange = (vals) => {
    // Ensure values are valid numbers
    const validVals = vals.map(val => isFinite(val) ? val : 0);
    onChange?.(validVals);
  };

  return (
    <div className="w-full max-w-xl px-4">
      <label className="text-[#FFD700] font-medium text-sm mb-2 block">
        Price Range: ${formatPrice(value[0])} - ${formatPrice(value[1])}
      </label>
      <Range
        values={value}
        step={STEP}
        min={min}
        max={max}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 rounded bg-[#FFD700]/20 relative"
            style={{ background: "#FFD700" + "33" }}
          >
            <div
              className="absolute h-1 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded shadow-lg shadow-[#FFD700]/30"
              style={{
                left: `${Math.max(0, Math.min(100, ((value[0] - min) / (max - min)) * 100))}%`,
                width: `${Math.max(0, Math.min(100, ((value[1] - value[0]) / (max - min)) * 100))}%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key ?? index}
              {...rest}
              className="w-4 h-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full shadow-lg shadow-[#FFD700]/50 cursor-pointer border-2 border-[#FFD700] hover:scale-110 transition-transform"
            />
          );
        }}
      />
      <div className="flex justify-between text-[#FFD700] text-sm mt-2">
        <span>${formatPrice(value[0])}</span>
        <span>${formatPrice(value[1])}</span>
      </div>
    </div>
  );
}
