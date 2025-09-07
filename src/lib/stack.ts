import { StackClientApp } from '@stackframe/stack';

// Read public env at build time (Next.js inlines these in client bundles)
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID;
const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY;

declare global {
  // eslint-disable-next-line no-var
  var __STACK_CLIENT_APPS__: Record<string, StackClientApp> | undefined;
}

const createStackApp = (id: string, key: string) =>
  new StackClientApp({
    tokenStore: 'nextjs-cookie',
    projectId: id,
    publishableClientKey: key,
    urls: {
      signIn: '/auth/login',
      afterSignIn: '/account',
      afterSignUp: '/account',
      signUp: '/auth/register',
    },
  });

export function getStackApp(): StackClientApp {
  if (!projectId || !publishableKey) {
    throw new Error('Stack Auth env vars are missing. Define NEXT_PUBLIC_STACK_PROJECT_ID and NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY.');
  }
  const store = (globalThis.__STACK_CLIENT_APPS__ ||= {});
  // Reuse existing instance for this projectId to avoid SDK assertion on re-init
  if (store[projectId]) return store[projectId]!;
  const app = createStackApp(projectId, publishableKey);
  store[projectId] = app;
  return app;
}

// Backwards-compatible export for modules that import a value
export const stackApp: StackClientApp | undefined =
  projectId && publishableKey ? getStackApp() : undefined;
