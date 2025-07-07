export function TravelCard({ imageUrl, title, location }) {
  return (
    <div className="flex flex-col gap-3 pb-3">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
        style={{
          backgroundImage: `url("${imageUrl}")`
        }}
      />
      <div>
        <p className="text-white text-base font-medium leading-normal">
          {title}
        </p>
        <p className="text-[#cdc08e] text-sm font-normal leading-normal">
          {location}
        </p>
      </div>
    </div>
  );
}
