"use client";

import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTravelContext } from "@/core/context";
import { getRelevantGalleryImages } from "@/data/galleryData";

export default function PackagePage({ params }) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  const { getTravelPackageById } = useTravelContext();
  
  // Local state for package data
  const [travelPackage, setTravelPackage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [selectedGroupSize, setSelectedGroupSize] = useState(2);

  // Get package data from TravelContext instead of API
  useEffect(() => {
    const loadPackageData = () => {
      try {
        setLoading(true);
        setError(null);

        // Convert string ID to number for comparison
        const packageId = parseInt(id, 10);
        
        // Get package from TravelContext
        const packageData = getTravelPackageById(packageId);
        
        if (!packageData) {
          notFound();
          return;
        }

        setTravelPackage(packageData);
        
        // Get relevant gallery images using the helper function
        const relevantImages = getRelevantGalleryImages(packageData);
        setGalleryImages(relevantImages);
        
      } catch (err) {
        console.error('Error loading package data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPackageData();
    }
  }, [id, getTravelPackageById]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700]/30 border-t-[#FFD700] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading package details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-2">Unable to Load Package</h2>
          <p className="text-white/70 text-sm mb-6">{error}</p>
          <Link href="/" className="bg-gradient-to-r from-[#FFD700] to-[#FFED4E] hover:from-[#FFED4E] hover:to-[#FFD700] text-black px-6 py-3 rounded-full font-semibold transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Package not found
  if (!travelPackage) {
    notFound();
  }

  // Get relevant gallery images
  const relevantImages = galleryImages.length > 0 ? galleryImages : [];
  const displayImages = showAllImages ? relevantImages : relevantImages.slice(0, 6);

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex(prev => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0804] to-black relative">
      {/* Luxury Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-[#FFD700] hover:text-[#FFED4E] transition-colors">
            Home
          </Link>
          <span className="text-[#FFD700]/50">/</span>
          <Link href="/" className="text-[#FFD700] hover:text-[#FFED4E] transition-colors">
            Packages
          </Link>
          <span className="text-[#FFD700]/50">/</span>
          <span className="text-white font-medium">
            {travelPackage.title}
          </span>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="relative h-[60vh] rounded-2xl overflow-hidden">
            <Image
              src={travelPackage.imageUrl}
              alt={travelPackage.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {travelPackage.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed">
                  {travelPackage.description || "Experience the ultimate travel adventure with our carefully curated package."}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center text-[#FFD700]">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{travelPackage.location}</span>
                  </div>
                  <div className="flex items-center text-[#FFD700]">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{travelPackage.duration}</span>
                  </div>
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">
                    {travelPackage.price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Gallery Section */}
            {relevantImages.length > 0 && (
              <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">Gallery</h2>
                  <button
                    onClick={() => setShowAllImages(!showAllImages)}
                    className="text-[#FFD700] hover:text-[#FFED4E] transition-colors font-medium"
                  >
                    {showAllImages ? 'Show Less' : `View All (${relevantImages.length})`}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {displayImages.map((image, index) => (
                    <div 
                      key={image.id} 
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      onClick={() => openImageModal(index)}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 left-3 right-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-semibold text-sm truncate">{image.title}</h3>
                        <p className="text-gray-300 text-xs">{image.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Overview */}
            <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-6">Overview</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                {travelPackage.description || `Escape to paradise with our ${travelPackage.title} package. This exclusive experience includes premium accommodations, authentic local cuisine, and a range of activities designed for both relaxation and adventure. From cultural immersion to scenic excursions, every detail is crafted to provide an unforgettable vacation experience.`}
              </p>
            </section>

            {/* Highlights */}
            <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-8">Highlights</h2>
              <div className="grid gap-6">
                {travelPackage.highlights ? (
                  travelPackage.highlights.slice(0, 5).map((highlight, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[#FFD700]/30">
                        {index === 0 && (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {index === 1 && (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {index === 2 && (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {index === 3 && (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        )}
                        {index === 4 && (
                          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold mb-2">{highlight}</h3>
                        <p className="text-white/80">Experience this amazing feature of your travel package.</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold mb-2">Premium Dining</h3>
                        <p className="text-white/80">Indulge in authentic local cuisine and international dishes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold mb-2">Guided Excursions</h3>
                        <p className="text-white/80">Explore the destination with expert local guides.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-xl flex items-center justify-center shadow-lg shadow-[#FFD700]/30">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white text-lg font-semibold mb-2">Relaxation & Activities</h3>
                        <p className="text-white/80">Enjoy a perfect balance of relaxation and adventure.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Itinerary */}
            <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-8">Itinerary</h2>
              <div className="relative">
                <div className="absolute left-6 top-16 bottom-16 w-0.5 bg-gradient-to-b from-[#FFD700] to-[#FFED4E]"></div>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FFD700]/30">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Arrival & Check-In</h3>
                      <p className="text-[#FFD700] font-medium mb-2">Day 1</p>
                      <p className="text-white/80">Welcome to your destination! Check into your premium accommodation and begin your adventure.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FFD700]/30">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Exploration & Activities</h3>
                      <p className="text-[#FFD700] font-medium mb-2">Days 2-{parseInt(travelPackage.duration) || '6'}</p>
                      <p className="text-white/80">Discover the highlights of your destination with guided tours, cultural experiences, and adventure activities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#FFD700]/30">
                      <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Departure</h3>
                      <p className="text-[#FFD700] font-medium mb-2">Final Day</p>
                      <p className="text-white/80">Check out and departure with unforgettable memories of your journey.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Accommodation */}
              <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-6">Accommodation</h3>
                <div className="space-y-4">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={travelPackage.imageUrl}
                      alt="Accommodation"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {travelPackage.location} Premium Resort
                    </h4>
                    <p className="text-white/80 text-sm">
                      Enjoy comfortable accommodations with modern amenities, stunning views, and excellent service throughout your stay.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pricing */}
              <section className="bg-gradient-to-br from-[#FFD700] to-[#FFED4E] rounded-2xl p-6 text-black shadow-2xl shadow-[#FFD700]/30">
                <h3 className="text-2xl font-bold mb-4">Pricing</h3>
                
                <div className="space-y-4">
                  {/* Group Size Selection */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Group Size</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSelectedGroupSize(2)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedGroupSize === 2
                            ? 'border-black bg-black text-[#FFD700] font-bold'
                            : 'border-black/20 bg-transparent hover:border-black/40'
                        }`}
                      >
                        <div className="text-sm font-medium">2 คน</div>
                        <div className="text-xs opacity-80">฿2,000/คน</div>
                      </button>
                      <button
                        onClick={() => setSelectedGroupSize(4)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedGroupSize === 4
                            ? 'border-black bg-black text-[#FFD700] font-bold'
                            : 'border-black/20 bg-transparent hover:border-black/40'
                        }`}
                      >
                        <div className="text-sm font-medium">4 คน</div>
                        <div className="text-xs opacity-80">฿1,600/คน</div>
                      </button>
                      <button
                        onClick={() => setSelectedGroupSize(6)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedGroupSize === 6
                            ? 'border-black bg-black text-[#FFD700] font-bold'
                            : 'border-black/20 bg-transparent hover:border-black/40'
                        }`}
                      >
                        <div className="text-sm font-medium">6 คน</div>
                        <div className="text-xs opacity-80">฿1,400/คน</div>
                      </button>
                      <button
                        onClick={() => setSelectedGroupSize(8)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedGroupSize === 8
                            ? 'border-black bg-black text-[#FFD700] font-bold'
                            : 'border-black/20 bg-transparent hover:border-black/40'
                        }`}
                      >
                        <div className="text-sm font-medium">8+ คน</div>
                        <div className="text-xs opacity-80">฿1,200/คน</div>
                      </button>
                    </div>
                  </div>

                  {/* Selected Price Display */}
                  <div className="border-t border-black/20 pt-4">
                    <div>
                      <div className="text-3xl font-bold">
                        ฿{selectedGroupSize === 2 ? '2,000' : selectedGroupSize === 4 ? '1,600' : selectedGroupSize === 6 ? '1,400' : '1,200'}
                      </div>
                      <div className="text-sm opacity-80">ต่อคน ({selectedGroupSize} คน)</div>
                    </div>
                    <div className="mt-2 p-3 bg-black/10 rounded-lg">
                      <div className="text-sm font-medium">
                        ราคารวม: ฿{(selectedGroupSize === 2 ? 2000 : selectedGroupSize === 4 ? 1600 : selectedGroupSize === 6 ? 1400 : 1200) * selectedGroupSize}
                      </div>
                      <div className="text-xs opacity-80">สำหรับ {selectedGroupSize} คน</div>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 border-t border-black/20 pt-4">
                    <div>Duration: {travelPackage.duration}</div>
                    <div>ราคาลดตามจำนวนคน</div>
                    <div>*ราคาอาจแตกต่างตามช่วงเวลา</div>
                  </div>
                  <Link 
                    href={`/tour-request?packageId=${id}&groupSize=${selectedGroupSize}&pricePerPerson=${selectedGroupSize === 2 ? '2000' : selectedGroupSize === 4 ? '1600' : selectedGroupSize === 6 ? '1400' : '1200'}&totalPrice=${(selectedGroupSize === 2 ? 2000 : selectedGroupSize === 4 ? 1600 : selectedGroupSize === 6 ? 1400 : 1200) * selectedGroupSize}&packageTitle=${encodeURIComponent(travelPackage.title)}&destination=${encodeURIComponent(travelPackage.location)}`} 
                    className="block"
                  >
                    <button className="w-full bg-black text-[#FFD700] font-bold py-4 px-6 rounded-xl hover:bg-[#0a0804] transition-colors transform hover:scale-105 duration-200 shadow-lg">
                      Book Now
                    </button>
                  </Link>
                </div>
              </section>

              {/* Quick Facts */}
              <section className="bg-gradient-to-br from-black/80 via-[#0a0804]/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-[#FFD700]/20 shadow-2xl shadow-black/50">
                <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/80">Duration:</span>
                    <span className="text-white font-medium">{travelPackage.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Location:</span>
                    <span className="text-white font-medium">{travelPackage.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Group Size:</span>
                    <span className="text-white font-medium">8-15 people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Difficulty:</span>
                    <span className="text-white font-medium">Easy to Moderate</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl" onClick={closeImageModal}>
            {/* Luxury Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 opacity-50"></div>
            
            <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 p-2 rounded-full"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={displayImages[selectedImageIndex].imageUrl}
                  alt={displayImages[selectedImageIndex].title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white font-semibold text-lg text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">{displayImages[selectedImageIndex].title}</h3>
                <p className="text-white/80">{displayImages[selectedImageIndex].category}</p>
              </div>
              
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 p-2 rounded-full"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFED4E]/20 backdrop-blur-xl border border-[#FFD700]/30 hover:bg-gradient-to-r hover:from-[#FFD700]/40 hover:to-[#FFED4E]/40 text-[#FFD700] transition-all duration-200 p-2 rounded-full"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
