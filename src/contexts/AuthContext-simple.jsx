"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export function AuthProvider({ children }) {
  console.log('🚀 AuthProvider: Component initialized - SIMPLIFIED VERSION');
  console.log('🚀 AuthProvider: Current timestamp:', new Date().toISOString());
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🚀 AuthProvider: State initialized, loading:', loading);

  // Single useEffect to handle all auth initialization
  useEffect(() => {
    console.log('AuthContext: === MAIN useEffect TRIGGERED ===');
    console.log('AuthContext: Timestamp:', new Date().toISOString());
    
    const initializeAuth = () => {
      console.log('AuthContext: Initializing auth...');
      console.log('AuthContext: typeof window:', typeof window);
      
      if (typeof window === 'undefined') {
        console.log('AuthContext: Server-side detected, setting loading to false');
        setLoading(false);
        return;
      }
      
      console.log('AuthContext: Client-side detected, checking localStorage...');
      console.log('AuthContext: localStorage available:', typeof localStorage !== 'undefined');
      
      try {
        // Get stored auth data
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('AuthContext: Stored user:', storedUser ? 'EXISTS' : 'NOT_FOUND');
        console.log('AuthContext: Stored token:', storedToken ? 'EXISTS' : 'NOT_FOUND');
        
        if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
          console.log('AuthContext: Raw stored user data:', storedUser.substring(0, 100) + '...');
        }
        if (storedToken && storedToken !== 'undefined' && storedToken !== 'null') {
          console.log('AuthContext: Raw stored token:', storedToken.substring(0, 50) + '...');
        }
        
        // Validate stored data before parsing
        const isValidUser = storedUser && storedUser !== 'undefined' && storedUser !== 'null' && storedUser.trim() !== '';
        const isValidToken = storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.trim() !== '';
        
        if (isValidUser && isValidToken) {
          console.log('AuthContext: Found valid stored auth data, parsing...');
          try {
            const userData = JSON.parse(storedUser);
            if (userData && userData.id) {
              setUser(userData);
              setToken(storedToken);
              console.log('AuthContext: ✅ Authentication restored from localStorage');
              console.log('AuthContext: User ID:', userData.id);
              console.log('AuthContext: User email:', userData.email);
            } else {
              console.log('AuthContext: ❌ Invalid user data structure, clearing localStorage');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (parseError) {
            console.error('AuthContext: Error parsing stored user data:', parseError);
            console.log('AuthContext: Clearing corrupted localStorage data');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        } else {
          console.log('AuthContext: ❌ No valid stored auth data found');
          // Clean up any invalid data
          if (storedUser === 'undefined' || storedUser === 'null') {
            localStorage.removeItem('user');
          }
          if (storedToken === 'undefined' || storedToken === 'null') {
            localStorage.removeItem('token');
          }
        }
        
      } catch (error) {
        console.error('AuthContext: Error parsing stored auth data:', error);
      }
      
      setLoading(false);
      console.log('AuthContext: Auth initialization complete, loading set to false');
    };
    
    // Run initialization
    initializeAuth();
    
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Login attempt for email:', email);
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('AuthContext: Login response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('AuthContext: Login failed:', errorData);
        throw new Error(errorData.message || errorData.error || 'Login failed');
      }

      const data = await response.json();
      console.log('AuthContext: Login successful, raw response:', data);
      
      // The API returns data in data.data.user and data.data.token format
      const userData = data.data?.user;
      const tokenData = data.data?.token;
      
      if (!userData || !tokenData) {
        console.error('AuthContext: Invalid response structure:', data);
        throw new Error('Invalid response from server');
      }
      
      console.log('AuthContext: Parsed user data:', userData);
      console.log('AuthContext: Token present:', !!tokenData);
      
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenData);
      
      // Update context state
      setUser(userData);
      setToken(tokenData);
      setLoading(false);
      
      console.log('AuthContext: ✅ Login completed successfully');
      console.log('AuthContext: User ID:', userData.id);
      console.log('AuthContext: User email:', userData.email);
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('AuthContext: Registration attempt for email:', userData.email);
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('AuthContext: Registration response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('AuthContext: Registration failed:', errorData);
        throw new Error(errorData.message || errorData.error || 'Registration failed');
      }

      const data = await response.json();
      console.log('AuthContext: Registration successful, raw response:', data);
      
      // The API returns data in data.data format like login
      const userData = data.data?.user;
      const tokenData = data.data?.token;
      
      if (!userData || !tokenData) {
        console.error('AuthContext: Invalid registration response structure:', data);
        throw new Error('Invalid response from server');
      }
      
      console.log('AuthContext: Parsed user data:', userData);
      console.log('AuthContext: Token present:', !!tokenData);
      
      // Store user data and token in localStorage (auto-login after registration)
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', tokenData);
      
      // Update context state
      setUser(userData);
      setToken(tokenData);
      setLoading(false);
      
      console.log('AuthContext: ✅ Registration completed successfully with auto-login');
      console.log('AuthContext: User ID:', userData.id);
      console.log('AuthContext: User email:', userData.email);
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Clear context state
    setUser(null);
    setToken(null);
    
    console.log('AuthContext: ✅ Logout completed successfully');
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  // Debug current auth state
  console.log('AuthContext: Current auth state:', {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated: !!user && !!token,
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
