import * as Sentry from "@sentry/nextjs"
import { env } from "@/lib/env"

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: false,
    maxBreadcrumbs: 50,
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request?.url?.includes("password")) {
        return null
      }
      // Remove any auth tokens or sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization
        delete event.request.headers.cookie
      }
      // Remove sensitive data from request body
      if (event.request?.data) {
        const data = event.request.data as any
        if (data.password) delete data.password
        if (data.confirmPassword) delete data.confirmPassword
        if (data.currentPassword) delete data.currentPassword
        if (data.newPassword) delete data.newPassword
      }
      return event
    },
    integrations: [
      // Capture database queries (without sensitive data)
      Sentry.prismaIntegration(),
    ],
  })
}