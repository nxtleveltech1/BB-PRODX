'use client';

// Add dynamic export to prevent SSG
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { CheckCircle, Leaf, Mail, ArrowRight } from "lucide-react";

export default function RegisterSuccess() {
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

      <div className="pt-16 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-[var(--color-neutral-900)] mb-4">
              Welcome to Better Being!
            </h1>
            
            <p className="text-[var(--color-neutral-600)] mb-6">
              Your account has been created successfully. You can now start exploring our premium wellness products and services.
            </p>

            {/* Email Verification Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Mail className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-900">Check Your Email</h3>
              </div>
              <p className="text-sm text-blue-700">
                We've sent you a verification email. Please click the link in your email to verify your account for full access to all features.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/products"
                className="btn-primary w-full h-11 inline-flex items-center justify-center"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              
              <Link
                href="/auth/login"
                className="btn-secondary w-full h-11 inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-[var(--color-neutral-500)]">
                Didn't receive the verification email?{' '}
                <button className="text-[var(--bb-mahogany)] hover:text-[var(--bb-citron)] hover:underline font-medium">
                  Resend verification
                </button>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)] hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}