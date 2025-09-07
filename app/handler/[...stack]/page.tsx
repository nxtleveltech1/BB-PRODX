<<<<<<< HEAD
=======
<<<<<<< HEAD
import { StackHandler } from "@stackframe/stack";

// Build-safe Stack Auth handler
export default function Handler(props: unknown) {
  // During build phase or when Stack Auth is not configured, return mock UI
  if (process.env.NODE_ENV !== 'development' && !process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-honey-100 to-cream-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-chocolate-800 mb-4">Authentication Service</h1>
          <p className="text-chocolate-600 mb-6">
            Authentication is currently being configured. Please check back soon.
          </p>
          <div className="text-sm text-chocolate-500">
            Stack Auth configuration required
          </div>
=======
>>>>>>> c34476cf686291491a59031b44f49f23f54798d5
// Ensure this route is handled dynamically at runtime to avoid SSG pre-render
export const dynamic = "force-dynamic";

export default async function Handler({ params, searchParams }: { params: { stack?: string[] }, searchParams?: Record<string, string> }) {
  // If Stack Auth env vars are not configured, avoid importing the library at build time
  if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Authentication Not Configured</h1>
          <p className="text-muted-foreground max-w-md">
            Please set NEXT_PUBLIC_STACK_PROJECT_ID and related keys in your Vercel Environment Variables to enable Stack Auth routes.
          </p>
<<<<<<< HEAD
=======
>>>>>>> 06f0c00a73fa103b6b6c16ce35967089350133ce
>>>>>>> c34476cf686291491a59031b44f49f23f54798d5
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const { StackHandler } = await import("@stackframe/stack");
  const { stackServerApp } = await import("../../../stack");
  return <StackHandler app={stackServerApp} params={params} searchParams={searchParams} />;
=======
<<<<<<< HEAD
  // Only import and use Stack Auth when environment is properly configured
  try {
    const { stackServerApp } = require("../../../stack");
    return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
  } catch (error) {
    console.warn('Stack Auth configuration error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-honey-100 to-cream-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-chocolate-800 mb-4">Authentication Unavailable</h1>
          <p className="text-chocolate-600 mb-6">
            Authentication service is temporarily unavailable.
          </p>
          <div className="text-sm text-chocolate-500">
            Please contact support if this persists
          </div>
        </div>
      </div>
    );
  }
=======
  const { StackHandler } = await import("@stackframe/stack");
  const { stackServerApp } = await import("../../../stack");
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
>>>>>>> 06f0c00a73fa103b6b6c16ce35967089350133ce
>>>>>>> c34476cf686291491a59031b44f49f23f54798d5
}
