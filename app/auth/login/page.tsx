import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function LoginPage() {
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

            {/* NextAuth Login Component */}
            <div className="bg-white/50 backdrop-blur-sm border border-[#ba7500]/20 rounded-lg p-8">
              <SignInForm />

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