// Mock API for authentication and OTP handling

// Simulate a delay for API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database (in real app, this would be your backend)
const mockUsers = new Map();
const otpStorage = new Map(); // Store OTP codes temporarily

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock email service
const sendEmailOTP = async (email, otp) => {
  console.log(`📧 Sending OTP ${otp} to ${email}`);
  // In real app, you would use a service like SendGrid, AWS SES, etc.
  return true;
};

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    await delay(1500); // Simulate network delay
    
    const { firstName, lastName, email, password } = userData;
    
    // Check if user already exists
    if (mockUsers.has(email)) {
      throw new Error('อีเมลนี้ได้ถูกใช้งานแล้ว');
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store user data temporarily (until OTP verification)
    const tempUserData = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password, // In real app, hash this password
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    // Store OTP with expiration (5 minutes)
    otpStorage.set(email, {
      otp,
      userData: tempUserData,
      expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutes
      attempts: 0
    });
    
    // Send OTP via email
    await sendEmailOTP(email, otp);
    
    return {
      success: true,
      message: 'รหัส OTP ได้ถูกส่งไปยังอีเมลของคุณแล้ว',
      email
    };
  },

  // Verify OTP and complete registration
  verifyOTP: async (email, otp) => {
    await delay(1000); // Simulate network delay
    
    const otpData = otpStorage.get(email);
    
    if (!otpData) {
      throw new Error('ไม่พบรหัส OTP สำหรับอีเมลนี้');
    }
    
    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      otpStorage.delete(email);
      throw new Error('รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่');
    }
    
    // Check attempt limit
    if (otpData.attempts >= 3) {
      otpStorage.delete(email);
      throw new Error('ใส่รหัส OTP ผิดเกินจำนวนที่กำหนด กรุณาขอรหัสใหม่');
    }
    
    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts += 1;
      throw new Error('รหัส OTP ไม่ถูกต้อง');
    }
    
    // OTP is correct - create user account
    const userData = otpData.userData;
    userData.isVerified = true;
    mockUsers.set(email, userData);
    
    // Clean up OTP storage
    otpStorage.delete(email);
    
    return {
      success: true,
      message: 'ยืนยันอีเมลสำเร็จ บัญชีของคุณได้ถูกสร้างแล้ว',
      user: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      }
    };
  },

  // Resend OTP
  resendOTP: async (email) => {
    await delay(1000); // Simulate network delay
    
    const otpData = otpStorage.get(email);
    
    if (!otpData) {
      throw new Error('ไม่พบข้อมูลการสมัครสมาชิกสำหรับอีเมลนี้');
    }
    
    // Generate new OTP
    const newOTP = generateOTP();
    
    // Update OTP data
    otpData.otp = newOTP;
    otpData.expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes
    otpData.attempts = 0;
    
    // Send new OTP via email
    await sendEmailOTP(email, newOTP);
    
    return {
      success: true,
      message: 'รหัส OTP ใหม่ได้ถูกส่งไปยังอีเมลของคุณแล้ว'
    };
  },

  // Login user
  login: async (email, password) => {
    await delay(1000); // Simulate network delay
    
    const user = mockUsers.get(email);
    
    if (!user) {
      throw new Error('ไม่พบบัญชีผู้ใช้สำหรับอีเมลนี้');
    }
    
    if (!user.isVerified) {
      throw new Error('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');
    }
    
    // In real app, compare hashed passwords
    if (user.password !== password) {
      throw new Error('รหัสผ่านไม่ถูกต้อง');
    }
    
    return {
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token: `mock_token_${user.id}` // Mock JWT token
    };
  },

  // Get current user (for checking login status)
  getCurrentUser: async (token) => {
    await delay(500); // Simulate network delay
    
    if (!token || !token.startsWith('mock_token_')) {
      throw new Error('โทเค็นไม่ถูกต้อง');
    }
    
    const userId = token.replace('mock_token_', '');
    const user = Array.from(mockUsers.values()).find(u => u.id === userId);
    
    if (!user) {
      throw new Error('ไม่พบผู้ใช้');
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    };
  },

  // Logout (client-side, just remove token)
  logout: async () => {
    await delay(300);
    return {
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    };
  }
};

// Helper function to check OTP status (for debugging)
export const getOTPStatus = (email) => {
  const otpData = otpStorage.get(email);
  if (!otpData) return null;
  
  return {
    email,
    otp: otpData.otp, // In real app, don't return the actual OTP
    expiresAt: new Date(otpData.expiresAt).toLocaleString(),
    attempts: otpData.attempts,
    isExpired: Date.now() > otpData.expiresAt
  };
};

// Helper function to get all users (for debugging)
export const getAllUsers = () => {
  return Array.from(mockUsers.values()).map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt
  }));
};
