"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Plus,
  Minus,
  ShoppingCart,
  MessageCircle,
  QrCode,
  Star,
  Heart,
  Search,
  Wallet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Coffee,
  Navigation,
} from "lucide-react"
import UPIPaymentModal from "@/components/upi-payment-modal"
import WhatsAppBookingModal from "@/components/whatsapp-booking-modal"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  customization?: string
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  isVegetarian: boolean
  isPopular: boolean
  ingredients: string[]
  allergens: string[]
}

interface OrderProgress {
  step: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  barcode?: string
  estimatedTime?: number
  orderNumber?: string
}

interface BookingData {
  customerName: string
  customerPhone: string
  customerEmail: string
  bookingType: "table" | "event" | "meeting"
  date: string
  time: string
  duration: string
  partySize: string
  specialRequests: string
  occasion?: string
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Signature Espresso",
    description: "Rich and bold single shot with notes of chocolate and caramel",
    price: 3.5,
    image: "/espresso-coffee-cup.png",
    category: "Coffee",
    rating: 4.8,
    isVegetarian: true,
    isPopular: true,
    ingredients: ["Arabica beans", "Water"],
    allergens: ["Caffeine"],
  },
  {
    id: 2,
    name: "Classic Cappuccino",
    description: "Perfect balance of espresso, steamed milk, and velvety foam",
    price: 4.5,
    image: "/placeholder-h3iwf.png",
    category: "Coffee",
    rating: 4.7,
    isVegetarian: true,
    isPopular: true,
    ingredients: ["Espresso", "Steamed milk", "Milk foam"],
    allergens: ["Dairy", "Caffeine"],
  },
  {
    id: 3,
    name: "Vanilla Latte",
    description: "Smooth espresso with steamed milk and vanilla syrup",
    price: 5.0,
    image: "/placeholder-l1f75.png",
    category: "Coffee",
    rating: 4.6,
    isVegetarian: true,
    isPopular: false,
    ingredients: ["Espresso", "Steamed milk", "Vanilla syrup"],
    allergens: ["Dairy", "Caffeine"],
  },
  {
    id: 4,
    name: "Americano",
    description: "Bold espresso with hot water for a clean, strong taste",
    price: 3.75,
    image: "/placeholder-5c60b.png",
    category: "Coffee",
    rating: 4.5,
    isVegetarian: true,
    isPopular: false,
    ingredients: ["Espresso", "Hot water"],
    allergens: ["Caffeine"],
  },
  {
    id: 5,
    name: "Butter Croissant",
    description: "Buttery, flaky pastry baked fresh daily",
    price: 3.25,
    image: "/fresh-croissant.png",
    category: "Pastries",
    rating: 4.4,
    isVegetarian: true,
    isPopular: true,
    ingredients: ["Flour", "Butter", "Eggs", "Yeast"],
    allergens: ["Gluten", "Dairy", "Eggs"],
  },
  {
    id: 6,
    name: "Blueberry Muffin",
    description: "Fresh baked muffin bursting with real blueberries",
    price: 4.0,
    image: "/blueberry-muffin.png",
    category: "Pastries",
    rating: 4.3,
    isVegetarian: true,
    isPopular: false,
    ingredients: ["Flour", "Blueberries", "Sugar", "Eggs", "Butter"],
    allergens: ["Gluten", "Dairy", "Eggs"],
  },
  {
    id: 7,
    name: "Avocado Toast",
    description: "Smashed avocado on sourdough with cherry tomatoes",
    price: 6.5,
    image: "/avocado-toast.png",
    category: "Food",
    rating: 4.6,
    isVegetarian: true,
    isPopular: true,
    ingredients: ["Sourdough bread", "Avocado", "Cherry tomatoes", "Lime", "Salt"],
    allergens: ["Gluten"],
  },
  {
    id: 8,
    name: "Chicken Sandwich",
    description: "Grilled chicken breast with lettuce and mayo on ciabatta",
    price: 8.0,
    image: "/classic-chicken-sandwich.png",
    category: "Food",
    rating: 4.5,
    isVegetarian: false,
    isPopular: false,
    ingredients: ["Chicken breast", "Ciabatta bread", "Lettuce", "Mayo", "Tomato"],
    allergens: ["Gluten", "Eggs"],
  },
  {
    id: 9,
    name: "Iced Matcha Latte",
    description: "Premium matcha powder with cold milk and ice",
    price: 5.5,
    image: "/iced-matcha-latte.png",
    category: "Cold Drinks",
    rating: 4.4,
    isVegetarian: true,
    isPopular: true,
    ingredients: ["Matcha powder", "Cold milk", "Ice", "Sweetener"],
    allergens: ["Dairy"],
  },
  {
    id: 10,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice, no added sugar",
    price: 4.5,
    image: "/fresh-orange-juice.png",
    category: "Cold Drinks",
    rating: 4.2,
    isVegetarian: true,
    isPopular: false,
    ingredients: ["Fresh oranges"],
    allergens: [],
  },
]

const customerReviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    comment:
      "The best coffee in Kolkata! The atmosphere is so cozy and the staff is incredibly friendly. My go-to place for morning coffee.",
    date: "2 days ago",
    orderItem: "Cappuccino & Croissant",
  },
  {
    name: "Rahul Das",
    rating: 5,
    comment:
      "Amazing espresso and the avocado toast is to die for! Perfect spot for working remotely. Free WiFi and comfortable seating.",
    date: "1 week ago",
    orderItem: "Espresso & Avocado Toast",
  },
  {
    name: "Anita Roy",
    rating: 4,
    comment:
      "Love the variety of coffee options. The matcha latte is exceptional. Great place to catch up with friends!",
    date: "2 weeks ago",
    orderItem: "Matcha Latte & Blueberry Muffin",
  },
  {
    name: "Suresh Kumar",
    rating: 5,
    comment:
      "Outstanding service and quality. The baristas really know their craft. The location is convenient and parking is available.",
    date: "3 weeks ago",
    orderItem: "Americano & Chicken Sandwich",
  },
  {
    name: "Meera Banerjee",
    rating: 5,
    comment:
      "This place has become my second home! Great coffee, delicious food, and such a warm welcoming environment. Highly recommended!",
    date: "1 month ago",
    orderItem: "Latte & Fresh Orange Juice",
  },
]

export default function CoffeeShopWebsite() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [orderProgress, setOrderProgress] = useState<OrderProgress | null>(null)
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [customization, setCustomization] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [showUPIPayment, setShowUPIPayment] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [currentReview, setCurrentReview] = useState(0)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState([
    {
      name: "Priya Sharma",
      rating: 5,
      comment:
        "The best coffee in Kolkata! The atmosphere is so cozy and the staff is incredibly friendly. My go-to place for morning coffee.",
      date: "2 days ago",
      orderHistory: 3,
    },
    {
      name: "Rahul Das",
      rating: 5,
      comment:
        "Amazing espresso and the avocado toast is to die for! Perfect spot for working remotely. Free WiFi and comfortable seating.",
      date: "1 week ago",
      orderHistory: 5,
    },
    {
      name: "Anita Roy",
      rating: 4,
      comment:
        "Love the variety of coffee options. The matcha latte is exceptional. Great place to catch up with friends!",
      date: "2 weeks ago",
      orderHistory: 2,
    },
    {
      name: "Suresh Kumar",
      rating: 5,
      comment:
        "Outstanding service and quality. The baristas really know their craft. The location is convenient and parking is available.",
      date: "3 weeks ago",
      orderHistory: 7,
    },
    {
      name: "Meera Banerjee",
      rating: 5,
      comment:
        "This place has become my second home! Great coffee, delicious food, and such a warm welcoming environment. Highly recommended!",
      date: "1 month ago",
      orderHistory: 10,
    },
  ])

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
    orderItem: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("coffee-shop-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVegetarian = !showVegetarianOnly || item.isVegetarian
    return matchesCategory && matchesSearch && matchesVegetarian
  })

  const addToCart = (item: MenuItem, customizationNote?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.customization === customizationNote,
      )
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.customization === customizationNote
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }
      return [
        ...prevCart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          customization: customizationNote,
        },
      ]
    })

    if (cart.length === 0) {
      setShowProgressForm(true)
    }
    setSelectedItem(null)
    setCustomization("")
  }

  const removeFromCart = (id: number, customizationNote?: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === id && cartItem.customization === customizationNote,
      )
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === id && cartItem.customization === customizationNote
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
      }
      return prevCart.filter((cartItem) => !(cartItem.id === id && cartItem.customization === customizationNote))
    })
  }

  const toggleFavorite = (itemId: number) => {
    const newFavorites = favorites.includes(itemId) ? favorites.filter((id) => id !== itemId) : [...favorites, itemId]

    setFavorites(newFavorites)
    localStorage.setItem("coffee-shop-favorites", JSON.stringify(newFavorites))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const generateWhatsAppMessage = () => {
    const items = cart
      .map((item) => {
        const customNote = item.customization ? ` (${item.customization})` : ""
        return `${item.name}${customNote} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`
      })
      .join("\n")

    const total = getTotalPrice().toFixed(2)
    const orderDetails = `📋 ORDER TYPE: ${orderType.toUpperCase()}`
    const tableInfo = orderType === "dine-in" ? `🪑 TABLE: ${tableNumber}` : ""
    const addressInfo = orderType === "delivery" ? `🏠 DELIVERY ADDRESS: ${deliveryAddress}` : ""
    const locationInfo =
      "📍 SHOP LOCATION: Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107"

    return `☕ NEW ORDER FROM BREW & BEAN ☕\n\n${orderDetails}\n${tableInfo}\n${addressInfo}\n\n📝 ITEMS:\n${items}\n\n💰 TOTAL: $${total}\n\n👤 CUSTOMER DETAILS:\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\n\n${locationInfo}\n\n🕒 Order Time: ${new Date().toLocaleString()}`
  }

  const confirmOrder = () => {
    const orderNumber = `ORD${Date.now().toString().slice(-6)}`
    const barcode = `BC${Date.now()}${customerPhone.slice(-4)}`
    const estimatedTime = orderType === "delivery" ? 45 : orderType === "takeaway" ? 15 : 20

    setOrderProgress({
      step: 1,
      status: "confirmed",
      barcode: barcode,
      estimatedTime: estimatedTime,
      orderNumber: orderNumber,
    })

    // Show UPI payment modal instead of direct WhatsApp
    setShowUPIPayment(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    setShowUPIPayment(false)

    // Send confirmation via WhatsApp with payment details
    const message = encodeURIComponent(
      `${generateWhatsAppMessage()}\n\n💳 PAYMENT COMPLETED\nTransaction ID: ${transactionId}\nPayment Method: UPI\nStatus: SUCCESS ✅`,
    )
    window.open(`https://wa.me/9348480855?text=${message}`, "_blank")

    // Update order status to preparing
    setTimeout(() => {
      setOrderProgress((prev) => (prev ? { ...prev, status: "preparing", step: 2 } : null))
    }, 2000)
  }

  const handlePaymentFailed = (error: string) => {
    setShowUPIPayment(false)
    alert(`Payment failed: ${error}. Please try again or contact support.`)
  }

  const getProgressPercentage = () => {
    if (!orderProgress) return 0
    const progressMap = {
      pending: 0,
      confirmed: 25,
      preparing: 50,
      ready: 75,
      delivered: 100,
    }
    return progressMap[orderProgress.status]
  }

  const generateBookingWhatsAppMessage = (bookingData: BookingData) => {
    const bookingTypeEmoji = {
      table: "🪑",
      event: "🎉",
      meeting: "💼",
    }

    const bookingTypeName = {
      table: "Table Reservation",
      event: "Private Event",
      meeting: "Business Meeting",
    }

    const formattedDate = new Date(bookingData.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    let message = `${bookingTypeEmoji[bookingData.bookingType]} NEW BOOKING REQUEST - BREW & BEAN ${bookingTypeEmoji[bookingData.bookingType]}\n\n`
    message += `📋 BOOKING TYPE: ${bookingTypeName[bookingData.bookingType]}\n\n`
    message += `👤 CUSTOMER DETAILS:\n`
    message += `Name: ${bookingData.customerName}\n`
    message += `Phone: ${bookingData.customerPhone}\n`
    if (bookingData.customerEmail) {
      message += `Email: ${bookingData.customerEmail}\n`
    }
    message += `\n📅 BOOKING DETAILS:\n`
    message += `Date: ${formattedDate}\n`
    message += `Time: ${bookingData.time}\n`
    message += `Party Size: ${bookingData.partySize} people\n`
    message += `Duration: ${bookingData.duration}\n`

    if (bookingData.occasion) {
      message += `Occasion: ${bookingData.occasion}\n`
    }

    if (bookingData.specialRequests) {
      message += `\n📝 SPECIAL REQUESTS:\n${bookingData.specialRequests}\n`
    }

    message += `\n📍 LOCATION: Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107\n`
    message += `\n🕒 Request Time: ${new Date().toLocaleString()}\n`
    message += `\n✅ Please confirm this booking or suggest alternative times if needed.`

    return message
  }

  const handleBookingSubmit = (bookingData: BookingData) => {
    const message = encodeURIComponent(generateBookingWhatsAppMessage(bookingData))
    window.open(`https://wa.me/9348480855?text=${message}`, "_blank")
  }

  const openWhatsAppBooking = () => {
    setShowBookingModal(true)
  }

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % customerReviews.length)
  }

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + customerReviews.length) % customerReviews.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % customerReviews.length)
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(interval)
  }, [customerReviews.length])

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add new review to the reviews array
    const newReview = {
      ...reviewForm,
      date: "Just now",
      orderHistory: 1,
    }

    setReviews((prev) => [newReview, ...prev])

    // Reset form and close modal
    setReviewForm({
      name: "",
      email: "",
      rating: 5,
      comment: "",
      orderItem: "",
    })
    setShowReviewModal(false)

    // Show success message
    alert("Thank you for your review! It has been added successfully.")
  }

  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  const galleryImages = [
    {
      src: "/cozy-coffee-shop.png",
      alt: "Cozy coffee shop interior",
      title: "Warm & Welcoming Interior",
      description: "Experience our cozy atmosphere with comfortable seating",
    },
    {
      src: "/smiling-barista.png",
      alt: "Professional barista at work",
      title: "Expert Baristas",
      description: "Our skilled team crafts every cup with passion",
    },
    {
      src: "/espresso-coffee-cup.png",
      alt: "Perfect espresso with latte art",
      title: "Artisan Coffee",
      description: "Beautiful latte art and premium coffee beans",
    },
    {
      src: "/fresh-croissant.png",
      alt: "Fresh pastries and baked goods",
      title: "Fresh Pastries",
      description: "Daily baked goods made with finest ingredients",
    },
    {
      src: "/abstract-geometric-shapes.png?height=600&width=800&query=coffee shop exterior with warm evening lighting",
      alt: "Coffee shop exterior",
      title: "Inviting Exterior",
      description: "Find us in the heart of Kolkata's vibrant neighborhood",
    },
    {
      src: "/abstract-geometric-shapes.png?height=600&width=800&query=customers enjoying coffee and conversation in cozy setting",
      alt: "Happy customers",
      title: "Community Hub",
      description: "Where friends gather and memories are made",
    },
  ]

  // Auto-advance gallery carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Brew & Bean</h1>
            <button className="md:hidden p-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#menu" className="text-foreground hover:text-primary transition-colors">
                Menu
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
                Gallery
              </a>
              <a href="#reviews" className="text-foreground hover:text-primary transition-colors">
                Reviews
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openWhatsAppBooking}
                className="hidden sm:flex bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Book Table</span>
                <span className="md:hidden">Book</span>
              </Button>
              {cart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/checkout", "_blank")}
                  className="hidden sm:flex bg-transparent border-orange-200 hover:bg-orange-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">View Cart</span>
                  <span className="md:hidden">Cart</span>
                </Button>
              )}
              <Badge variant="secondary" className="flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>{cart.reduce((total, item) => total + item.quantity, 0)}</span>
              </Badge>
            </div>
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-3">
                <a
                  href="#home"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </a>
                <a
                  href="#menu"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Menu
                </a>
                <a
                  href="#about"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </a>
                <a
                  href="#gallery"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Gallery
                </a>
                <a
                  href="#reviews"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Reviews
                </a>
                <a
                  href="#contact"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Contact
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openWhatsAppBooking()
                    setShowMobileMenu(false)
                  }}
                  className="bg-transparent justify-start"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Table
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/cozy-coffee-shop.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Brewed with Love,
            <br />
            Served with Warmth
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Experience the perfect blend of artisanal coffee and cozy atmosphere
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={openWhatsAppBooking}
            >
              <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Reserve Your Table
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              onClick={() => {
                const message = encodeURIComponent("Hello! I'd like to inquire about your coffee shop services.")
                window.open(`https://wa.me/9348480855?text=${message}`, "_blank")
              }}
            >
              <MessageCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Chat with Us
            </Button>
          </div>
        </div>
      </section>

      <section id="menu" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Our Menu</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">Crafted with passion, served with love</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["All", "Coffee", "Tea", "Pastries", "Sandwiches", "Beverages"].map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs sm:text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-in-up relative"
              >
                {item.isPopular && (
                  <Badge className="absolute top-2 left-2 z-10 bg-orange-500 text-xs">🔥 Popular</Badge>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-3 sm:w-4 h-3 sm:h-4 ${favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>

                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2 truncate">
                        {item.name}
                        {item.isVegetarian && <span className="text-green-500">🌱</span>}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{item.rating}</span>
                      </div>
                      <CardDescription className="mt-2 text-sm text-muted-foreground truncate">
                        {item.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                      <Button
                        onClick={() => setSelectedItem(item)}
                        className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4 py-2"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>

                    {item.allergens.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Allergens:</span> {item.allergens.join(", ")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedItem && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Customize {selectedItem.name}</CardTitle>
                  <CardDescription>Add any special instructions or modifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="e.g., Extra hot, no foam, oat milk instead of regular milk..."
                    value={customization}
                    onChange={(e) => setCustomization(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(null)
                        setCustomization("")
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => addToCart(selectedItem, customization || undefined)}
                      className="flex-1 bg-primary hover:bg-primary/90"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {cart.length > 0 && (
            <div className="max-w-4xl mx-auto space-y-6">
              {orderProgress && (
                <Card className="animate-fade-in-up mb-8">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Order Progress</CardTitle>
                    <CardDescription>Track your order status in real-time</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                      <span className="font-medium text-sm sm:text-base">Order #{orderProgress.orderNumber}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{orderProgress.timestamp}</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span className="font-mono truncate">Barcode: {orderProgress.barcode}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 flex-shrink-0" />
                        <span>Est. {orderProgress.estimatedTime} mins</span>
                      </div>
                      <Badge variant={orderProgress.status === "delivered" ? "default" : "secondary"} className="w-fit">
                        {orderProgress.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showProgressForm && !orderProgress && (
                <Card className="animate-fade-in-up">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Complete Your Booking</CardTitle>
                    <CardDescription>Fill in your details to proceed with the order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Your Name *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                      <Input
                        placeholder="Phone Number *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                      />
                    </div>

                    <Input
                      placeholder="Email Address (optional)"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />

                    <div className="space-y-4">
                      <Select
                        value={orderType}
                        onValueChange={(value: "dine-in" | "takeaway" | "delivery") => setOrderType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dine-in">🪑 Dine In</SelectItem>
                          <SelectItem value="takeaway">🥤 Takeaway</SelectItem>
                          <SelectItem value="delivery">🚚 Home Delivery</SelectItem>
                        </SelectContent>
                      </Select>

                      {orderType === "dine-in" && (
                        <Select value={tableNumber} onValueChange={setTableNumber}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select table number" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => (
                              <SelectItem key={i + 1} value={`${i + 1}`}>
                                Table {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {orderType === "delivery" && (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Full Delivery Address *"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            required
                            rows={3}
                          />
                          <p className="text-sm text-muted-foreground">
                            📍 Our Location: Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West
                            Bengal 700107
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Your Order ({cart.reduce((total, item) => total + item.quantity, 0)} items)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">${item.price.toFixed(2)} each</span>
                          {item.customization && (
                            <div className="text-sm text-muted-foreground italic">Note: {item.customization}</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(item.id, item.customization)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const menuItem = menuItems.find((mi) => mi.id === item.id)!
                              addToCart(menuItem, item.customization)
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <span className="w-20 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">₹{(getTotalPrice() * 83).toFixed(2)}</span>
                  </div>

                  {showProgressForm && !orderProgress && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90"
                          size="lg"
                          onClick={confirmOrder}
                          disabled={
                            !customerName ||
                            !customerPhone ||
                            (orderType === "dine-in" && !tableNumber) ||
                            (orderType === "delivery" && !deliveryAddress)
                          }
                        >
                          <Wallet className="w-5 h-5 mr-2" />
                          Pay with UPI
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            const message = encodeURIComponent(generateWhatsAppMessage())
                            window.open(`https://wa.me/9348480855?text=${message}`, "_blank")
                          }}
                          disabled={
                            !customerName ||
                            !customerPhone ||
                            (orderType === "dine-in" && !tableNumber) ||
                            (orderType === "delivery" && !deliveryAddress)
                          }
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Order via WhatsApp
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Pay securely with UPI or place order via WhatsApp for cash payment
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="animate-fade-in-up order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">Our Story</h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                Founded in 2018, Brew & Bean started as a small neighborhood coffee shop with a big dream: to create a
                warm, welcoming space where community comes together over exceptional coffee.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
                We source our beans directly from sustainable farms around the world, ensuring every cup tells a story
                of quality, ethics, and passion. Our skilled baristas craft each drink with care, creating not just
                beverages, but moments of joy.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                Today, we're proud to be your neighborhood's favorite gathering place, where friends meet, ideas flow,
                and every visit feels like coming home.
              </p>
            </div>
            <div className="animate-fade-in-up order-1 lg:order-2">
              <img src="/smiling-barista.png" alt="Coffee shop story" className="rounded-lg shadow-lg w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-12 sm:py-16 lg:py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Gallery</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">A glimpse into our cozy coffee haven</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
              >
                {galleryImages.map((image, index) => (
                  <div key={index} className="w-full flex-shrink-0 relative">
                    <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                      <img
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2">{image.title}</h3>
                        <p className="text-sm sm:text-base opacity-90">{image.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGalleryIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentGalleryIndex ? "bg-amber-600 scale-125" : "bg-gray-300 hover:bg-amber-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="fixed right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-50">
            <Link href="/booking">
              <div className="bg-amber-600 hover:bg-amber-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Book a Table
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">Real reviews from our valued customers</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4">
                    <Card className="mx-auto max-w-2xl">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div className="flex justify-center mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 sm:w-5 h-4 sm:h-5 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 italic">
                          "{review.comment}"
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                          <div className="text-center sm:text-left">
                            <p className="font-semibold text-sm sm:text-base">{review.name}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{review.date}</p>
                          </div>
                          {review.orderHistory && (
                            <Badge variant="secondary" className="text-xs">
                              {review.orderHistory} orders
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center mt-6 sm:mt-8 gap-4">
              <Button variant="outline" size="sm" onClick={prevReview} className="p-2 bg-transparent">
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentReview(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentReview ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={nextReview} className="p-2 bg-transparent">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Button onClick={() => setShowReviewModal(true)} className="w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </div>
          </div>
        </div>

        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Write a Review</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowReviewModal(false)} className="p-1">
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">What did you order?</label>
                    <input
                      type="text"
                      value={reviewForm.orderItem}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, orderItem: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Cappuccino & Croissant"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review *</label>
                    <textarea
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="Tell us about your experience..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Submit Review
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </section>

      <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">Visit Us</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">We'd love to see you at our coffee shop</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="animate-fade-in-up">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Our Location</CardTitle>
                  <p className="text-sm text-muted-foreground">Click the map to get directions</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className="relative h-64 sm:h-80 bg-gradient-to-br from-amber-100 to-orange-100 cursor-pointer group overflow-hidden"
                    onClick={() => {
                      const address =
                        "Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107"
                      const encodedAddress = encodeURIComponent(address)
                      // Try Google Maps first, fallback to Apple Maps on iOS
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

                      if (isMobile) {
                        if (isIOS) {
                          window.open(`maps://maps.google.com/maps?daddr=${encodedAddress}`, "_blank")
                        } else {
                          window.open(`https://maps.google.com/maps?daddr=${encodedAddress}`, "_blank")
                        }
                      } else {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
                      }
                    }}
                  >
                    {/* Map Preview Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 opacity-30"></div>

                    {/* Street Grid Pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 320">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8B5CF6" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Main Roads */}
                      <path d="M0 160 L400 160" stroke="#6366F1" strokeWidth="3" opacity="0.6" />
                      <path d="M200 0 L200 320" stroke="#6366F1" strokeWidth="3" opacity="0.6" />
                      <path d="M100 80 L300 240" stroke="#8B5CF6" strokeWidth="2" opacity="0.4" />
                    </svg>

                    {/* Coffee Shop Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="relative">
                        {/* Pulsing Circle */}
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75 w-8 h-8"></div>
                        <div className="relative bg-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                          <Coffee className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Location Label */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">Brew & Bean Coffee Shop</p>
                          <p className="text-xs text-gray-600">Chingrighata, Kolkata</p>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow-lg">
                        <Navigation className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 bg-muted/50">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => {
                          const address =
                            "Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107"
                          const encodedAddress = encodeURIComponent(address)
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank")
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        View on Map
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-transparent"
                        onClick={() => {
                          const address =
                            "Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107"
                          const encodedAddress = encodeURIComponent(address)
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, "_blank")
                        }}
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="animate-fade-in-up">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Address</h4>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Basani Devi Colony, Sector IV
                        <br />
                        Nawbhanga, Chingrighata
                        <br />
                        Kolkata, West Bengal 700107
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Opening Hours</h4>
                      <div className="text-sm sm:text-base text-muted-foreground">
                        <p>Monday - Friday: 6:00 AM - 8:00 PM</p>
                        <p>Saturday - Sunday: 7:00 AM - 9:00 PM</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Phone</h4>
                      <p className="text-sm sm:text-base text-muted-foreground">+91 93484 80855</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">Email</h4>
                      <p className="text-sm sm:text-base text-muted-foreground">hello@brewandbean.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 sm:py-12 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Brew & Bean</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Brewed with Love, Served with Warmth
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto" onClick={openWhatsAppBooking}>
              <Calendar className="w-4 h-4 mr-2" />
              Book a Table
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const message = encodeURIComponent("Hello! I'd like to know more about Brew & Bean coffee shop.")
                window.open(`https://wa.me/9348480855?text=${message}`, "_blank")
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Us
            </Button>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border">
            <p className="text-sm sm:text-base text-muted-foreground">&copy; 2025 Brew & Bean. All rights reserved. Created BY AI & Developers</p>
          </div>
        </div>
      </footer>

      {cart.length > 0 && (
        <button
          className="fixed bottom-20 right-4 z-50 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-bounce"
          onClick={() => window.open("/checkout", "_blank")}
          aria-label="View Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </Badge>
        </button>
      )}

      <button
        className="whatsapp-float animate-float"
        onClick={openWhatsAppBooking}
        aria-label="Book a table via WhatsApp"
      >
        <Calendar className="w-6 h-6 text-white" />
      </button>

      <UPIPaymentModal
        isOpen={showUPIPayment}
        onClose={() => setShowUPIPayment(false)}
        amount={getTotalPrice() * 83} // Convert to INR (approximate)
        orderDetails={{
          items: cart,
          customerName,
          customerPhone,
          orderType,
          tableNumber,
          deliveryAddress,
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailed={handlePaymentFailed}
      />

      <WhatsAppBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingSubmit={handleBookingSubmit}
      />
    </div>
  )
}
