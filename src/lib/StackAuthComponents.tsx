'use client';

import { useEffect, useState } from 'react';
import ClientBoundary from '../../app/components/ClientBoundary';

// Lazy load Stack Auth SignIn component
function SignInContent() {
  const [StackSignIn, setStackSignIn] = useState<null | React.ComponentType>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Only load on client-side with proper configuration
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
      process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    ) {
      (async () => {
        try {
          const mod = await import('@stackframe/stack');
          setStackSignIn(() => (mod as any).SignIn as React.ComponentType);
          setIsConfigured(true);
        } catch (error) {
          console.warn('Stack Auth SignIn component not available:', error);
          setIsConfigured(false);
        }
      })();
    }
  }, []);

  // If properly configured and component loaded, render Stack Auth SignIn
  if (StackSignIn && isConfigured) {
    return <StackSignIn />;
  }

  // Fallback: Configuration instructions
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4 text-[var(--bb-mahogany)]">
        Authentication Configuration Required
      </h2>
      <p className="text-[var(--color-neutral-600)] mb-6">
        Stack Auth environment variables need to be configured for sign-in functionality.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
        <h3 className="font-medium text-yellow-800 mb-2">Required Environment Variables:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li><code>NEXT_PUBLIC_STACK_PROJECT_ID</code></li>
          <li><code>NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY</code></li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          For development, you can continue using the application with limited functionality.
          Authentication features will be restored once the environment is properly configured.
        </p>
      </div>
    </div>
  );
}

// Build-safe SignIn component with client boundary
export function SignIn() {
  return (
    <ClientBoundary 
      fallback={
        <div className="p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      }
    >
      <SignInContent />
    </ClientBoundary>
  );
}