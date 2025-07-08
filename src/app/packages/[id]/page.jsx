"use client";

import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import { useTravelContext } from "@/core/context";
import Link from "next/link";
import Image from "next/image";

function PackageBreadcrumb({ packageTitle }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4 sm:mb-6" aria-label="Breadcrumb">
      <Link 
        href="/"
        className="text-[#bcb69f] hover:text-white transition-colors"
      >
        Home
      </Link>
      <svg className="w-4 h-4 text-[#bcb69f]" fill="currentColor" viewBox="0 0 256 256">
        <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
      </svg>
      <Link 
        href="/"
        className="text-[#bcb69f] hover:text-white transition-colors"
      >
        Travel Packages
      </Link>
      <svg className="w-4 h-4 text-[#bcb69f]" fill="currentColor" viewBox="0 0 256 256">
        <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
      </svg>
      <span className="text-white font-medium truncate">
        {packageTitle}
      </span>
    </nav>
  );
}

function PackageNavigation({ currentPackageId, allPackages }) {
  const currentIndex = allPackages.findIndex(pkg => pkg.id === currentPackageId);
  const prevPackage = currentIndex > 0 ? allPackages[currentIndex - 1] : null;
  const nextPackage = currentIndex < allPackages.length - 1 ? allPackages[currentIndex + 1] : null;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 p-4 bg-[#1e1c15] rounded-xl">
      <div className="flex gap-3">
        {prevPackage && (
          <Link
            href={`/packages/${prevPackage.id}`}
            className="flex items-center gap-2 bg-[#3f3b2c] hover:bg-[#4a4221] text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="m165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
            </svg>
            Previous
          </Link>
        )}
        {nextPackage && (
          <Link
            href={`/packages/${nextPackage.id}`}
            className="flex items-center gap-2 bg-[#3f3b2c] hover:bg-[#4a4221] text-white px-4 py-2 rounded-full transition-colors text-sm font-medium"
          >
            Next
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
            </svg>
          </Link>
        )}
      </div>

      <div className="text-[#bcb69f] text-sm">
        Package {currentIndex + 1} of {allPackages.length}
      </div>
    </div>
  );
}

function PackageDetails({ travelPackage }) {
  return (
    <div className="bg-[#1e1c15] rounded-xl p-6 sm:p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Package Image */}
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
          <Image
            src={travelPackage.imageUrl}
            alt={travelPackage.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Package Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {travelPackage.title}
            </h1>
            <p className="text-[#bcb69f] text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z" />
              </svg>
              {travelPackage.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2a2821] p-4 rounded-lg">
              <h3 className="text-[#d4af37] font-semibold mb-1">Duration</h3>
              <p className="text-white text-lg">{travelPackage.duration}</p>
            </div>
            <div className="bg-[#2a2821] p-4 rounded-lg">
              <h3 className="text-[#d4af37] font-semibold mb-1">Price</h3>
              <p className="text-white text-lg font-bold">${travelPackage.price}</p>
            </div>
          </div>

          {travelPackage.description && (
            <div>
              <h3 className="text-white text-xl font-semibold mb-3">Description</h3>
              <p className="text-[#bcb69f] leading-relaxed">
                {travelPackage.description}
              </p>
            </div>
          )}

          {travelPackage.highlights && (
            <div>
              <h3 className="text-white text-xl font-semibold mb-3">Highlights</h3>
              <ul className="space-y-2">
                {travelPackage.highlights.map((highlight, index) => (
                  <li key={index} className="text-[#bcb69f] flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 256 256">
                      <path d="m229.66,77.66-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
                    </svg>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button className="bg-[#d4af37] hover:bg-[#c49e2a] text-[#231f10] px-6 py-3 rounded-full font-semibold transition-colors">
              Book Now
            </button>
            <Link
              href="/tour-request"
              className="bg-[#3f3b2c] hover:bg-[#4a4221] text-white px-6 py-3 rounded-full font-semibold transition-colors text-center"
            >
              Custom Tour Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackagePage({ params }) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);
  const { allTravelData } = useTravelContext();

  // Find travel package
  const travelPackage = allTravelData.find(pkg => pkg.id === id);
  
  if (!travelPackage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#231f10] px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <PackageBreadcrumb packageTitle={travelPackage.title} />
        
        {/* Package Navigation */}
        <PackageNavigation 
          currentPackageId={id}
          allPackages={allTravelData}
        />

        {/* Package Details */}
        <Suspense fallback={
          <div className="bg-[#1e1c15] rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-[#2a2821] rounded mb-4"></div>
            <div className="h-4 bg-[#2a2821] rounded mb-2"></div>
            <div className="h-4 bg-[#2a2821] rounded w-3/4"></div>
          </div>
        }>
          <PackageDetails travelPackage={travelPackage} />
        </Suspense>

        {/* Related Packages */}
        <div className="bg-[#1e1c15] rounded-xl p-6 sm:p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Similar Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTravelData
              .filter(pkg => pkg.id !== id && pkg.location === travelPackage.location)
              .slice(0, 3)
              .map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                  <div className="bg-[#2a2821] rounded-lg overflow-hidden hover:bg-[#3f3b2c] transition-colors">
                    <div className="relative h-48">
                      <Image
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{pkg.title}</h3>
                      <p className="text-[#bcb69f] text-sm mb-2">{pkg.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#d4af37] font-bold">${pkg.price}</span>
                        <span className="text-[#bcb69f] text-sm">{pkg.duration}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
