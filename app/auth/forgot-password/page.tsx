'use client';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Mail, 
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Leaf
} from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Mock password reset request
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
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

        <div className="pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-heading font-bold text-[var(--color-neutral-900)] mb-4">
                Check Your Email
              </h1>
              <p className="text-lg text-[var(--color-neutral-600)] mb-8 leading-relaxed">
                We've sent password reset instructions to:
                <br />
                <strong className="text-[var(--bb-mahogany)]">{email}</strong>
              </p>

              {/* Instructions */}
              <div className="bg-white rounded-xl p-6 mb-8 border border-[var(--color-neutral-200)]">
                <div className="space-y-3 text-left text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>Check your inbox for the reset link</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-orange-600">⏱</div>
                    <span>Link expires in 1 hour</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-red-600">⚠</div>
                    <span>Check spam folder if not received</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] text-sm font-medium transition-colors">
                  Resend email
                </button>
                
                <div className="pt-4 border-t border-[var(--color-neutral-200)]">
                  <Link
                    href="/auth/login"
                    className="btn-secondary w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-2">
                Forgot Password?
              </h1>
              <p className="text-[var(--color-neutral-600)]">
                Enter your email to reset your password
              </p>
            </div>

            {/* Reset Card */}
            <div className="card">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--color-neutral-900)] mb-2">
                  Reset Password
                </h2>
                <p className="text-[var(--color-neutral-600)] text-sm">
                  We'll send you instructions to reset your password
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-neutral-400)]" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10 w-full"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending instructions...
                    </>
                  ) : (
                    <>
                      Send Reset Instructions
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] font-medium hover:underline flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
                <p className="text-sm text-[var(--color-neutral-600)] text-center">
                  Still having trouble?{' '}
                  <Link href="/support" className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] font-medium hover:underline">
                    Contact support
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">🔒</div>
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">
                    Security Notice
                  </h4>
                  <p className="text-blue-700 text-xs">
                    For your security, password reset links are only valid for 1 hour and can only be used once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}