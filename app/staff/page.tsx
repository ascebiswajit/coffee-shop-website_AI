"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle,
  MessageCircle,
  QrCode,
  User,
  MapPin,
  Phone,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Order {
  id: string
  customerName: string
  phone: string
  items: Array<{
    name: string
    quantity: number
    customizations?: string[]
  }>
  total: number
  status: "pending" | "preparing" | "ready" | "completed"
  paymentStatus: "paid" | "pending"
  orderType: "pickup" | "delivery"
  tableNumber?: string
  address?: string
  timestamp: Date
  estimatedTime?: number
}

interface Booking {
  id: string
  customerName: string
  phone: string
  date: string
  time: string
  partySize: number
  bookingType: "table" | "event" | "meeting"
  specialRequests?: string
  status: "confirmed" | "pending" | "completed"
  paymentStatus: "paid" | "pending"
  timestamp: Date
}

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  orderItems?: string[]
}

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("orders")

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "ORD001",
        customerName: "Rahul Sharma",
        phone: "+91 9348480855",
        items: [
          { name: "Cappuccino", quantity: 2, customizations: ["Extra shot", "Oat milk"] },
          { name: "Chocolate Croissant", quantity: 1 },
        ],
        total: 450,
        status: "preparing",
        paymentStatus: "paid",
        orderType: "pickup",
        tableNumber: "T-05",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        estimatedTime: 5,
      },
      {
        id: "ORD002",
        customerName: "Priya Patel",
        phone: "+91 9348480855",
        items: [
          { name: "Latte", quantity: 1 },
          { name: "Avocado Toast", quantity: 1, customizations: ["No tomatoes"] },
        ],
        total: 380,
        status: "pending",
        paymentStatus: "pending",
        orderType: "delivery",
        address: "Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        estimatedTime: 15,
      },
      {
        id: "ORD003",
        customerName: "Amit Kumar",
        phone: "+91 9348480855",
        items: [
          { name: "Espresso", quantity: 3 },
          { name: "Blueberry Muffin", quantity: 2 },
        ],
        total: 520,
        status: "ready",
        paymentStatus: "paid",
        orderType: "pickup",
        tableNumber: "T-12",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
      },
    ]

    const mockBookings: Booking[] = [
      {
        id: "BK001",
        customerName: "Sneha Gupta",
        phone: "+91 9348480855",
        date: "2024-01-15",
        time: "18:30",
        partySize: 4,
        bookingType: "table",
        specialRequests: "Window seat preferred",
        status: "confirmed",
        paymentStatus: "paid",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "BK002",
        customerName: "Corporate Event - TechCorp",
        phone: "+91 9348480855",
        date: "2024-01-16",
        time: "15:00",
        partySize: 20,
        bookingType: "event",
        specialRequests: "Need projector setup and coffee catering",
        status: "pending",
        paymentStatus: "pending",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ]

    const mockReviews: Review[] = [
      {
        id: "REV001",
        customerName: "Anita Sharma",
        rating: 5,
        comment:
          "Amazing coffee and excellent service! The cappuccino was perfect and the staff was very friendly. Will definitely come back!",
        date: "2024-01-14",
        orderItems: ["Cappuccino", "Chocolate Croissant"],
      },
      {
        id: "REV002",
        customerName: "Rajesh Kumar",
        rating: 4,
        comment:
          "Great ambiance and good food. The avocado toast was delicious. Only wish the wifi was a bit faster for work meetings.",
        date: "2024-01-13",
        orderItems: ["Latte", "Avocado Toast"],
      },
      {
        id: "REV003",
        customerName: "Meera Patel",
        rating: 5,
        comment:
          "Best coffee shop in the area! Love the cozy atmosphere and the baristas really know their craft. The matcha latte is my favorite!",
        date: "2024-01-12",
        orderItems: ["Matcha Latte", "Blueberry Muffin"],
      },
      {
        id: "REV004",
        customerName: "Vikram Singh",
        rating: 4,
        comment:
          "Excellent place for business meetings. Good coffee, comfortable seating, and not too noisy. The team booking service was very smooth.",
        date: "2024-01-11",
        orderItems: ["Espresso", "Sandwich"],
      },
    ]

    setOrders(mockOrders)
    setBookings(mockBookings)
    setReviews(mockReviews)
  }, [])

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const updateBookingStatus = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)))
  }

  const sendWhatsAppMessage = (phone: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const generateOrderReadyMessage = (order: Order) => {
    return `🎉 Great news! Your order #${order.id} is ready for ${order.orderType}!

📋 Order Details:
${order.items.map((item) => `• ${item.quantity}x ${item.name}${item.customizations ? ` (${item.customizations.join(", ")})` : ""}`).join("\n")}

${order.orderType === "pickup" ? `📍 Please collect from Table ${order.tableNumber}` : "🚚 Our delivery partner will reach you shortly"}

💰 Total: ₹${order.total}

Thank you for choosing Brew & Bean! ☕`
  }

  const generateBookingConfirmMessage = (booking: Booking) => {
    return `✅ Your booking #${booking.id} has been confirmed!

📅 Date: ${booking.date}
🕐 Time: ${booking.time}
👥 Party Size: ${booking.partySize}
📋 Type: ${booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}

${booking.specialRequests ? `📝 Special Requests: ${booking.specialRequests}` : ""}

We look forward to serving you at Brew & Bean! ☕`
  }

  const generatePaymentQR = (amount: number, orderId: string) => {
    const upiUrl = `upi://pay?pa=brewandbean@paytm&pn=Brew%20%26%20Bean&am=${amount}&cu=INR&tn=Order%20${orderId}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Staff Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage orders and bookings efficiently</p>
        </div>

        <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-base sm:text-lg">
              <MapPin className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
              Brew & Bean Coffee Shop
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <p className="text-amber-700 font-medium text-sm sm:text-base">📍 Current Location:</p>
              <p className="text-amber-600 text-sm sm:text-base leading-relaxed">
                Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-amber-600 mt-3">
                <span className="flex items-center gap-1">📞 +91 9348480855</span>
                <span className="flex items-center gap-1">🕒 Open: 7:00 AM - 10:00 PM</span>
                <span className="flex items-center gap-1">🚗 Free Parking Available</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-green-800 text-base sm:text-lg">
                <Star className="h-4 sm:h-5 w-4 sm:w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                Customer Reviews
              </CardTitle>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevReview}
                  className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent p-2"
                >
                  <ChevronLeft className="h-3 sm:h-4 w-3 sm:w-4" />
                </Button>
                <span className="text-xs sm:text-sm text-green-600 px-2">
                  {currentReviewIndex + 1} / {reviews.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextReview}
                  className="border-green-300 text-green-700 hover:bg-green-100 bg-transparent p-2"
                >
                  <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {reviews.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-semibold text-green-800 text-sm sm:text-base">
                    {reviews[currentReviewIndex].customerName}
                  </span>
                  <div className="flex items-center gap-1">{renderStars(reviews[currentReviewIndex].rating)}</div>
                  <span className="text-xs sm:text-sm text-green-600">({reviews[currentReviewIndex].rating}/5)</span>
                </div>
                <p className="text-green-700 italic text-sm sm:text-base leading-relaxed">
                  "{reviews[currentReviewIndex].comment}"
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-green-600">
                  <span>📅 {reviews[currentReviewIndex].date}</span>
                  {reviews[currentReviewIndex].orderItems && (
                    <span className="break-words">🛍️ Ordered: {reviews[currentReviewIndex].orderItems?.join(", ")}</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="orders" className="text-xs sm:text-sm py-2 sm:py-3">
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs sm:text-sm py-2 sm:py-3">
              Bookings ({bookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <div className="grid gap-3 sm:gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="w-full">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <User className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
                            <span className="truncate">{order.customerName}</span>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-xs w-fit`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                          <span className="break-all">{order.phone}</span>
                        </p>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="text-lg sm:text-xl font-bold">₹{order.total}</p>
                        <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-xs w-fit`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">Order Items:</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="text-xs sm:text-sm">
                              <span className="font-medium">
                                {item.quantity}x {item.name}
                              </span>
                              {item.customizations && (
                                <span className="text-muted-foreground ml-2 break-words">
                                  ({item.customizations.join(", ")})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                          {order.timestamp.toLocaleTimeString()}
                        </span>
                        {order.orderType === "pickup" && order.tableNumber && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                            Table {order.tableNumber}
                          </span>
                        )}
                        {order.orderType === "delivery" && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                            Delivery
                          </span>
                        )}
                        {order.estimatedTime && (
                          <span className="text-orange-600 font-medium">ETA: {order.estimatedTime} mins</span>
                        )}
                      </div>

                      {order.address && (
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">Delivery Address:</span>
                          <p className="text-muted-foreground break-words leading-relaxed">{order.address}</p>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {order.status === "pending" && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, "preparing")}
                            className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                          >
                            Start Preparing
                          </Button>
                        )}

                        {order.status === "preparing" && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                          >
                            Mark Ready
                          </Button>
                        )}

                        {order.status === "ready" && (
                          <>
                            <Button
                              onClick={() => {
                                sendWhatsAppMessage(order.phone, generateOrderReadyMessage(order))
                                updateOrderStatus(order.id, "completed")
                              }}
                              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                            >
                              <MessageCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">Notify Customer</span>
                            </Button>
                            <Button
                              onClick={() => updateOrderStatus(order.id, "completed")}
                              variant="outline"
                              className="text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                            >
                              <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">Mark Completed</span>
                            </Button>
                          </>
                        )}

                        {order.paymentStatus === "pending" && (
                          <Button
                            onClick={() => {
                              const qrUrl = generatePaymentQR(order.total, order.id)
                              window.open(qrUrl, "_blank")
                            }}
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                          >
                            <QrCode className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Show Payment QR</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
            <div className="grid gap-3 sm:gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="w-full">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base sm:text-lg">
                          <div className="flex items-center gap-2 min-w-0">
                            <Calendar className="h-4 sm:h-5 w-4 sm:w-5 flex-shrink-0" />
                            <span className="truncate">{booking.customerName}</span>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} text-xs w-fit`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 sm:h-4 w-3 sm:w-4 flex-shrink-0" />
                          <span className="break-all">{booking.phone}</span>
                        </p>
                      </div>
                      <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} text-xs w-fit flex-shrink-0`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="font-medium">Date:</span>
                          <p className="text-muted-foreground">{booking.date}</p>
                        </div>
                        <div>
                          <span className="font-medium">Time:</span>
                          <p className="text-muted-foreground">{booking.time}</p>
                        </div>
                        <div>
                          <span className="font-medium">Party Size:</span>
                          <p className="text-muted-foreground">{booking.partySize} people</p>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <p className="text-muted-foreground">
                            {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                          </p>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="text-xs sm:text-sm">
                          <span className="font-medium">Special Requests:</span>
                          <p className="text-muted-foreground break-words leading-relaxed">{booking.specialRequests}</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">Booked: {booking.timestamp.toLocaleString()}</div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              onClick={() => {
                                sendWhatsAppMessage(booking.phone, generateBookingConfirmMessage(booking))
                                updateBookingStatus(booking.id, "confirmed")
                              }}
                              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                            >
                              <MessageCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">Confirm Booking</span>
                            </Button>
                            {booking.paymentStatus === "pending" && (
                              <Button
                                onClick={() => {
                                  const qrUrl = generatePaymentQR(500, booking.id)
                                  window.open(qrUrl, "_blank")
                                }}
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50 text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                              >
                                <QrCode className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">Show Payment QR</span>
                              </Button>
                            )}
                          </>
                        )}

                        {booking.status === "confirmed" && (
                          <Button
                            onClick={() => updateBookingStatus(booking.id, "completed")}
                            variant="outline"
                            className="text-xs sm:text-sm py-2 px-3 w-full sm:w-auto"
                          >
                            <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">Mark Completed</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
