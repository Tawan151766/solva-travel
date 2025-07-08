import Link from "next/link";

export function TravelCard({ id, imageUrl, title, location, price, duration }) {
  return (
    <Link href={`/packages/${id}`} className="flex flex-col gap-3 pb-3 group">
      <div className="relative">
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg cursor-pointer group-hover:scale-105 transition-transform duration-200"
          style={{
            backgroundImage: `url("${imageUrl}")`
          }}
        />
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-[#efc004] text-[#231f10] px-3 py-1 rounded-full text-sm font-bold">
          {price}
        </div>
        {/* Duration Tag */}
        {duration && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {duration}
          </div>
        )}
      </div>
      <div>
        <p className="text-white text-base font-medium leading-normal">
          {title}
        </p>
        <p className="text-[#cdc08e] text-sm font-normal leading-normal">
          {location}
        </p>
      </div>
    </Link>
  );
}
