import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE = 'http://localhost:3000';

async function testManagementAPI() {
  try {
    console.log('🔍 Testing Management API Access');
    console.log('🌐 API Base:', API_BASE);
    console.log('');
    
    // Test 1: Create tokens for different roles
    const adminToken = jwt.sign({
      userId: 'test-admin-id',
      email: 'admin@solva.com',
      role: 'ADMIN'
    }, JWT_SECRET, { expiresIn: '7d' });
    
    const operatorToken = jwt.sign({
      userId: 'test-operator-id',
      email: 'operator@solva.com',
      role: 'OPERATOR'
    }, JWT_SECRET, { expiresIn: '7d' });
    
    const userToken = jwt.sign({
      userId: 'test-user-id',
      email: 'user@solva.com',
      role: 'USER'
    }, JWT_SECRET, { expiresIn: '7d' });
    
    console.log('✅ Test tokens created');
    console.log('');
    
    // Test 2: Test with ADMIN token
    console.log('🔑 Testing with ADMIN token...');
    try {
      const response = await fetch(`${API_BASE}/api/management/packages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ ADMIN access successful');
        console.log('📦 Packages found:', data.data?.length || 0);
      } else {
        console.log('❌ ADMIN access failed:', data.message);
      }
    } catch (error) {
      console.log('❌ ADMIN request error:', error.message);
    }
    console.log('');
    
    // Test 3: Test with OPERATOR token
    console.log('🔑 Testing with OPERATOR token...');
    try {
      const response = await fetch(`${API_BASE}/api/management/packages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${operatorToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ OPERATOR access successful');
        console.log('📦 Packages found:', data.data?.length || 0);
      } else {
        console.log('❌ OPERATOR access failed:', data.message);
      }
    } catch (error) {
      console.log('❌ OPERATOR request error:', error.message);
    }
    console.log('');
    
    // Test 4: Test with USER token (should fail)
    console.log('🔑 Testing with USER token (should fail)...');
    try {
      const response = await fetch(`${API_BASE}/api/management/packages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      
      if (response.ok) {
        console.log('❌ USER access should have failed but succeeded');
      } else {
        console.log('✅ USER access correctly denied:', data.message);
      }
    } catch (error) {
      console.log('❌ USER request error:', error.message);
    }
    console.log('');
    
    // Test 5: Test without token (should fail)
    console.log('🚫 Testing without token (should fail)...');
    try {
      const response = await fetch(`${API_BASE}/api/management/packages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      
      if (response.ok) {
        console.log('❌ No token access should have failed but succeeded');
      } else {
        console.log('✅ No token access correctly denied:', data.message);
      }
    } catch (error) {
      console.log('❌ No token request error:', error.message);
    }
    
    console.log('');
    console.log('🎉 Management API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testManagementAPI();