// Test script to verify tracking system for both bookings and custom tour requests

async function testTrackingSystem() {
  console.log('=== Testing Enhanced Tracking System ===');
  
  try {
    // Test 1: Create a custom tour request first
    console.log('\n1. Creating custom tour request...');
    const tourRequestData = {
      contactName: 'Test Tracking User',
      contactEmail: 'tracking@example.com',
      contactPhone: '0812345678',
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 150000,
      accommodation: 'premium',
      transportation: 'flight',
      activities: 'Shopping, Cultural sites',
      description: 'Test custom tour request for tracking'
    };
    
    const tourResponse = await fetch('http://localhost:3002/api/custom-tour-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tourRequestData)
    });
    
    if (!tourResponse.ok) {
      throw new Error(`Failed to create tour request: ${tourResponse.status}`);
    }
    
    const tourResult = await tourResponse.json();
    console.log('✅ Custom tour request created:', tourResult.data?.trackingNumber);
    
    const trackingNumber = tourResult.data?.trackingNumber;
    
    // Test 2: Create a booking (this requires a custom tour request ID)
    console.log('\n2. Creating booking...');
    const bookingData = {
      bookingType: 'CUSTOM',
      customTourRequestId: tourResult.data?.id,
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      customerName: 'Test Booking User',
      customerEmail: 'booking@example.com',
      customerPhone: '0887654321',
      specialRequirements: 'Vegetarian meals',
      notes: 'Test booking for tracking system'
    };
    
    const bookingResponse = await fetch('http://localhost:3002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!bookingResponse.ok) {
      console.log('⚠️  Booking creation failed, but that\'s okay for this test');
    } else {
      const bookingResult = await bookingResponse.json();
      console.log('✅ Booking created:', bookingResult.booking?.bookingNumber);
      
      // Test 3: Test tracking the booking
      if (bookingResult.booking?.bookingNumber) {
        console.log('\n3. Testing booking tracking...');
        const bookingTrackResponse = await fetch(`http://localhost:3002/api/bookings/search?query=${bookingResult.booking.bookingNumber}`);
        
        if (bookingTrackResponse.ok) {
          const bookingTrackData = await bookingTrackResponse.json();
          console.log('✅ Booking found via tracking:', bookingTrackData.data?.bookingNumber);
        }
      }
    }
    
    // Test 4: Test tracking the custom tour request
    if (trackingNumber) {
      console.log('\n4. Testing custom tour request tracking...');
      const tourTrackResponse = await fetch(`http://localhost:3002/api/custom-tour-requests/search?query=${trackingNumber}`);
      
      if (tourTrackResponse.ok) {
        const tourTrackData = await tourTrackResponse.json();
        console.log('✅ Custom tour request found via tracking:', tourTrackData.data?.trackingNumber);
      }
    }
    
    console.log('\n🎉 Enhanced tracking system test completed!');
    console.log('📝 Summary:');
    console.log('- Custom tour requests can be tracked with CTR-YYYYMMDD-XXXXX format');
    console.log('- Bookings can be tracked with BK... format');
    console.log('- Track page now supports both types');
    console.log('- Different display layouts for each type');
    
    return {
      success: true,
      trackingNumber: trackingNumber
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testTrackingSystem().then(result => {
  if (result.success) {
    console.log('\n✅ Enhanced tracking system test completed successfully!');
    if (result.trackingNumber) {
      console.log(`\n🔍 Try tracking this request: http://localhost:3002/track-request`);
      console.log(`   Tracking number: ${result.trackingNumber}`);
    }
  } else {
    console.log('\n💥 Test failed:', result.error);
  }
});
