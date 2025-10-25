import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  email?: string;
  mobile?: string;
  role: 'admin' | 'driver';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refetch: () => void;
  checkAuth: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true since we check auth on mount
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: queryLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Fetch on mount to check auth status on reload
    enabled: true, // Enable to check auth on app load
    refetchInterval: false,
  });

  const isAuthenticated = !!user && !!userData && !error;

  useEffect(() => {
    if (queryLoading) {
      setIsLoading(true);
    } else if (userData) {
      setUser(userData);
      setIsLoading(false);
    } else if (error) {
      setUser(null);
      setIsLoading(false);
    }
  }, [userData, error, queryLoading]);


  const checkAuth = async () => {
    try {
      setIsLoading(true);
      await refetch();
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all state immediately
      setUser(null);
      setIsLoading(false);
      
      // Clear React Query cache completely
      queryClient.clear();
      queryClient.removeQueries();
      
      // Invalidate the auth query to force a fresh check
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      // Determine the correct login page based on current route
      const currentPath = window.location.pathname;
      const isAdminRoute = currentPath.startsWith('/admin');
      const loginPath = isAdminRoute ? '/admin/login' : '/driver/login';
      
      // Navigate to the appropriate login page
      navigate(loginPath, { replace: true });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refetch,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};