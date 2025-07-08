"use client";

export function ReviewPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage = 10,
  totalItems 
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#2a2821]">
      {/* Results Info */}
      <div className="text-[#bcb69f] text-sm">
        Showing {startItem}-{endItem} of {totalItems} reviews
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3f3b2c] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a4221] transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
          </svg>
        </button>

        {/* Page Numbers */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3f3b2c] text-white hover:bg-[#4a4221] transition-colors text-sm"
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="text-[#bcb69f] px-2">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors text-sm ${
              page === currentPage
                ? 'bg-[#d4af37] text-[#231f10] font-semibold'
                : 'bg-[#3f3b2c] text-white hover:bg-[#4a4221]'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-[#bcb69f] px-2">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3f3b2c] text-white hover:bg-[#4a4221] transition-colors text-sm"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3f3b2c] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4a4221] transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
            <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
