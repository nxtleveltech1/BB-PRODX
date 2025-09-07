"use client";

import { ReactNode, useEffect, useState } from "react";
import { getStackApp } from "@/lib/stack";

/**
 * Compatibility shim for legacy imports at src/providers/stack-provider-client.
 *
 * Goal: ensure any import of this path uses the single, canonical StackClientApp
 * instance and does not attempt to construct a new one with a different config.
 */
export default function StackProviderClient({ children }: { children: ReactNode }) {
  const disabled = process.env.NEXT_PUBLIC_DISABLE_STACK === 'true';
  const hasStackEnv = Boolean(process.env.NEXT_PUBLIC_STACK_PROJECT_ID && process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) && !disabled;
  const [StackProvider, setStackProvider] = useState<null | React.ComponentType<any>>(null);

  useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined" && hasStackEnv) {
      import("@stackframe/stack")
        .then((mod) => {
          if (mounted) setStackProvider(() => (mod as any).StackProvider as React.ComponentType<any>);
        })
        .catch((err) => {
          console.warn("Stack Auth provider not available:", err);
        });
    }
    return () => {
      mounted = false;
    };
  }, [hasStackEnv]);

  if (hasStackEnv && StackProvider) {
    const Provider = StackProvider as any;
    return <Provider app={getStackApp()}>{children}</Provider>;
  }

  // If Stack configured but provider not ready yet, don't render children to avoid SDK hook usage race
  if (hasStackEnv && !StackProvider) {
    return null;
  }

  // If not configured, just render children
  return <>{children}</>;
}

/**
 * Legacy helper expected by some call sites: return the canonical app from any client JSON.
 * This avoids reconstructing a new app with potentially different configuration.
 */
export function fromClientJson(_json: unknown) {
  return getStackApp();
}
