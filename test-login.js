// Test Login API
const testLogin = async () => {
  console.log('=== Testing Login API ===');
  
  // First, let's create a test user to login with
  const testUser = {
    firstName: 'Login',
    lastName: 'Test',
    email: 'logintest@example.com',
    password: 'password123',
    phone: '0812345678'
  };
  
  try {
    console.log('1. Creating test user for login...');
    const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    if (registerResponse.ok) {
      console.log('✅ Test user created successfully');
    } else {
      const regError = await registerResponse.json();
      console.log('ℹ️ User might already exist:', regError.message);
    }
    
    console.log('\n2. Testing login...');
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    console.log('Login data:', loginData);
    
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const loginResult = await loginResponse.json();
    console.log('Login response data:', JSON.stringify(loginResult, null, 2));
    
    if (loginResponse.ok && loginResult.success) {
      console.log('✅ Login API works correctly');
      console.log('User ID:', loginResult.data?.user?.id);
      console.log('Token present:', !!loginResult.data?.token);
      return true;
    } else {
      console.log('❌ Login API failed');
      console.log('Error:', loginResult.message || 'Unknown error');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Login API error:', error);
    return false;
  }
};

// Test with wrong credentials
const testWrongLogin = async () => {
  console.log('\n=== Testing Login with Wrong Credentials ===');
  
  const wrongLoginData = {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wrongLoginData)
    });
    
    const result = await response.json();
    console.log('Wrong credentials response status:', response.status);
    console.log('Wrong credentials response:', JSON.stringify(result, null, 2));
    
    if (!response.ok && !result.success) {
      console.log('✅ Error handling works correctly');
      return true;
    } else {
      console.log('❌ Should have failed with wrong credentials');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Wrong credentials test error:', error);
    return false;
  }
};

// Run tests
const runLoginTests = async () => {
  console.log('Starting Login API Tests...\n');
  
  try {
    const loginOk = await testLogin();
    const errorHandlingOk = await testWrongLogin();
    
    if (loginOk && errorHandlingOk) {
      console.log('\n✅ All login tests passed');
    } else {
      console.log('\n❌ Some login tests failed');
    }
    
  } catch (error) {
    console.error('\n❌ Login tests failed with error:', error);
  }
};

runLoginTests();
