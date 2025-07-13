import { TravelCard } from "./TravelCard";
import { useState, useEffect } from "react";

export function TravelPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ง่าย ๆ แค่ดึงข้อมูลจาก API ตรง ๆ
  useEffect(() => {
    console.log('🎯 TravelPackages: Fetching data...');
    fetch('/api/travel/packages')
      .then(res => res.json())
      .then(data => {
        console.log('🎯 TravelPackages: Got data:', data);
        if (data.success) {
          setPackages(data.data.packages || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('🎯 TravelPackages: Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading travel packages...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center p-12">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-bold mb-2">Unable to Load Packages</h2>
            <p className="text-white/70 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700] text-black px-6 py-3 rounded-full font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No packages available
  if (!packages || packages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center p-12">
          <div className="text-center max-w-md">
            <div className="text-[#FFD700] text-6xl mb-4">🏖️</div>
            <h2 className="text-white text-xl font-bold mb-2">No Travel Packages Found</h2>
            <p className="text-white/70">
              We're currently updating our travel packages. Please check back soon for exciting new destinations!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state with packages
  return (
    <div className="space-y-4">
      <div className="p-4">
        <p className="text-[#FFD700]/80 text-sm mb-4">
          Found {packages.length} travel packages
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {packages.map((pkg) => (
          <TravelCard
            key={pkg.id}
            id={pkg.id}
            title={pkg.title || pkg.name}
            location={pkg.destination || pkg.location}
            price={pkg.price || `$${parseFloat(pkg.priceNumber || 0).toLocaleString()}`}
            duration={pkg.durationText || `${pkg.duration || 0} days`}
            imageUrl={pkg.imageUrl || pkg.images?.[0] || '/placeholder-image.jpg'}
            groupPricing={pkg.priceDetails && typeof pkg.priceDetails === 'object'}
          />
        ))}
      </div>
    </div>
  );
}
