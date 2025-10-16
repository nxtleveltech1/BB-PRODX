import * as Sentry from "@sentry/nextjs"
import { clientEnv } from "@/lib/env-client"

if (clientEnv.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: clientEnv.NEXT_PUBLIC_SENTRY_DSN,
    environment: clientEnv.NODE_ENV,
    tracesSampleRate: clientEnv.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        // Mask sensitive content
        maskAllText: false,
        maskAllInputs: true,
        blockAllMedia: false,
        // Sampling options
        networkDetailAllowUrls: [window.location.origin],
        networkCaptureBodies: false,
        networkRequestHeaders: [],
        networkResponseHeaders: [],
      }),
    ],
    beforeSend(event) {
      // Filter out sensitive data from breadcrumbs
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
          // Filter out password fields from form submissions
          if (breadcrumb.category === "ui.input" && breadcrumb.message?.includes("password")) {
            return null
          }
          // Filter out sensitive API calls
          if (breadcrumb.category === "fetch" || breadcrumb.category === "xhr") {
            const url = breadcrumb.data?.url
            if (url && (url.includes("/auth/") || url.includes("/payment/"))) {
              breadcrumb.data = { ...breadcrumb.data, url: "[FILTERED]" }
            }
          }
          return breadcrumb
        }).filter(Boolean) as typeof event.breadcrumbs
      }
      return event
    },
  })
}