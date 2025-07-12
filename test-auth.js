// Simple authentication test script

async function testLogin() {
  try {
    console.log('Testing authentication...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', data.data.user.firstName, data.data.user.lastName);
      console.log('Token:', data.data.token ? 'PRESENT' : 'MISSING');
      
      // Test if token can be used
      console.log('\nTesting token validation...');
      const testResponse = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.data.token}`
        }
      });
      
      if (testResponse.ok) {
        const userData = await testResponse.json();
        console.log('✅ Token validation successful!');
        console.log('Authenticated user:', userData.data.user.email);
      } else {
        console.log('❌ Token validation failed');
        const errorData = await testResponse.json();
        console.log('Error:', errorData);
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Login failed');
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLogin();
