import "server-only";
import { StackServerApp } from '@stackframe/stack';

// Check if we're in build mode and provide dummy values to prevent build failures
const isDevelopment = process.env.NODE_ENV === 'development';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Use valid dummy values that Stack Auth will accept
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID || (isBuild ? 'st_tcuTCuGSEeaE' : 'demo-project-id');
const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || (isBuild ? 'st_tcuTCuGSEeaE_pk' : 'demo-client-key');
const secretKey = process.env.STACK_SECRET_SERVER_KEY || (isBuild ? 'st_tcuTCuGSEeaE_sk' : 'demo-secret-key');

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  projectId,
  publishableClientKey: publishableKey,
  secretServerKey: secretKey,
});