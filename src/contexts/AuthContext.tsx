import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { User as ApiUser, RegisterData } from '@/types';

interface AuthContextType {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated by calling profile endpoint (cookie-based)
        const response = await api.request<ApiUser>('/auth/profile');
        if (response.success && response.data) {
          const data: any = response.data;
          setUser((data && (data.user ?? data)) as ApiUser);
        } else {
          // Clear any legacy tokens if verification fails
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        // Clear any legacy tokens
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.login({ email, password });
      
      if (response.success && response.data) {
        const { user: userData } = response.data;
        // Server now sets secure HTTP-only cookie automatically
        // No need to manually store token in localStorage
        setUser(userData);
        
        // Clear any legacy localStorage tokens
        localStorage.removeItem('auth_token');
        
        toast.success('Welcome back!');
        return true;
      } else {
        toast.error(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser } = response.data;
        // Server now sets secure HTTP-only cookie automatically
        // No need to manually store token in localStorage
        setUser(newUser);
        
        // Clear any legacy localStorage tokens
        localStorage.removeItem('auth_token');
        
        toast.success('Account created successfully!');
        return true;
      } else {
        toast.error(response.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call secure logout endpoint to clear HTTP-only cookie
      await api.logout();

      // Clear any legacy localStorage tokens
      localStorage.removeItem('auth_token');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server call fails
      localStorage.removeItem('auth_token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.request<{ user: ApiUser }>('/auth/me');
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
