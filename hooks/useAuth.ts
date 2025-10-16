"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  const user = session?.user || null;

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    status,
  };
}

// Backward compatibility exports
export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}

export function useRequireAuth() {
  return useAuth(true);
}