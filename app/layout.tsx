// Root Layout for Next.js App Router
import './globals.css'
import Providers from './providers'
import { SessionProvider } from '@/components/auth/session-provider'
import { SentryProvider } from '@/lib/sentry-provider'
import { ClientLayoutWrapper } from './client-layout-wrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#BB4500" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#BB4500" />
        {/* For PWA compatibility across platforms */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/headerlogo.png" />
        <link rel="icon" sizes="192x192" href="/headerlogo.png" />
        <link rel="icon" sizes="512x512" href="/headerlogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Leaflet CSS for the store locator map */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body>
        <SentryProvider>
          <SessionProvider>
            <Providers>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </Providers>
          </SessionProvider>
        </SentryProvider>
      </body>
    </html>
  )
}
