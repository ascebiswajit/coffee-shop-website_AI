"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Google Analytics configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Initialize Google Analytics
export function initGA() {
  if (typeof window === "undefined") return

  // Load Google Analytics script
  const script1 = document.createElement("script")
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  const script2 = document.createElement("script")
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_title: document.title,
      page_location: window.location.href,
    });
  `
  document.head.appendChild(script2)
}

// Track page views
export function trackPageView(url: string) {
  if (typeof window === "undefined" || !window.gtag) return

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window === "undefined" || !window.gtag) return

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Coffee shop specific tracking functions
export const analytics = {
  // Menu interactions
  trackMenuView: (category: string) => {
    trackEvent("view_menu_category", "menu", category)
  },

  trackItemView: (itemName: string, category: string) => {
    trackEvent("view_item", "menu", `${category}:${itemName}`)
  },

  trackAddToCart: (itemName: string, price: number, quantity: number) => {
    trackEvent("add_to_cart", "ecommerce", itemName, price * quantity)
  },

  trackRemoveFromCart: (itemName: string, price: number, quantity: number) => {
    trackEvent("remove_from_cart", "ecommerce", itemName, price * quantity)
  },

  // Order tracking
  trackOrderStart: (orderType: string) => {
    trackEvent("begin_checkout", "ecommerce", orderType)
  },

  trackOrderComplete: (orderId: string, total: number, paymentMethod: string) => {
    trackEvent("purchase", "ecommerce", `${paymentMethod}:${orderId}`, total)
  },

  trackPaymentMethod: (method: string, amount: number) => {
    trackEvent("select_payment_method", "ecommerce", method, amount)
  },

  // Booking tracking
  trackBookingStart: (bookingType: string) => {
    trackEvent("booking_start", "booking", bookingType)
  },

  trackBookingComplete: (bookingType: string, partySize: number) => {
    trackEvent("booking_complete", "booking", bookingType, partySize)
  },

  // WhatsApp interactions
  trackWhatsAppClick: (action: string, context: string) => {
    trackEvent("whatsapp_click", "communication", `${action}:${context}`)
  },

  // Search and filters
  trackSearch: (query: string, resultsCount: number) => {
    trackEvent("search", "menu", query, resultsCount)
  },

  trackFilter: (filterType: string, filterValue: string) => {
    trackEvent("filter_apply", "menu", `${filterType}:${filterValue}`)
  },

  // User engagement
  trackTimeOnPage: (pageName: string, timeInSeconds: number) => {
    trackEvent("time_on_page", "engagement", pageName, timeInSeconds)
  },

  trackScrollDepth: (percentage: number) => {
    trackEvent("scroll_depth", "engagement", "page_scroll", percentage)
  },

  // PWA events
  trackPWAInstall: () => {
    trackEvent("pwa_install", "pwa", "app_installed")
  },

  trackPWALaunch: (source: string) => {
    trackEvent("pwa_launch", "pwa", source)
  },

  trackOfflineUsage: (feature: string) => {
    trackEvent("offline_usage", "pwa", feature)
  },
}

// Analytics provider component
export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize GA on mount
    initGA()
  }, [])

  useEffect(() => {
    // Track page views on route change
    const url = pathname + searchParams.toString()
    trackPageView(url)
  }, [pathname, searchParams])

  useEffect(() => {
    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent
        analytics.trackScrollDepth(scrollPercent)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Track time on page
    const startTime = Date.now()

    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      if (timeOnPage > 10) {
        // Only track if user spent more than 10 seconds
        analytics.trackTimeOnPage(pathname, timeOnPage)
      }
    }
  }, [pathname])

  return null
}
