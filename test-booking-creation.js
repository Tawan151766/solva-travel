// Test script to verify booking creation and tracking

async function testBookingCreation() {
  console.log('=== Testing Booking Creation & Tracking ===');
  
  try {
    // Step 1: Create a custom tour request first (required for custom booking)
    console.log('\n1. Creating custom tour request (required for booking)...');
    const tourRequestData = {
      contactName: 'Test Booking User',
      contactEmail: 'testbooking@example.com',
      contactPhone: '0812345678',
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 150000,
      accommodation: 'premium',
      transportation: 'flight',
      description: 'Test for booking creation'
    };
    
    const tourResponse = await fetch('http://localhost:3002/api/custom-tour-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tourRequestData)
    });
    
    if (!tourResponse.ok) {
      const tourError = await tourResponse.text();
      throw new Error(`Failed to create custom tour request: ${tourResponse.status} - ${tourError}`);
    }
    
    const tourResult = await tourResponse.json();
    console.log('✅ Custom tour request created:', tourResult.data?.trackingNumber);
    
    const customTourRequestId = tourResult.data?.id;
    
    // Step 2: Create a booking based on the custom tour request
    console.log('\n2. Creating booking...');
    const bookingData = {
      bookingType: 'CUSTOM',
      customTourRequestId: customTourRequestId,
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      customerName: 'Test Booking User',
      customerEmail: 'testbooking@example.com',
      customerPhone: '0812345678',
      specialRequirements: 'Test booking',
      notes: 'Test booking creation'
    };
    
    console.log('Sending booking data:', bookingData);
    
    const bookingResponse = await fetch('http://localhost:3002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('Booking response status:', bookingResponse.status);
    
    if (!bookingResponse.ok) {
      const bookingError = await bookingResponse.text();
      console.error('Booking creation failed:', bookingError);
      throw new Error(`Failed to create booking: ${bookingResponse.status} - ${bookingError}`);
    }
    
    const bookingResult = await bookingResponse.json();
    console.log('✅ Booking created successfully:', bookingResult);
    
    const bookingNumber = bookingResult.booking?.bookingNumber;
    const bookingId = bookingResult.booking?.id;
    
    // Step 3: Test tracking the booking
    if (bookingNumber) {
      console.log('\n3. Testing booking tracking...');
      const trackResponse = await fetch(`http://localhost:3002/api/bookings/search?query=${bookingNumber}`);
      
      if (trackResponse.ok) {
        const trackData = await trackResponse.json();
        console.log('✅ Booking found via tracking:', trackData.data?.bookingNumber);
      } else {
        console.log('⚠️  Booking tracking failed');
      }
    }
    
    console.log('\n🎉 Booking creation test completed!');
    console.log('📝 Summary:');
    console.log(`- Custom tour request: ${tourResult.data?.trackingNumber}`);
    console.log(`- Booking number: ${bookingNumber}`);
    console.log(`- Booking ID: ${bookingId}`);
    
    if (bookingNumber) {
      console.log(`\n🔍 Test tracking: http://localhost:3002/track-request`);
      console.log(`   Booking number: ${bookingNumber}`);
    }
    
    return {
      success: true,
      bookingNumber: bookingNumber,
      bookingId: bookingId,
      trackingNumber: tourResult.data?.trackingNumber
    };
    
  } catch (error) {
    console.error('❌ Booking test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testBookingCreation().then(result => {
  if (result.success) {
    console.log('\n✅ Booking creation and tracking test completed successfully!');
  } else {
    console.log('\n💥 Test failed:', result.error);
  }
});
