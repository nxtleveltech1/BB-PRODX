// Root Layout for Next.js App Router
import './globals.css'
import TopBar from 'components/layout/TopBar'
import Footer from 'components/layout/Footer'
import Providers from './providers'
import { Toaster } from 'sonner'
import StackAuthWrapper from './StackAuthWrapper'
import MobileTabBar from 'components/mobile/MobileTabBar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#BB4500" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#BB4500" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/headerlogo.png" />
        <link rel="icon" sizes="192x192" href="/headerlogo.png" />
        <link rel="icon" sizes="512x512" href="/headerlogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        {/* Leaflet CSS for the store locator map */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body>
        <StackAuthWrapper>
          <Providers>
            <TopBar />
            <main className="pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0">{children}</main>
            <Footer />
            {/* Mobile bottom navigation */}
            <div className="md:hidden">
              {/* Render only on small screens; component handles fixed positioning and safe area */}
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore - path uses root components alias */}
              <MobileTabBar />
            </div>
            <Toaster richColors position="top-right" />
          </Providers>
        </StackAuthWrapper>
      </body>
    </html>
  )
}
