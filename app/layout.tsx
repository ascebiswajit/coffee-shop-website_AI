import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import Analytics from "@/components/analytics"
import PWAInstall from "@/components/pwa-install"

export const metadata: Metadata = {
  title: "Brew & Bean - Coffee Shop & Cafe",
  description:
    "Experience the perfect blend of artisanal coffee and cozy atmosphere at Brew & Bean. Order online, book tables, and enjoy premium coffee in Kolkata.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["coffee shop", "cafe", "Kolkata", "coffee", "booking", "food delivery", "UPI payment"],
  authors: [{ name: "Brew & Bean" }],
  creator: "Brew & Bean Coffee Shop",
  publisher: "Brew & Bean",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://brewandbean.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Brew & Bean - Coffee Shop & Cafe",
    description:
      "Experience the perfect blend of artisanal coffee and cozy atmosphere. Order online, book tables, and enjoy premium coffee.",
    url: "https://brewandbean.vercel.app",
    siteName: "Brew & Bean",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brew & Bean Coffee Shop",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brew & Bean - Coffee Shop & Cafe",
    description: "Experience the perfect blend of artisanal coffee and cozy atmosphere.",
    images: ["/og-image.png"],
    creator: "@brewandbean",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#8B4513" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brew & Bean",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#8B4513" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Brew & Bean" />
        <meta name="msapplication-TileColor" content="#8B4513" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <PWAInstall />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
