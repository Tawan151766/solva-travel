// Test Custom Booking Success Flow
const testCustomBookingSuccessFlow = async () => {
  console.log('=== Testing Custom Booking Success Flow ===');
  
  try {
    // Step 1: Create a custom booking
    console.log('1. Creating custom booking...');
    const bookingData = {
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 150000,
      contactName: 'Test Success User',
      contactEmail: 'success@example.com',
      contactPhone: '0812345678',
      tripType: 'honeymoon',
      proposalType: 'custom_booking'
    };
    
    const createResponse = await fetch('http://localhost:3002/api/custom-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create booking: ${createResponse.status}`);
    }
    
    const createResult = await createResponse.json();
    console.log('✅ Custom booking created:', createResult);
    
    const bookingId = createResult.data?.customBookingId || createResult.data?.id;
    console.log('📋 Booking ID:', bookingId);
    
    // Step 2: Test fetching the booking by ID
    console.log('\n2. Testing fetch booking by ID...');
    const fetchResponse = await fetch(`http://localhost:3002/api/custom-bookings/${bookingId}`);
    
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch booking: ${fetchResponse.status}`);
    }
    
    const fetchResult = await fetchResponse.json();
    console.log('✅ Booking fetched successfully:', fetchResult);
    
    // Step 3: Test the success page URL
    const successUrl = `http://localhost:3002/tour-request-success?requestId=${bookingId}&type=custom_booking`;
    console.log('\n3. Success page URL:', successUrl);
    console.log('✅ You can now visit this URL to see the success page');
    
    return {
      success: true,
      bookingId: bookingId,
      successUrl: successUrl
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run the test
testCustomBookingSuccessFlow().then(result => {
  if (result.success) {
    console.log('\n🎉 All tests passed!');
    console.log('📝 Summary:');
    console.log(`- Booking ID: ${result.bookingId}`);
    console.log(`- Success URL: ${result.successUrl}`);
  } else {
    console.log('\n💥 Test failed:', result.error);
  }
});
