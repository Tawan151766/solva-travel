// Test API endpoints
const testCustomBooking = async () => {
  try {
    console.log('Testing Custom Booking API...');
    
    const testData = {
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 100000,
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '0812345678',
      tripType: 'family',
      proposalType: 'custom_booking'
    };

    const response = await fetch('http://localhost:3002/api/custom-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response Data:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('API Test Error:', error);
    throw error;
  }
};

const testCustomTourRequest = async () => {
  try {
    console.log('\nTesting Custom Tour Request API...');
    
    const testData = {
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '0812345678',
      destination: 'ญี่ปุ่น Tokyo',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      numberOfPeople: 2,
      budget: 80000,
      packageId: null,
      selectedGroupSize: null,
      pricePerPerson: null,
      totalPrice: null
    };

    const response = await fetch('http://localhost:3002/api/custom-tour-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Response Status:', response.status);
    const result = await response.json();
    console.log('Response Data:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('API Test Error:', error);
    throw error;
  }
};

// Test database connection
const testPrismaConnection = async () => {
  try {
    console.log('\nTesting Prisma Connection...');
    const { prisma } = await import('./lib/prisma.js');
    
    // Simple query to test connection
    const userCount = await prisma.user.count();
    console.log('Database connected successfully. User count:', userCount);
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Run tests
const runTests = async () => {
  console.log('=== API Testing Started ===\n');
  
  try {
    // Test database connection first
    await testPrismaConnection();
    
    // Test Custom Booking API
    await testCustomBooking();
    
    // Test Custom Tour Request API  
    await testCustomTourRequest();
    
    console.log('\n=== All Tests Completed Successfully ===');
  } catch (error) {
    console.error('\n=== Test Failed ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
};

runTests();
