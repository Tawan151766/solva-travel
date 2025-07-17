import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function testToken() {
  try {
    console.log('🔍 Testing JWT Token Generation and Validation');
    console.log('🔑 JWT_SECRET:', JWT_SECRET);
    console.log('');
    
    // Test token creation
    const testPayload = {
      userId: 'test-user-id',
      email: 'admin@solva.com',
      role: 'ADMIN'
    };
    
    console.log('📝 Creating token with payload:', testPayload);
    const token = jwt.sign(testPayload, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ Token created:', token.substring(0, 50) + '...');
    console.log('');
    
    // Test token verification
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified successfully!');
    console.log('📋 Decoded payload:', decoded);
    console.log('');
    
    // Test token expiry
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    console.log('⏰ Token expires in:', timeUntilExpiry, 'seconds');
    console.log('📅 Token expires at:', new Date(decoded.exp * 1000));
    console.log('');
    
    // Test with invalid secret
    console.log('🚫 Testing with invalid secret...');
    try {
      jwt.verify(token, 'wrong-secret');
      console.log('❌ This should not happen!');
    } catch (error) {
      console.log('✅ Correctly rejected invalid secret:', error.message);
    }
    
    console.log('');
    console.log('🎉 All token tests passed!');
    
  } catch (error) {
    console.error('❌ Token test failed:', error);
  }
}

testToken();