"use client";

export function RecommendedToggle({ isChecked, onChange, label = "Only recommended" }) {
  return (
    <div className="px-2 flex items-center gap-4 justify-between mt-4">
      <p className="text-[#FFD700] pt-5 text-base font-normal leading-normal flex-1 truncate">
        {label}
      </p>
      <div className="shrink-0 pt-5">
        <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#FFD700]/20 p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#FFD700]">
          <div
            className="h-full w-[27px] rounded-full bg-white "
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px",
            }}
          />
          <input
            type="checkbox"
            className="invisible absolute "
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
