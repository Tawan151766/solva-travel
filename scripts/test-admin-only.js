import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const API_BASE = 'http://localhost:3000';

async function testAdminOnlyAccess() {
  try {
    console.log('🔍 Testing Admin-Only Access Control');
    console.log('🌐 API Base:', API_BASE);
    console.log('');
    
    // Create test tokens
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
    
    // Test endpoints
    const endpoints = [
      '/api/management/packages',
      '/api/management/bookings',
      '/api/management/stats',
      '/api/management/users',
      '/api/management/custom-tour-requests'
    ];
    
    for (const endpoint of endpoints) {
      console.log(`🔗 Testing endpoint: ${endpoint}`);
      
      // Test with ADMIN token (should work)
      try {
        const adminResponse = await fetch(`${API_BASE}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log(`  👑 ADMIN: ${adminResponse.status} ${adminResponse.ok ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`  👑 ADMIN: Error - ${error.message}`);
      }
      
      // Test with OPERATOR token (should fail)
      try {
        const operatorResponse = await fetch(`${API_BASE}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${operatorToken}` }
        });
        const operatorData = await operatorResponse.json();
        console.log(`  🔧 OPERATOR: ${operatorResponse.status} ${operatorResponse.ok ? '❌ Should fail!' : '✅'} - ${operatorData.message || 'OK'}`);
      } catch (error) {
        console.log(`  🔧 OPERATOR: Error - ${error.message}`);
      }
      
      // Test with USER token (should fail)
      try {
        const userResponse = await fetch(`${API_BASE}${endpoint}`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const userData = await userResponse.json();
        console.log(`  👤 USER: ${userResponse.status} ${userResponse.ok ? '❌ Should fail!' : '✅'} - ${userData.message || 'OK'}`);
      } catch (error) {
        console.log(`  👤 USER: Error - ${error.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎉 Admin-Only Access Control Test Completed!');
    console.log('');
    console.log('📋 Expected Results:');
    console.log('✅ ADMIN tokens should return 200 (success)');
    console.log('❌ OPERATOR tokens should return 403 (forbidden)');
    console.log('❌ USER tokens should return 403 (forbidden)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminOnlyAccess();