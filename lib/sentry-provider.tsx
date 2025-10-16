"use client"

import React, { Suspense } from "react"
import * as Sentry from "@sentry/nextjs"

const SentryErrorBoundary = Sentry.withProfiler(Sentry.ErrorBoundary)

interface SentryProviderProps {
  children: React.ReactNode
}

export function SentryProvider({ children }: SentryProviderProps) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We've been notified and are working to fix it.
            </p>
            {process.env.NODE_ENV === "development" && error && (
              <details className="text-left text-sm text-gray-500 mb-4">
                <summary className="cursor-pointer font-medium">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {error.message || "Unknown error"}
                </pre>
              </details>
            )}
            <button
              onClick={resetError}
              className="px-4 py-2 bg-honey-400 text-white rounded-md hover:bg-honey-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      showDialog={false}
    >
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="animate-pulse text-honey-500">Loading...</div>
          </div>
        }
      >
        {children}
      </Suspense>
    </SentryErrorBoundary>
  )
}