import React from "react";
import { Range } from "react-range";

const STEP = 100;

export default function PriceRangeSlider({ 
  value = [549, 2299], 
  onChange, 
  min = 549, 
  max = 2299 
}) {
  // Ensure values are within bounds
  const safeValue = [
    Math.max(min, Math.min(max, value[0] || min)),
    Math.max(min, Math.min(max, value[1] || max))
  ];

  const formatPrice = (price) => {
    if (price === null || price === undefined || !isFinite(price)) {
      return '0';
    }
    return price.toLocaleString();
  };

  const handleChange = (vals) => {
    // Ensure values are valid numbers within bounds
    const validVals = vals.map(val => 
      Math.max(min, Math.min(max, isFinite(val) ? val : min))
    );
    onChange?.(validVals);
  };

  return (
    <div className="w-full max-w-xl px-4">
      <label className="text-[#FFD700] font-medium text-sm mb-2 block">
        Price Range: ${formatPrice(safeValue[0])} - ${formatPrice(safeValue[1])}
      </label>
      <Range
        values={safeValue}
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
                left: `${Math.max(0, Math.min(100, ((safeValue[0] - min) / (max - min)) * 100))}%`,
                width: `${Math.max(0, Math.min(100, ((safeValue[1] - safeValue[0]) / (max - min)) * 100))}%`,
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
