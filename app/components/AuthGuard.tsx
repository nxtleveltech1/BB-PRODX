'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/useAuth';
import ClientBoundary from './ClientBoundary';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

function AuthGuardContent({ 
  children, 
  redirectTo = '/auth/login', 
  requireAuth = true,
  fallback 
}: AuthGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only perform auth checks on client-side
    if (typeof window === 'undefined') return;

    if (requireAuth && user === null) {
      router.push(redirectTo);
    } else if (!requireAuth && user) {
      // Redirect logged-in users away from auth pages
      router.push('/account');
    }
  }, [user, router, redirectTo, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen bg-[var(--bb-champagne)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bb-mahogany)] mx-auto mb-4"></div>
          <p className="text-[var(--color-neutral-600)]">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not logged in, show loading (redirect will happen)
  if (requireAuth && user === null) {
    return fallback || (
      <div className="min-h-screen bg-[var(--bb-champagne)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bb-mahogany)] mx-auto mb-4"></div>
          <p className="text-[var(--color-neutral-600)]">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If logged-in user tries to access auth pages, show loading (redirect will happen)
  if (!requireAuth && user) {
    return fallback || (
      <div className="min-h-screen bg-[var(--bb-champagne)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bb-mahogany)] mx-auto mb-4"></div>
          <p className="text-[var(--color-neutral-600)]">Redirecting to account...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthGuard(props: AuthGuardProps) {
  return (
    <ClientBoundary fallback={props.fallback || props.children}>
      <AuthGuardContent {...props} />
    </ClientBoundary>
  );
}
