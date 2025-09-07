'use client';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from '@/lib/useAuth';
import authService from '../../../lib/services/auth.service';
import { RegisterUserData } from '../../../lib/types/auth';
import { 
  Eye, 
  EyeOff, 
  Leaf, 
  Loader2,
  Mail,
  Lock,
  User,
  CheckCircle,
  XCircle,
  ArrowRight,
  Shield
} from "lucide-react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const router = useRouter();
  const { user: _user } = useUser();

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "One lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "One number", met: /\d/.test(formData.password) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: RegisterUserData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        marketingConsent: false // Based on form, user already agreed to terms
      };

      const result = await authService.register(registrationData);
      
      if (result.success) {
        // Store tokens if registration was successful
        if (result.data.tokens) {
          authService.storeAuthTokens(result.data.tokens);
        }
        
        // Check if email verification is required
        if (result.data.emailVerificationToken) {
          router.push('/auth/register/verify-email');
        } else {
          router.push('/auth/register/success');
        }
      } else {
        // Handle specific error cases
        if (result.error.code === 'USER_EXISTS') {
          setError('An account already exists with this email address.');
        } else if (result.error.code === 'WEAK_PASSWORD') {
          setError('Password does not meet security requirements.');
        } else if (result.error.code === 'INVALID_EMAIL') {
          setError('Please enter a valid email address.');
        } else {
          setError(result.error.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-neutral-50)] to-[var(--color-neutral-100)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--color-neutral-200)]">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-citron)] rounded-lg flex items-center justify-center shadow-wellness">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-[var(--color-neutral-900)] tracking-brand">
              BETTER BEING
            </span>
          </Link>
        </div>
      </header>

      <div className="pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--bb-mahogany)] to-[var(--bb-citron)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-wellness">
                <User className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                Create Account
              </h1>
              <p className="text-[var(--color-neutral-600)]">
                Join the Better Being community
              </p>
            </div>

            {/* Registration Card */}
            <div className="card">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)] mb-2">
                  Sign Up
                </h2>
                <p className="text-[var(--color-neutral-600)] text-sm">
                  Create your account to start your wellness journey
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input pl-10 w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input pl-10 pr-10 w-full"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-[var(--color-neutral-600)] font-medium">
                      Password must contain:
                    </p>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-[var(--color-neutral-400)]" />
                          )}
                          <span className={`text-xs ${req.met ? 'text-green-600' : 'text-[var(--color-neutral-600)]'}`}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="input pl-10 pr-10 w-full"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-600)]"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-red-600 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
                  {formData.confirmPassword && passwordsMatch && (
                    <p className="text-green-600 text-xs mt-1">
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-[var(--bb-mahogany)] bg-[var(--color-neutral-100)] border-[var(--color-neutral-300)] rounded focus:ring-[var(--bb-mahogany)] focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-[var(--color-neutral-600)]">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !allRequirementsMet || !passwordsMatch || !formData.agreeToTerms}
                  className="btn-primary w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Back to Home */}
              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:underline"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                Why join Better Being?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {[
                  {
                    icon: Leaf,
                    title: "Premium Products",
                    desc: "Curated natural supplements and wellness products"
                  },
                  {
                    icon: CheckCircle,
                    title: "Fast Shipping",
                    desc: "Free delivery on orders over R500"
                  },
                  {
                    icon: Shield,
                    title: "Secure Shopping",
                    desc: "Your data is always protected"
                  }
                ].map(({ icon: Icon, title, desc }, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg border border-[var(--color-neutral-200)]">
                    <Icon className="w-6 h-6 text-[var(--bb-mahogany)] mx-auto mb-2" />
                    <h4 className="font-semibold text-[var(--color-neutral-900)] mb-1">
                      {title}
                    </h4>
                    <p className="text-[var(--color-neutral-600)]">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
