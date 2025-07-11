import Link from "next/link";

export function TravelCard({ id, imageUrl, title, location, price, duration, groupPricing }) {
  // Format price to show "From" if group pricing exists
  const displayPrice = groupPricing ? `From ${price}` : price;

  return (
    <Link href={`/packages/${id}`} className="flex flex-col gap-3 pb-3 group">
      <div className="relative">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-200 border border-[#FFD700]/20 shadow-lg shadow-black/50"
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        />
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg shadow-[#FFD700]/30">
          {displayPrice}
        </div>
        {/* Duration Tag */}
        {duration && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-black/80 to-[#0a0804]/80 backdrop-blur-xl text-[#FFD700] px-3 py-1 rounded-full text-sm font-medium border border-[#FFD700]/20">
            {duration}
          </div>
        )}
      </div>
      <div>
        <p className="text-white text-base font-medium leading-normal group-hover:text-[#FFD700] transition-colors">
          {title}
        </p>
        <p className="text-[#FFD700]/80 text-sm font-normal leading-normal">
          {location}
        </p>
      </div>
    </Link>
  );
}
