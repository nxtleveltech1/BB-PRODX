'use client';

import { useEffect, useState, useCallback } from 'react';
import authService from '../../lib/services/auth.service';
import { User, Result, LoginUserData, RegisterUserData } from '../../lib/types/auth';

// Lazy-loaded Stack Auth hooks
let useStackUser: any = null;
let useStackStackApp: any = null;

// Initialize hooks only on client-side
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const mod = await import('@stackframe/stack');
      useStackUser = (mod as unknown as { useUser?: any }).useUser;
      useStackStackApp = (mod as unknown as { useStackApp?: any }).useStackApp;
    } catch (error) {
      console.warn('Stack Auth not available:', error);
    }
  })();
}

// Enhanced auth hook with Stack Auth compatibility and backend integration
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const result = await authService.getCurrentUser();
      if (result.success) {
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Try Stack Auth first if available
    if (useStackUser) {
      try {
        // This would call the actual Stack Auth hook in production
        console.log('Stack Auth detected but not fully configured');
        // For now, fall back to backend auth
        fetchUser();
      } catch (error) {
        console.warn('Stack Auth hook failed, falling back to backend auth:', error);
        fetchUser();
      }
    } else {
      // Use backend auth service
      fetchUser();
    }
  }, [fetchUser]);

  return {
    user,
    isLoading,
    refetchUser: fetchUser
  };
}

// Enhanced auth hook with full authentication methods
export function useAuth() {
  const { user, isLoading, refetchUser } = useUser();
  const [localUser, setLocalUser] = useState<User | null>(user);

  const login = useCallback(async (data: LoginUserData): Promise<Result<{ user: User }>> => {
    const result = await authService.login(data);
    if (result.success) {
      // Store tokens
      authService.storeAuthTokens(result.data.tokens);
      // Refresh user data
      await refetchUser();
      return { success: true, data: { user: result.data.user } };
    }
    return result;
  }, [refetchUser]);

  const register = useCallback(async (data: RegisterUserData): Promise<Result<{ user: User; emailVerificationRequired?: boolean }>> => {
    const result = await authService.register(data);
    if (result.success) {
      // Store tokens if provided
      if (result.data.tokens) {
        authService.storeAuthTokens(result.data.tokens);
      }
      // Refresh user data
      await refetchUser();
      return { 
        success: true, 
        data: { 
          user: result.data.user, 
          emailVerificationRequired: !!result.data.emailVerificationToken 
        } 
      };
    }
    return result;
  }, [refetchUser]);

  const logout = useCallback(async (): Promise<Result<{ message: string }>> => {
    const result = await authService.logout();
    // Always clear local state, even if logout request fails
    setLocalUser(null);
    // Refresh user data to sync with global state
    await refetchUser();
    return result;
  }, [refetchUser]);

  const verifyEmail = useCallback(async (token: string): Promise<Result<{ user: User }>> => {
    const result = await authService.verifyEmail(token);
    if (result.success) {
      await refetchUser();
    }
    return result;
  }, [refetchUser]);

  // Sync local user with global user state
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  return {
    user: localUser || user,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    refetchUser
  };
}

// Build-safe Stack App hook
export function useStackApp() {
  const [stackApp, setStackApp] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && useStackStackApp) {
      try {
        // This would call the actual useStackStackApp hook
        // For now, return a mock implementation
        setStackApp({
          signOut: async () => {
            console.warn('Stack Auth not fully configured - sign out not available');
          },
        });
      } catch (error) {
        console.warn('Stack Auth app hook failed:', error);
        setStackApp({
          signOut: async () => {
            console.warn('Stack Auth not configured - sign out not available');
          },
        });
      }
    } else {
      setStackApp({
        signOut: async () => {
          console.warn('Stack Auth not configured - sign out not available');
        },
      });
    }
  }, []);

  return stackApp;
}