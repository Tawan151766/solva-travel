"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function TourRequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    dates: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your tour request! We will contact you soon.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#231f10] px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4 sm:mb-6" aria-label="Breadcrumb">
          <Link href="/" className="text-[#bcb69f] hover:text-white transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4 text-[#bcb69f]" fill="currentColor" viewBox="0 0 256 256">
            <path d="m181.66,133.66-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
          </svg>
          <span className="text-white font-medium">Tour Request</span>
        </nav>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4">
            Request a Custom Tour
          </h1>
          <p className="text-[#bcb69f] text-base sm:text-lg leading-relaxed max-w-3xl">
            Tell us about your dream destination and we&apos;ll create a personalized travel package just for you.
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#1e1c15] rounded-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Preferred Destination
                </label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none"
                  placeholder="Where would you like to go?"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Travel Dates
                </label>
                <input
                  type="text"
                  name="dates"
                  value={formData.dates}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none"
                  placeholder="When do you want to travel?"
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Additional Requirements
              </label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#231f10] text-white rounded-lg border border-[#4a4221] focus:border-[#d4af37] focus:outline-none resize-none"
                placeholder="Tell us more about your travel preferences, special requests, or any questions you have..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#d4af37] hover:bg-[#c49e2a] text-[#231f10] px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
