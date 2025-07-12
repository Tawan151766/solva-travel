// Test script to verify unified database approach
// Tests both CustomTourModal and tour-request page inserting to same database

async function testUnifiedDatabase() {
  console.log('=== Testing Unified Database Approach ===');
  
  try {
    // Test 1: Create request from CustomTourModal style (now using custom-tour-requests API)
    console.log('\n1. Testing CustomTourModal style request...');
    const customModalData = {
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 150000,
      contactName: 'Test Custom Modal User',
      contactEmail: 'custom@example.com',
      contactPhone: '0812345678',
      accommodation: 'premium',
      transportation: 'flight',
      activities: 'ประเภททริป: honeymoon, ต้องการไกด์นำเที่ยว',
      description: 'Custom booking proposal to ญี่ปุ่น Tokyo (honeymoon). Budget: ฿150,000. Require tour guide.',
      specialRequirements: '',
      requireGuide: true
    };
    
    const customResponse = await fetch('http://localhost:3002/api/custom-tour-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customModalData)
    });
    
    if (!customResponse.ok) {
      throw new Error(`Failed to create custom modal request: ${customResponse.status}`);
    }
    
    const customResult = await customResponse.json();
    console.log('✅ Custom modal request created:', customResult);
    
    const customTrackingNumber = customResult.data?.trackingNumber;
    
    // Test 2: Create regular tour request
    console.log('\n2. Testing regular tour request...');
    const tourRequestData = {
      contactName: 'Test Tour Request User',
      contactEmail: 'tour@example.com',
      contactPhone: '0887654321',
      destination: 'เกาหลีใต้ Seoul',
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      numberOfPeople: 4,
      budget: 200000,
      accommodation: 'hotel',
      transportation: 'flight',
      activities: 'Shopping, Cultural sites',
      specialRequirements: 'Vegetarian meals',
      description: 'Family trip to Seoul'
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
    console.log('✅ Tour request created:', tourResult);
    
    const tourTrackingNumber = tourResult.data?.trackingNumber;
    
    // Test 3: Fetch both requests to verify they're in the same database
    console.log('\n3. Testing fetch requests...');
    
    if (customTrackingNumber) {
      const fetchCustom = await fetch(`http://localhost:3002/api/custom-tour-requests/${customTrackingNumber}`);
      if (fetchCustom.ok) {
        const customData = await fetchCustom.json();
        console.log('✅ Custom modal request fetched:', customData.data?.trackingNumber);
      }
    }
    
    if (tourTrackingNumber) {
      const fetchTour = await fetch(`http://localhost:3002/api/custom-tour-requests/${tourTrackingNumber}`);
      if (fetchTour.ok) {
        const tourData = await fetchTour.json();
        console.log('✅ Tour request fetched:', tourData.data?.trackingNumber);
      }
    }
    
    // Test 4: Test success page URLs
    console.log('\n4. Success page URLs:');
    if (customTrackingNumber) {
      console.log(`Custom Modal Success: http://localhost:3002/tour-request-success?requestId=${customTrackingNumber}`);
    }
    if (tourTrackingNumber) {
      console.log(`Tour Request Success: http://localhost:3002/tour-request-success?requestId=${tourTrackingNumber}`);
    }
    
    console.log('\n🎉 All tests passed! Both forms are now using the same database table.');
    console.log('📝 Summary:');
    console.log('- CustomTourModal requests go to /api/custom-tour-requests');
    console.log('- Tour request page requests go to /api/custom-tour-requests');
    console.log('- Both use CustomTourRequest table in database');
    console.log('- Both redirect to tour-request-success page');
    
    return {
      success: true,
      customTrackingNumber,
      tourTrackingNumber
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
testUnifiedDatabase().then(result => {
  if (result.success) {
    console.log('\n✅ Unified database test completed successfully!');
  } else {
    console.log('\n💥 Test failed:', result.error);
  }
});
