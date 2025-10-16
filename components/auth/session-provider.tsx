"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

/**
 * Client-side session provider wrapper for NextAuth
 * Provides session context to all child components
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      // Enable refetch on window focus for fresh session data
      refetchOnWindowFocus={true}
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
    >
      {children}
    </NextAuthSessionProvider>
  );
}