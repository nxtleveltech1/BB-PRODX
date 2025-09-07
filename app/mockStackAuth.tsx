'use client';

import { ReactNode, createContext, useContext } from 'react';

// Mock Stack Auth context for build-time compatibility
const MockStackContext = createContext<{
  user: null;
  stackApp: {
    signOut: () => Promise<void>;
  };
}>({
  user: null,
  stackApp: {
    signOut: async () => {
      console.warn('Stack Auth not configured');
    },
  },
});

// Mock provider
export function MockStackProvider({ children }: { children: ReactNode }) {
  const value = {
    user: null,
    stackApp: {
      signOut: async () => {
        console.warn('Stack Auth not configured - sign out not available');
      },
    },
  };

  return (
    <MockStackContext.Provider value={value}>
      {children}
    </MockStackContext.Provider>
  );
}

// Mock hooks
export function useUser() {
  const context = useContext(MockStackContext);
  return context.user;
}

export function useStackApp() {
  const context = useContext(MockStackContext);
  return context.stackApp;
}

// Mock SignIn component
export function SignIn() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Authentication Not Configured</h2>
      <p className="text-gray-600">Stack Auth environment variables need to be configured for sign-in functionality.</p>
    </div>
  );
}