// Test Registration API
const testRegistration = async () => {
  console.log('=== Testing Registration API ===');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test' + Date.now() + '@example.com', // Unique email
    password: 'password123',
    phone: '0812345678'
  };
  
  console.log('Test user data:', testUser);
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Response data:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('✅ Registration API works correctly');
      console.log('User ID:', result.data?.user?.id);
      console.log('Token present:', !!result.data?.token);
      return true;
    } else {
      console.log('❌ Registration API failed');
      console.log('Error:', result.message || 'Unknown error');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Registration API error:', error);
    return false;
  }
};

// Test database connection
const testDatabaseConnection = async () => {
  console.log('\n=== Testing Database Connection ===');
  
  try {
    const { prisma } = await import('./lib/prisma.js');
    
    // Test if we can count users
    const userCount = await prisma.user.count();
    console.log('✅ Database connected. Current user count:', userCount);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('Starting Registration Tests...\n');
  
  try {
    // Test database first
    const dbOk = await testDatabaseConnection();
    if (!dbOk) {
      console.log('❌ Database connection failed - stopping tests');
      return;
    }
    
    // Test registration API
    const regOk = await testRegistration();
    
    if (regOk) {
      console.log('\n✅ All registration tests passed');
    } else {
      console.log('\n❌ Registration tests failed');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
};

runTests();
