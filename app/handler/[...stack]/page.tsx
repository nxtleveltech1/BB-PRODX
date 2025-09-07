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
        </div>
      </div>
    );
  }

  const { StackHandler } = await import("@stackframe/stack");
  const { stackServerApp } = await import("../../../stack");
  return <StackHandler app={stackServerApp} params={params} searchParams={searchParams} />;
}