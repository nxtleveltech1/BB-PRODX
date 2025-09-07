'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MockStackProvider } from './mockStackAuth';
import { getStackApp } from '@/lib/stack';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function StackAuthWrapper({ children }: { children: ReactNode }) {
  const disabled = process.env.NEXT_PUBLIC_DISABLE_STACK === 'true';
  const hasStackEnv = Boolean(process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) && !disabled;
  const [StackProvider, setStackProvider] = useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    let mounted = true;
    if (typeof window !== 'undefined' && hasStackEnv) {
      import('@stackframe/stack')
        .then(mod => {
          if (mounted) setStackProvider(() => (mod as any).StackProvider as React.ComponentType<any>);
        })
        .catch(err => {
          console.warn('Stack Auth provider not available:', err);
        });
    }
    return () => { mounted = false; };
  }, [hasStackEnv]);

  if (hasStackEnv && StackProvider) {
    const Provider = StackProvider as any;
    return (
      <ErrorBoundary fallback={<MockStackProvider>{children}</MockStackProvider>} level="component">
        <Provider app={getStackApp()}>
          {children}
        </Provider>
      </ErrorBoundary>
    );
  }

  // If Stack is configured but provider not yet loaded, avoid rendering children that may use SDK hooks
  if (hasStackEnv && !StackProvider) {
    // Render with mock provider while the real provider loads to avoid blank page
    return <MockStackProvider>{children}</MockStackProvider>;
  }

  return (
    <MockStackProvider>
      {children}
    </MockStackProvider>
  );
}
