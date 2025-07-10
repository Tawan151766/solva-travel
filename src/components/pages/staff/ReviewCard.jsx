"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/StarRating";

export function ReviewCard({ review }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setDislikes(dislikes - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDislikes(dislikes - 1);
      setDisliked(false);
    } else {
      setDislikes(dislikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-gradient-to-br from-black/60 via-[#0a0804]/60 to-black/60 backdrop-blur-md p-4 rounded-lg border border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-all duration-200 shadow-lg shadow-black/30">
      {/* Reviewer Info */}
      <div className="flex items-center gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 flex-shrink-0 ring-2 ring-[#FFD700]/30"
          style={{
            backgroundImage: `url("${review.reviewerImage}")`
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm sm:text-base font-medium leading-normal truncate">
            {review.reviewerName}
          </p>
          <p className="text-white/70 text-xs sm:text-sm font-normal leading-normal">
            {new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={review.rating} size="20" />

      {/* Review Text */}
      <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed">
        {review.comment}
      </p>

      {/* Like/Dislike Buttons */}
      <div className="flex gap-6 sm:gap-9 text-white/70 pt-2">
        <button 
          className={`flex items-center gap-2 transition-colors hover:text-[#FFD700] ${
            liked ? 'text-[#FFD700]' : ''
          }`}
          onClick={handleLike}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z" />
          </svg>
          <p className="text-xs sm:text-sm">{likes}</p>
        </button>
        
        <button 
          className={`flex items-center gap-2 transition-colors hover:text-red-400 ${
            disliked ? 'text-red-400' : ''
          }`}
          onClick={handleDislike}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z" />
          </svg>
          <p className="text-xs sm:text-sm">{dislikes}</p>
        </button>
      </div>
    </div>
  );
}
