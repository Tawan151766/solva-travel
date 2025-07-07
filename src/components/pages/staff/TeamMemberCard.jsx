// components/sections/TeamMemberCard.jsx
export default function TeamMemberCard({ name, imageUrl, rating }) {
  return (
    <div className="flex flex-col gap-3 text-center pb-3">
      <div className="px-4">
        <div
          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
      </div>
      <div>
        <p className="text-white text-base font-medium leading-normal">{name}</p>
        <p className="text-[#cdc08e] text-sm font-normal leading-normal">
          {rating} stars
        </p>
      </div>
    </div>
  );
}
