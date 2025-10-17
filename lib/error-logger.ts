import * as Sentry from "@sentry/nextjs"
import { headers } from "next/headers"

interface ErrorContext {
  userId?: string
  requestId?: string
  endpoint?: string
  severity?: "fatal" | "error" | "warning" | "info"
  tags?: Record<string, string>
  extra?: Record<string, any>
}

export const logError = (error: Error | unknown, context: ErrorContext = {}) => {
  const {
    userId,
    requestId,
    endpoint,
    severity = "error",
    tags = {},
    extra = {},
  } = context

  // Convert unknown errors to Error objects
  const errorObject = error instanceof Error
    ? error
    : new Error(String(error))

  Sentry.captureException(errorObject, {
    level: severity,
    tags: {
      endpoint,
      ...tags,
    },
    extra: {
      userId,
      requestId,
      timestamp: new Date().toISOString(),
      ...extra,
    },
  })

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", {
      message: errorObject.message,
      stack: errorObject.stack,
      context,
    })
  }
}

export const logMessage = (
  message: string,
  context: ErrorContext = {}
) => {
  const { severity = "info", tags = {}, extra = {} } = context

  Sentry.captureMessage(message, {
    level: severity,
    tags,
    extra: {
      userId: context.userId,
      requestId: context.requestId,
      timestamp: new Date().toISOString(),
      ...extra,
    },
  })

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Message logged:", {
      message,
      context,
    })
  }
}

export const getRequestId = async (): Promise<string> => {
  try {
    const headersList = await headers()
    return headersList.get("x-request-id") || `req-${Date.now()}`
  } catch {
    return `req-${Date.now()}`
  }
}

// Performance tracking utilities (using Sentry v8+ API)
export const measurePerformance = async <T,>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  return await Sentry.startSpan(
    {
      name,
      op: "function",
    },
    async () => {
      try {
        const result = await operation()
        return result
      } catch (error) {
        logError(error, {
          endpoint: name,
          severity: "error",
        })
        throw error
      }
    }
  )
}

// User context helper
export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  })
}

export const clearUserContext = () => {
  Sentry.setUser(null)
}

// Breadcrumb helpers
export const addBreadcrumb = (
  message: string,
  category: string,
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  })
}

// Feature flag tracking
export const trackFeatureFlag = (flagName: string, value: boolean) => {
  Sentry.setTag(`feature.${flagName}`, value)
}

// API response error helper
export const createApiError = (
  statusCode: number,
  message: string,
  endpoint: string
): Error => {
  const error = new Error(message)
  error.name = "ApiError"

  logError(error, {
    endpoint,
    severity: statusCode >= 500 ? "error" : "warning",
    tags: {
      statusCode: String(statusCode),
    },
  })

  return error
}