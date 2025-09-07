import "server-only";
import { StackServerApp } from '@stackframe/stack';

// Check if we're in build mode and provide dummy values to prevent build failures
const isDevelopment = process.env.NODE_ENV === 'development';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// Use valid dummy values that Stack Auth will accept
const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID || (isBuild ? 'st_tcuTCuGSEeaE' : 'demo-project-id');
const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || (isBuild ? 'st_tcuTCuGSEeaE_pk' : 'demo-client-key');
const secretKey = process.env.STACK_SECRET_SERVER_KEY || (isBuild ? 'st_tcuTCuGSEeaE_sk' : 'demo-secret-key');

<<<<<<< HEAD
=======
<<<<<<< HEAD
// Only export when not in build phase or when properly configured
export const stackServerApp = (() => {
  try {
    // During build phase with missing env vars, create minimal instance
    if (isBuild && !process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
      console.log('Stack Auth: Using build-time mock configuration');
      
      // Create mock app that won't cause validation errors during build
      return {
        url: '/handler',
        projectId: 'build-mock',
        // Minimal methods needed for build compatibility
        validateToken: () => Promise.resolve(null),
        signOut: () => Promise.resolve(),
      } as any; // Type assertion for build compatibility
    }
    
    return new StackServerApp({
      tokenStore: 'nextjs-cookie',
      projectId,
      publishableClientKey: publishableKey,
      secretServerKey: secretKey,
    });
  } catch (error) {
    console.warn('Stack Auth initialization failed:', error);
    // Return mock object to prevent build failures
    return {
      url: '/handler',
      projectId: 'error-fallback',
      validateToken: () => Promise.resolve(null),
      signOut: () => Promise.resolve(),
    } as any;
  }
})();
=======
>>>>>>> c34476cf686291491a59031b44f49f23f54798d5
export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
  projectId,
  publishableClientKey: publishableKey,
  secretServerKey: secretKey,
});
<<<<<<< HEAD
=======
>>>>>>> 06f0c00a73fa103b6b6c16ce35967089350133ce
>>>>>>> c34476cf686291491a59031b44f49f23f54798d5
