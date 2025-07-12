'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    endDate: '',
    numberOfPeople: 1,
    specialRequirements: '',
    notes: ''
  });

  const [packageData, setPackageData] = useState(null);
  const [customTourData, setCustomTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get booking parameters from URL
  const bookingType = searchParams.get('type'); // 'package' or 'custom'
  const packageId = searchParams.get('packageId');
  const customTourRequestId = searchParams.get('customTourRequestId');

  useEffect(() => {
    // Auto-fill user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        customerPhone: user.phone || ''
      }));
    }

    // Load package or custom tour data
    loadBookingData();
  }, [user, packageId, customTourRequestId, bookingType]);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError('');

      if (bookingType === 'package' && packageId) {
        console.log('Loading package data for ID:', packageId);
        const response = await fetch(`/api/travel/packages/${packageId}`);
        console.log('Package response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Package data received:', data);
          setPackageData(data.data); // แก้จาก data.package เป็น data.data
          
          // Set default dates - packages don't have specific start dates, so use today + 7 days as default
          const today = new Date();
          const defaultStartDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
          const defaultEndDate = new Date(defaultStartDate.getTime() + (data.data.durationDays || 7) * 24 * 60 * 60 * 1000);
          
          setFormData(prev => ({
            ...prev,
            startDate: defaultStartDate.toISOString().split('T')[0],
            endDate: defaultEndDate.toISOString().split('T')[0]
          }));
        } else {
          const errorData = await response.json();
          console.error('Package API error:', errorData);
          setError('Failed to load package information');
        }
      } else if (bookingType === 'custom' && customTourRequestId) {
        console.log('Loading custom tour data for ID:', customTourRequestId);
        const response = await fetch(`/api/custom-tour-requests/${customTourRequestId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        console.log('Custom tour response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Custom tour data received:', data);
          setCustomTourData(data.request);
          
          // Pre-fill form with custom tour data
          setFormData(prev => ({
            ...prev,
            customerName: data.request.contactName,
            customerEmail: data.request.contactEmail,
            customerPhone: data.request.contactPhone,
            startDate: new Date(data.request.startDate).toISOString().split('T')[0],
            endDate: new Date(data.request.endDate).toISOString().split('T')[0],
            numberOfPeople: data.request.numberOfPeople,
            specialRequirements: data.request.specialRequirements || '',
            notes: data.request.description || ''
          }));
        } else {
          const errorData = await response.json();
          console.error('Custom tour API error:', errorData);
          setError('Failed to load custom tour information');
        }
      } else {
        console.log('Missing booking type or ID:', { bookingType, packageId, customTourRequestId });
        setError('Invalid booking parameters');
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalAmount = () => {
    if (bookingType === 'package' && packageData) {
      return (packageData.priceNumber || parseFloat(packageData.price || 0)) * formData.numberOfPeople;
    } else if (bookingType === 'custom' && customTourData) {
      return customTourData.estimatedCost || 0;
    }
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        bookingType: bookingType.toUpperCase(),
        packageId: bookingType === 'package' ? packageId : null,
        customTourRequestId: bookingType === 'custom' ? customTourRequestId : null,
        ...formData,
        numberOfPeople: parseInt(formData.numberOfPeople)
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/booking-success?bookingNumber=${result.booking.bookingNumber}`);
      } else {
        setError(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setError('An error occurred while creating your booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (!bookingType || (!packageData && !customTourData)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Booking Request</h2>
          <p className="text-gray-600 mb-4">The booking information could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">
              {bookingType === 'package' ? 'Package Booking' : 'Custom Tour Booking'}
            </h1>
            <p className="text-blue-100">Complete your booking information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {bookingType === 'package' ? 'Package Details' : 'Tour Details'}
                </h2>
                
                {packageData && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{packageData.name}</h3>
                    <p className="text-gray-600">{packageData.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span> {packageData.durationDays || 7} days
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {packageData.location}
                      </div>
                      <div>
                        <span className="font-medium">Price per person:</span> ฿{(packageData.priceNumber || parseFloat(packageData.price || 0)).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Max capacity:</span> {packageData.maxCapacity} people
                      </div>
                    </div>
                  </div>
                )}

                {customTourData && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-lg">Custom Tour to {customTourData.destination}</h3>
                    {customTourData.description && (
                      <p className="text-gray-600">{customTourData.description}</p>
                    )}
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div><span className="font-medium">Destination:</span> {customTourData.destination}</div>
                      <div><span className="font-medium">Duration:</span> {Math.ceil((new Date(customTourData.endDate) - new Date(customTourData.startDate)) / (1000 * 60 * 60 * 24))} days</div>
                      <div><span className="font-medium">Number of people:</span> {customTourData.numberOfPeople}</div>
                      {customTourData.accommodation && (
                        <div><span className="font-medium">Accommodation:</span> {customTourData.accommodation}</div>
                      )}
                      {customTourData.transportation && (
                        <div><span className="font-medium">Transportation:</span> {customTourData.transportation}</div>
                      )}
                      {customTourData.estimatedCost && (
                        <div><span className="font-medium">Estimated cost:</span> ฿{customTourData.estimatedCost.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Price Summary</h3>
                <div className="space-y-2 text-sm">
                  {bookingType === 'package' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Price per person:</span>
                        <span>฿{(packageData?.priceNumber || parseFloat(packageData?.price || 0)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of people:</span>
                        <span>{formData.numberOfPeople}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span>฿{calculateTotalAmount().toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total estimated cost:</span>
                      <span>฿{calculateTotalAmount().toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      min={formData.startDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {bookingType === 'package' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of People *
                    </label>
                    <select
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[...Array(Math.min(packageData?.maxCapacity || 10, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'person' : 'people'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {bookingType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of People *
                    </label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any dietary restrictions, accessibility needs, or other special requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any additional information or requests..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
