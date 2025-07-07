import { Star } from "lucide-react";
import React from "react";

const ItemCard = ({ pkg }) => {
  return (
    <div
      key={pkg.id}
      className="w-full max-w-full rounded-xl shadow-lg overflow-hidden bg-white mx-auto"
      style={{ maxWidth: "100%" }} // เพื่อให้เต็มพื้นที่ column ที่ grid กำหนด
    >
      <div className="relative">
        <img
          src={pkg.image_url}
          alt={pkg.title}
          className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover"
        />

        {/* หมุดสถานที่ */}
        <span className="absolute top-1 left-1 bg-blue-600 text-white px-1 py-0.5 text-xs font-semibold rounded p-3">
          {pkg.city}
        </span>

        {/* ป้ายแนะนำ */}
        {pkg.is_recommended && (
          <span className="absolute top-1 right-1 bg-green-600 text-white px-1 py-0.5 text-xs font-semibold rounded">
            แนะนำ
          </span>
        )}
      </div>

      <div className="p-2 sm:p-3 space-y-1">
        <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-800 truncate">
          {pkg.title}
        </h3>
        <div className="text-[9px] sm:text-xs text-gray-500 truncate">{pkg.country}</div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3 text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>

        {/* คะแนน */}
        <div className="flex items-center gap-1 text-xs sm:text-sm">
          <span className="text-sky-600 font-bold">8.8</span>
          <span className="text-gray-700">/10</span>
          <span className="text-gray-500">(959)</span>
        </div>

        {/* ราคา */}
        <div className="text-red-600 font-bold text-sm sm:text-base">
          THB {pkg.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
};


export default ItemCard;
