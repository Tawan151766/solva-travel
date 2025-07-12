"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect } from 'react';

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export function AuthProvider({ children }) {
  console.log('🚀 AuthProvider: Component initialized - new session starting');
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  console.log('🚀 AuthProvider: State initialized, loading:', loading);

  // Simple client-side check
  useEffect(() => {
    console.log('AuthContext: === MAIN useEffect TRIGGERED ===');
    
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');
        console.log('AuthContext: typeof window:', typeof window);
        
        if (typeof window === 'undefined') {
          console.log('AuthContext: Server-side detected, setting loading to false');
          setLoading(false);
          return;
        }
        
        console.log('AuthContext: Client-side detected, checking localStorage...');
        
        // Get stored auth data
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        console.log('AuthContext: Stored user:', storedUser ? 'EXISTS' : 'NOT_FOUND');
        console.log('AuthContext: Stored token:', storedToken ? 'EXISTS' : 'NOT_FOUND');
        
        if (storedUser && storedToken) {
          console.log('AuthContext: Found stored auth data, parsing...');
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          console.log('AuthContext: ✅ Authentication restored from localStorage');
          console.log('AuthContext: User ID:', userData.id);
          console.log('AuthContext: User email:', userData.email);
        } else {
          console.log('AuthContext: ❌ No stored auth data found');
        }
        
        setLoading(false);
        console.log('AuthContext: Auth initialization complete');
        
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        setLoading(false);
      }
    };
    
    // Run immediately
    initializeAuth();
    
  }, []);

  // Additional useEffect to ensure client-side initialization  
  useEffect(() => {
    console.log('AuthContext: === SECOND useEffect TRIGGERED ===');
    console.log('AuthContext: typeof window:', typeof window);
    
    if (typeof window !== 'undefined') {
      console.log('AuthContext: Client-side mounted, scheduling second check...');
      const timer = setTimeout(() => {
        console.log('AuthContext: Second check timer fired, calling checkAuthStatus');
        checkAuthStatus();
      }, 500);
      return () => {
        console.log('AuthContext: Cleanup second useEffect timer');
        clearTimeout(timer);
      };
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('AuthContext: ===== checkAuthStatus CALLED =====');
      console.log('AuthContext: typeof window:', typeof window);
      
      // Check if we're in client-side environment
      if (typeof window === 'undefined') {
        console.log('AuthContext: Running on server-side, skipping localStorage check');
        setLoading(false);
        return;
      }
      
      console.log('AuthContext: Client-side detected, checking localStorage...');
      
      // Check if user data exists in localStorage - use consistent key names
      const userData = localStorage.getItem('user');
      const authToken = localStorage.getItem('token'); // Changed from 'authToken' to 'token' for consistency
      
      console.log('AuthContext: localStorage contents:');
      console.log('AuthContext: - user data:', userData ? 'EXISTS' : 'NOT_FOUND');
      console.log('AuthContext: - token:', authToken ? 'EXISTS' : 'NOT_FOUND');
      console.log('AuthContext: - token length:', authToken ? authToken.length : 0);
      
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: AUTHENTICATION SUCCESS - Setting user:', parsedUser);
        setUser(parsedUser);
        setToken(authToken);
      } else {
        console.log('AuthContext: NO VALID AUTH DATA - user will remain null');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('AuthContext: ERROR in checkAuthStatus:', error);
      setUser(null);
      setToken(null);
    } finally {
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('AuthContext: Starting login for:', email);
      
      // Call your login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      console.log('AuthContext: Login response:', { status: response.status, result });

      if (response.ok && result.success) {
        console.log('AuthContext: Login successful, storing data...');
        
        // Store user data and token (only on client-side)
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.data.user));
          localStorage.setItem('token', result.data.token); // Changed from 'authToken' to 'token'
          console.log('AuthContext: Data stored in localStorage with keys: user, token');
        }
        
        console.log('AuthContext: Data stored, updating state...');
        setUser(result.data.user);
        setToken(result.data.token);
        
        console.log('AuthContext: Login complete, user state:', result.data.user);
        return { success: true, user: result.data.user };
      } else {
        console.log('AuthContext: Login failed:', result.message);
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext: Logging out...');
      
      // Clear local storage (only on client-side)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Changed from 'authToken' to 'token'
        console.log('AuthContext: Cleared localStorage keys: user, token');
      }
      
      // Clear user state
      setUser(null);
      setToken(null);
      
      console.log('AuthContext: Logout complete');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'An error occurred during logout' };
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update user data in state and localStorage
        const updatedUser = { ...user, ...result.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'An error occurred while updating profile' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile,
    checkAuthStatus,
  };

  // Debug logging
  console.log('AuthContext: Current auth state:', {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated: !!user,
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
