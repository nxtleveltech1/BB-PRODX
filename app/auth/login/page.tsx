'use client';

// Prevent SSG and ensure runtime-only behavior
export const dynamic = 'force-dynamic';

import { SignIn } from '@/lib/StackAuthComponents';
import Link from "next/link";
import { Leaf } from "lucide-react";
import AuthGuard from '../../components/AuthGuard';

function LoginContent() {
  // Detect missing Stack Auth env configuration on the client
  const missingStackEnv =
    !process.env.NEXT_PUBLIC_STACK_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      {/* Header */}
      <header className="bg-[#F9E7C9]/80 backdrop-blur-sm border-b border-[#ba7500]/20">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ba7500] to-[#C4C240] rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#ba7500]">
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
              <div className="w-16 h-16 bg-gradient-to-br from-[#ba7500] to-[#C4C240] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#ba7500] mb-2">
                Welcome Back
              </h1>
              <p className="text-[#7A7771]">
                Sign in to your Better Being account
              </p>
            </div>

            {/* Stack Auth Login Component */}
            <div className="bg-white/50 backdrop-blur-sm border border-[#ba7500]/20 rounded-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-[#ba7500] mb-2">
                  Sign In
                </h2>
                <p className="text-[#7A7771] text-sm">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Stack Auth SignIn Component */}
              {missingStackEnv && (
                <div className="mb-6 rounded-lg border border-orange-300 bg-orange-50 p-4 text-orange-800">
                  <h3 className="text-lg font-semibold mb-1">Authentication Configuration Required</h3>
                  <p className="text-sm mb-3">
                    Stack Auth environment variables need to be configured for sign-in functionality.
                  </p>
                  <p className="text-sm font-medium">Required Environment Variables:</p>
                  <ul className="list-disc list-inside text-sm mb-3">
                    <li>NEXT_PUBLIC_STACK_PROJECT_ID</li>
                    <li>NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY</li>
                  </ul>
                  <p className="text-xs text-orange-700">
                    For development, you can continue using the application with limited functionality. Authentication features will be restored once the environment is properly configured.
                  </p>
                </div>
              )}
              <div className="stack-auth-container">
                <SignIn />
              </div>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-[#7A7771] hover:text-[#ba7500] hover:underline"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginContent />
    </AuthGuard>
  );
}
