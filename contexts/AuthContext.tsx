import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = async (token: string) => {
    try {
      await SecureStore.setItemAsync('accessToken', token);
      setIsAuthenticated(true);
      // Navigate to main tabs and reset the navigation stack
      router.replace('/(tabs)');
    } catch (error) {
      console.log('Error saving token:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      setIsAuthenticated(false);
      // Navigate to login screen and reset the navigation stack
      router.replace('/login');
    } catch (error) {
      console.log('Error removing token:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}