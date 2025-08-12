'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Phone, Mail, User, FileText, DollarSign } from 'lucide-react';

const BookingForm = ({ 
  packageData,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    customerName: session?.user ? `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() : '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequirements: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateTotalAmount = () => {
    if (!packageData?.price || !formData.numberOfPeople) return 0;
    return packageData.price * formData.numberOfPeople;
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }

      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (formData.numberOfPeople < 1) {
      newErrors.numberOfPeople = 'Number of people must be at least 1';
    }

    if (packageData?.maxCapacity && formData.numberOfPeople > packageData.maxCapacity) {
      newErrors.numberOfPeople = `Maximum ${packageData.maxCapacity} people allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        packageId: packageData.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfPeople: parseInt(formData.numberOfPeople),
        specialRequirements: formData.specialRequirements,
        notes: formData.notes,
        totalAmount: calculateTotalAmount(),
        pricePerPerson: packageData.price
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // Success - redirect to booking success page
      if (onSuccess) {
        onSuccess(result.data);
      } else {
        router.push(`/booking-success?trackingId=${result.trackingId}&bookingNumber=${result.bookingNumber}`);
      }

    } catch (error) {
      console.error('Booking submission error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#FFD700]/20">
        <div className="sticky top-0 bg-gradient-to-r from-black/95 via-[#0a0804]/95 to-black/95 backdrop-blur-xl border-b border-[#FFD700]/20 px-8 py-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">
            Book Your Adventure
          </h2>
          <button
            onClick={onClose}
            className="text-[#FFD700] hover:text-[#FFED4E] text-3xl transition-colors hover:rotate-90 duration-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Package Summary */}
          <div className="bg-gradient-to-br from-[#FFD700]/10 via-[#FFED4E]/5 to-[#FFD700]/10 backdrop-blur-xl p-6 rounded-xl border border-[#FFD700]/30 shadow-lg shadow-[#FFD700]/10">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text mb-4">
              {packageData?.name}
            </h3>
            <div className="text-white/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700]">📍</span>
                <span>{packageData?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700]">⏱️</span>
                <span>{packageData?.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700]">💰</span>
                <span className="text-[#FFD700] font-semibold">${packageData?.price} per person</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-br from-black/50 via-[#0a0804]/50 to-black/50 backdrop-blur-xl rounded-xl p-6 border border-[#FFD700]/20 shadow-lg shadow-black/30 space-y-6">
            <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text flex items-center gap-3">
              <User className="w-6 h-6 text-[#FFD700]" />
              Customer Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                    errors.customerName ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.customerName && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                    errors.customerPhone ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.customerPhone && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                  errors.customerEmail ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                }`}
                placeholder="Enter your email address"
              />
              {errors.customerEmail && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span>⚠️</span> {errors.customerEmail}
                </p>
              )}
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-gradient-to-br from-black/50 via-[#0a0804]/50 to-black/50 backdrop-blur-xl rounded-xl p-6 border border-[#FFD700]/20 shadow-lg shadow-black/30 space-y-6">
            <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#FFD700]" />
              Trip Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getTodayString()}
                  className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                    errors.startDate ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate || getTomorrowString()}
                  className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                    errors.endDate ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.endDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                  Number of People *
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  min="1"
                  max={packageData?.maxCapacity || 50}
                  className={`w-full px-4 py-3 bg-black/30 border-2 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 ${
                    errors.numberOfPeople ? 'border-red-500' : 'border-[#FFD700]/30 hover:border-[#FFD700]/50'
                  }`}
                />
                {errors.numberOfPeople && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <span>⚠️</span> {errors.numberOfPeople}
                  </p>
                )}
              </div>
            </div>

            {calculateDuration() > 0 && (
              <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-3">
                <p className="text-[#FFD700] font-medium flex items-center gap-2">
                  <span>✨</span>
                  Trip duration: {calculateDuration()} day{calculateDuration() !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-black/50 via-[#0a0804]/50 to-black/50 backdrop-blur-xl rounded-xl p-6 border border-[#FFD700]/20 shadow-lg shadow-black/30 space-y-6">
            <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text flex items-center gap-3">
              <FileText className="w-6 h-6 text-[#FFD700]" />
              Additional Information
            </h4>
            
            <div>
              <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                Special Requirements
              </label>
              <textarea
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-black/30 border-2 border-[#FFD700]/30 hover:border-[#FFD700]/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 resize-none"
                placeholder="Any dietary restrictions, accessibility needs, allergies, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#FFD700] mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 bg-black/30 border-2 border-[#FFD700]/30 hover:border-[#FFD700]/50 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] transition-all duration-200 resize-none"
                placeholder="Any additional comments, special celebrations, or requests"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-br from-[#FFD700]/20 via-[#FFED4E]/10 to-[#FFD700]/20 backdrop-blur-xl rounded-xl p-6 border border-[#FFD700]/40 shadow-2xl shadow-[#FFD700]/20">
            <h4 className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-[#FFD700]" />
              Price Summary
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-white/90">
                <span className="text-lg">Price per person:</span>
                <span className="text-[#FFD700] font-semibold text-lg">${packageData?.price}</span>
              </div>
              <div className="flex justify-between items-center text-white/90">
                <span className="text-lg">Number of people:</span>
                <span className="text-[#FFD700] font-semibold text-lg">{formData.numberOfPeople}</span>
              </div>
              <div className="border-t border-[#FFD700]/30 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">
                    Total Amount:
                  </span>
                  <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD700] to-[#FFED4E] bg-clip-text">
                    ${calculateTotalAmount()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/40 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xl">⚠️</span>
                <p className="text-red-300 font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#FFD700]/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-transparent border-2 border-[#FFD700]/40 text-[#FFD700] rounded-xl hover:bg-[#FFD700]/10 hover:border-[#FFD700]/60 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFED4E] text-black rounded-xl hover:from-[#FFED4E] hover:to-[#FFD700] font-bold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#FFD700]/30"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Book Your Adventure'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
