export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  profileImageUrl?: string;
  marketingConsent: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Result pattern for type-safe error handling
export type Result<T, E = AuthError> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface RegisterUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  marketingConsent?: boolean;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  requiresEmailVerification?: boolean;
  emailVerificationToken?: string;
}

// Stack Auth compatibility types
export interface StackAuthUser {
  id: string;
  primaryEmail?: string;
  displayName?: string;
  profileImageUrl?: string;
  clientMetadata?: Record<string, any>;
  serverMetadata?: Record<string, any>;
}

// Frontend auth service interface
export interface AuthService {
  register(data: RegisterUserData): Promise<Result<AuthResponse>>;
  login(data: LoginUserData): Promise<Result<AuthResponse>>;
  logout(): Promise<Result<{ message: string }>>;
  refreshToken(refreshToken: string): Promise<Result<AuthResponse>>;
  verifyEmail(token: string): Promise<Result<{ user: User }>>;
  forgotPassword(email: string): Promise<Result<{ message: string }>>;
  resetPassword(token: string, password: string): Promise<Result<{ user: User }>>;
  getCurrentUser(): Promise<Result<User>>;
}

// Password validation result
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

// Device info for session tracking
export interface DeviceInfo {
  userAgent: string;
  ip: string;
}