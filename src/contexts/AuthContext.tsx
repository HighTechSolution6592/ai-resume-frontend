import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { useStore } from '../store';
import { User } from '../types';
import { toast } from 'sonner';
import { sessionManager } from '../utils/sessionManager';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<{
    success: boolean;
    needsEmailVerification: boolean;
    email: string;
  }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, user, setIsLoading: setStoreLoading } = useStore();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      setIsLoading(true);
      setStoreLoading(true);
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        // Always check with backend
        const response = await authAPI.getCurrentUser();
        if (response.success) {
          const updatedUserData = {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=6366f1&color=fff`,
            isEmailVerified: response.user.isEmailVerified,
          };
          setUser(updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
        setStoreLoading(false);
      }
    };
    checkAuth();
  }, [setUser, setStoreLoading]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.success) {
        // After login, always check with backend for user info
        const me = await authAPI.getCurrentUser();
        if (me.success) {
          const userData = {
            id: me.user.id,
            email: me.user.email,
            name: me.user.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(me.user.name)}&background=6366f1&color=fff`,
            isEmailVerified: me.user.isEmailVerified,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        toast.success('Login successful!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.success) {
        // After signup, always check with backend for user info
        const me = await authAPI.getCurrentUser();
        if (me.success) {
          const userData = {
            id: me.user.id,
            email: me.user.email,
            name: me.user.name,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(me.user.name)}&background=6366f1&color=fff`,
            isEmailVerified: me.user.isEmailVerified,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        toast.success('Account created successfully!');
        return { 
          success: true, 
          needsEmailVerification: !response.user.isEmailVerified,
          email: response.user.email 
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      // Try to extract server-side validation errors for registration
      if (error.response?.data?.errors) {
        // Compose a readable message for toast (optional)
        const errorList = error.response.data.errors
          .map((err: { field: string; message: string }) => `${err.field}: ${err.message}`)
          .join("\n");
        toast.error(errorList);
        // Also throw the error object so SignupPage can set field errors
        throw error;
      } else {
        const message = error.response?.data?.message || error.message || 'Registration failed';
        toast.error(message);
        throw new Error(message);
      }
    }
  };

  const logout = async () => {
    try {
      setStoreLoading(true);
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
      toast.error('Logout completed');
    } finally {
      setStoreLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.success) {
        toast.success('Password reset instructions sent to your email');
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset email';
      toast.error(message);
      throw new Error(message);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      return await sessionManager.refreshAccessToken();
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  const value = {
    isLoading,
    isAuthenticated: !!user,
    user,
    login,
    signup,
    logout,
    resetPassword,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};