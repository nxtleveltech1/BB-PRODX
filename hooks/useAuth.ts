"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = false) {
  const { data: session, status, signOut } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  const user = session?.user || null;

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  const logout = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect manually if signOut fails
      router.push("/");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    status,
    logout,
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
