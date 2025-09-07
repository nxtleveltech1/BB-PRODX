'use client';

import { ReactNode, useEffect, useState } from 'react';

interface ClientBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientBoundary ensures components only render on the client side
 * Prevents SSR/SSG hydration mismatches for client-only libraries
 */
export default function ClientBoundary({ 
  children, 
  fallback = null 
}: ClientBoundaryProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // During SSR/SSG or before hydration, show fallback
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  // Client-side: render children
  return <>{children}</>;
}