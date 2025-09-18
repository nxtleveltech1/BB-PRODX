// Adapter for legacy imports expecting '@/lib/useAuth'
// This re-exports the App Router-compatible hook from '@/hooks/useAuth'

import { useAuth as useAuthInternal } from '@/hooks/useAuth';

export function useAuth() {
  return useAuthInternal();
}

// Backward-compatible helper used in some pages
export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuthInternal();
  return { user, isLoading, isAuthenticated };
}
