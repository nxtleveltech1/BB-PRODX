'use client';

/**
 * DEPRECATED: Do not use StackAuthProvider directly.
 * Use app/StackAuthWrapper instead, which ensures a single StackClientApp instance
 * and provides a mock provider when Stack env variables are not configured.
 *
 * Reason: Using multiple StackProvider instances or different app configurations
 * can cause "StackAssertionError: The provided app JSON does not match the configuration
 * of the existing client app with the same unique identifier".
 */

import { ReactNode, useEffect, useState } from 'react';
import ClientBoundary from './components/ClientBoundary';
import { getStackApp } from '@/lib/stack';

interface StackAuthProviderProps {
  children: ReactNode;
}

function StackAuthContent({ children }: StackAuthProviderProps) {
  const [StackProvider, setStackProvider] = useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    let mounted = true;
    const disabled = process.env.NEXT_PUBLIC_DISABLE_STACK === 'true';
    if (typeof window !== 'undefined' && !disabled && process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
      import('@stackframe/stack')
        .then(mod => {
          if (mounted) setStackProvider(() => (mod as any).StackProvider as React.ComponentType<any>);
        })
        .catch(error => {
          console.warn('Stack Auth not available:', error);
        });
    }
    return () => { mounted = false; };
  }, []);

  if (process.env.NEXT_PUBLIC_DISABLE_STACK !== 'true' && process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY && StackProvider) {
    const Provider = StackProvider as any;
    return (
      <Provider app={getStackApp()}>
        {children}
      </Provider>
    );
  }

  return <>{children}</>;
}

export default function StackAuthProvider({ children }: StackAuthProviderProps) {
  // Development-time guard to prevent accidental usage that can cause duplicate Stack providers
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('[Deprecated] app/StackAuthProvider is deprecated. Use app/StackAuthWrapper instead. Rendering this component in development is blocked to prevent duplicate Stack Auth initialization.');
    }
  }, []);

  return (
    <ClientBoundary fallback={<>{children}</>}>
      <StackAuthContent>{children}</StackAuthContent>
    </ClientBoundary>
  );
}
