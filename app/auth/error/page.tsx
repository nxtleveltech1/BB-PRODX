"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    OAuthSignin: "Error occurred while signing in with the OAuth provider.",
    OAuthCallback: "Error occurred while handling the OAuth callback.",
    OAuthCreateAccount: "Could not create account with OAuth provider.",
    EmailCreateAccount: "Could not create account with this email.",
    Callback: "Error occurred during the authentication callback.",
    OAuthAccountNotLinked: "This email is already associated with another account.",
    EmailSignin: "The email could not be sent.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    Default: "An unexpected error occurred during authentication.",
  };

  const message = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="container flex min-h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-gray-500">{message}</p>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-4 rounded-md bg-gray-100 p-4 text-left">
            <p className="text-xs text-gray-600">
              <strong>Error Code:</strong> {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}