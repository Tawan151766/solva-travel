"use client";

import { useTravelContext } from "@/core/context";

export function Pagination() {
  const { currentPage, setCurrentPage, totalItems, itemsPerPage } = useTravelContext();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Don't render pagination if there are no items or only one page
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <button 
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex size-10 items-center justify-center disabled:opacity-50"
      >
        <div className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </div>
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`text-sm font-${currentPage === page ? 'bold' : 'normal'} leading-normal tracking-[0.015em] flex size-10 items-center justify-center text-white rounded-full ${
            currentPage === page ? 'bg-[#4a4221]' : ''
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex size-10 items-center justify-center disabled:opacity-50"
      >
        <div className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </div>
      </button>
    </div>
  );
}
