'use client';

import { 
  AuthService as IAuthService, 
  RegisterUserData, 
  LoginUserData, 
  AuthResponse, 
  User, 
  Result, 
  AuthError 
} from '../types/auth';

class AuthServiceImpl implements IAuthService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    // Use environment variable or fallback to relative API path
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async apiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<Result<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: { ...this.defaultHeaders, ...options.headers },
        credentials: 'include', // Include cookies for auth
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: AuthError = {
          code: data.code || 'UNKNOWN_ERROR',
          message: data.message || 'An error occurred',
          details: data.details || {}
        };
        return { success: false, error };
      }

      if (!data.success) {
        const error: AuthError = {
          code: data.code || 'API_ERROR',
          message: data.message || 'Request failed',
          details: data.details || {}
        };
        return { success: false, error };
      }

      return { success: true, data: data };
    } catch (err) {
      const error: AuthError = {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
        details: { originalError: err }
      };
      return { success: false, error };
    }
  }

  async register(data: RegisterUserData): Promise<Result<AuthResponse>> {
    const result = await this.apiRequest<{ 
      user: User; 
      tokens: any; 
      emailVerificationToken?: string;
      message: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) {
      return result;
    }

    const authResponse: AuthResponse = {
      user: result.data.user,
      tokens: result.data.tokens,
      emailVerificationToken: result.data.emailVerificationToken
    };

    return { success: true, data: authResponse };
  }

  async login(data: LoginUserData): Promise<Result<AuthResponse>> {
    const result = await this.apiRequest<{ 
      user: User; 
      tokens: any; 
      requiresEmailVerification?: boolean;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!result.success) {
      return result;
    }

    const authResponse: AuthResponse = {
      user: result.data.user,
      tokens: result.data.tokens,
      requiresEmailVerification: result.data.requiresEmailVerification
    };

    return { success: true, data: authResponse };
  }

  async logout(): Promise<Result<{ message: string }>> {
    // First, get refresh token from storage or cookie
    const refreshToken = this.getStoredRefreshToken();
    
    const result = await this.apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (result.success) {
      // Clear stored tokens
      this.clearStoredTokens();
    }

    return result;
  }

  async refreshToken(refreshToken: string): Promise<Result<AuthResponse>> {
    const result = await this.apiRequest<{ 
      user: User; 
      tokens: any; 
      message: string;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    if (!result.success) {
      return result;
    }

    const authResponse: AuthResponse = {
      user: result.data.user,
      tokens: result.data.tokens
    };

    return { success: true, data: authResponse };
  }

  async verifyEmail(token: string): Promise<Result<{ user: User }>> {
    return this.apiRequest<{ user: User }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string): Promise<Result<{ message: string }>> {
    return this.apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<Result<{ user: User }>> {
    return this.apiRequest<{ user: User }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getCurrentUser(): Promise<Result<User>> {
    const result = await this.apiRequest<{ user: User }>('/auth/me', {
      method: 'GET',
    });

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.user };
  }

  // Token storage methods (client-side storage for refresh tokens)
  private getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setStoredRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('refresh_token', token);
  }

  private clearStoredTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('refresh_token');
    // Access token is handled by HTTP-only cookies, so we don't store it
  }

  // Helper methods for managing auth state
  storeAuthTokens(tokens: { accessToken: string; refreshToken: string }): void {
    // Access token is handled by HTTP-only cookies
    // Only store refresh token for client-side refresh operations
    this.setStoredRefreshToken(tokens.refreshToken);
  }

  getStoredTokens(): { refreshToken: string | null } {
    return {
      refreshToken: this.getStoredRefreshToken()
    };
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl();
export default authService;