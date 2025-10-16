import { auth } from "@/services/auth/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

// Server-side auth utilities for Next.js App Router

/**
 * Get the current session
 */
export async function getSession(): Promise<Session | null> {
  return await auth();
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication - redirects to sign in if not authenticated
 * Use in server components that require auth
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return session.user;
}

/**
 * Require a specific role - redirects if user doesn't have the role
 */
export async function requireRole(role: string) {
  const user = await requireAuth();

  if (user.role !== role) {
    redirect("/");
  }

  return user;
}

/**
 * Require admin role - redirects if user is not an admin
 */
export async function requireAdmin() {
  return requireRole("admin");
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === role;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
}

/**
 * Get user ID from session
 */
export async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}