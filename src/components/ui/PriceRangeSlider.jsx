import React from "react";
import { Range } from "react-range";

const STEP = 10;

export default function PriceRangeSlider({ 
  value = [0, 3000], 
  onChange, 
  min = 0, 
  max = 3000 
}) {
  const handleChange = (vals) => {
    onChange?.(vals);
  };

  return (
    <div className="w-full max-w-xl px-4">
      <label className="text-[#FFD700] font-medium text-sm mb-2 block">
        Price Range: ${value[0]} - ${value[1]}
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
                left: `${((value[0] - min) / (max - min)) * 100}%`,
                width: `${((value[1] - value[0]) / (max - min)) * 100}%`,
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
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  );
}
