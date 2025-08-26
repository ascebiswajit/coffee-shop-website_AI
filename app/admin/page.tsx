"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  BarChart3,
  Users,
  ShoppingBag,
  Calendar,
  Settings,
  TrendingUp,
  Coffee,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Bell,
  LogOut,
} from "lucide-react"

interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  orderType: "dine-in" | "takeaway" | "delivery"
  tableNumber?: string
  deliveryAddress?: string
  paymentMethod: "UPI" | "Cash" | "Card"
  paymentStatus: "pending" | "completed" | "failed"
  createdAt: Date
  estimatedTime?: number
}

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  bookingType: "table" | "event" | "meeting"
  date: string
  time: string
  partySize: string
  duration: string
  occasion?: string
  specialRequests?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  isVegetarian: boolean
  isPopular: boolean
}

interface Analytics {
  todayOrders: number
  todayRevenue: number
  pendingBookings: number
  popularItems: Array<{ name: string; orders: number }>
  revenueChart: Array<{ date: string; revenue: number }>
  orderStatusDistribution: Array<{ status: string; count: number }>
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - in production, this would come from your database
  useEffect(() => {
    if (isAuthenticated) {
      // Mock orders data
      setOrders([
        {
          id: "ORD001",
          customerName: "John Doe",
          customerPhone: "+91 98765 43210",
          items: [
            { name: "Cappuccino", quantity: 2, price: 4.5 },
            { name: "Croissant", quantity: 1, price: 3.25 },
          ],
          total: 12.25,
          status: "preparing",
          orderType: "dine-in",
          tableNumber: "5",
          paymentMethod: "UPI",
          paymentStatus: "completed",
          createdAt: new Date(),
          estimatedTime: 15,
        },
        {
          id: "ORD002",
          customerName: "Jane Smith",
          customerPhone: "+91 87654 32109",
          items: [
            { name: "Latte", quantity: 1, price: 5.0 },
            { name: "Avocado Toast", quantity: 1, price: 6.5 },
          ],
          total: 11.5,
          status: "ready",
          orderType: "takeaway",
          paymentMethod: "Cash",
          paymentStatus: "pending",
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          estimatedTime: 10,
        },
      ])

      // Mock bookings data
      setBookings([
        {
          id: "BK001",
          customerName: "Alice Johnson",
          customerPhone: "+91 76543 21098",
          customerEmail: "alice@example.com",
          bookingType: "table",
          date: "2024-01-15",
          time: "7:00 PM",
          partySize: "4",
          duration: "2 hours",
          occasion: "Birthday",
          specialRequests: "Window seat preferred",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: "BK002",
          customerName: "Bob Wilson",
          customerPhone: "+91 65432 10987",
          bookingType: "meeting",
          date: "2024-01-16",
          time: "10:00 AM",
          partySize: "6",
          duration: "1.5 hours",
          specialRequests: "Need projector setup",
          status: "confirmed",
          createdAt: new Date(Date.now() - 60 * 60 * 1000),
        },
      ])

      // Mock menu items
      setMenuItems([
        {
          id: 1,
          name: "Espresso",
          description: "Rich single shot",
          price: 3.5,
          category: "Coffee",
          isAvailable: true,
          isVegetarian: true,
          isPopular: true,
        },
        {
          id: 2,
          name: "Cappuccino",
          description: "Espresso with steamed milk",
          price: 4.5,
          category: "Coffee",
          isAvailable: true,
          isVegetarian: true,
          isPopular: true,
        },
        {
          id: 3,
          name: "Croissant",
          description: "Buttery pastry",
          price: 3.25,
          category: "Pastries",
          isAvailable: false,
          isVegetarian: true,
          isPopular: false,
        },
      ])

      // Mock analytics
      setAnalytics({
        todayOrders: 24,
        todayRevenue: 486.5,
        pendingBookings: 3,
        popularItems: [
          { name: "Cappuccino", orders: 15 },
          { name: "Latte", orders: 12 },
          { name: "Espresso", orders: 8 },
        ],
        revenueChart: [
          { date: "Mon", revenue: 420 },
          { date: "Tue", revenue: 380 },
          { date: "Wed", revenue: 450 },
          { date: "Thu", revenue: 520 },
          { date: "Fri", revenue: 486.5 },
        ],
        orderStatusDistribution: [
          { status: "completed", count: 18 },
          { status: "preparing", count: 4 },
          { status: "pending", count: 2 },
        ],
      })
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (adminPassword === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminPassword("")
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const updateBookingStatus = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
    )
  }

  const toggleMenuItemAvailability = (itemId: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-green-500"
      case "delivered":
      case "completed":
        return "bg-gray-500"
      case "cancelled":
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter admin password to access dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <p className="text-xs text-muted-foreground text-center">Demo password: admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Brew & Bean Admin</h1>
              <p className="text-sm text-muted-foreground">Coffee Shop Management Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.todayOrders}</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{analytics?.todayRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+8% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.pendingBookings}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter((o) => ["pending", "confirmed", "preparing"].includes(o.status)).length}
                  </div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Items Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.popularItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary">{item.orders} orders</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">₹{order.total.toFixed(2)}</p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <CardDescription>
                          {order.customerName} • {order.customerPhone}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <Badge variant="outline">{order.orderType}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Items</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm text-muted-foreground">
                              {item.name} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Total</h4>
                        <p className="text-lg font-bold">₹{order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.paymentMethod} • {order.paymentStatus}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Details</h4>
                        {order.tableNumber && (
                          <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
                        )}
                        {order.deliveryAddress && <p className="text-sm text-muted-foreground">Delivery</p>}
                        {order.estimatedTime && (
                          <p className="text-sm text-muted-foreground">{order.estimatedTime} mins</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Actions</h4>
                        <div className="flex gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Booking #{booking.id}</CardTitle>
                        <CardDescription>
                          {booking.customerName} • {booking.customerPhone}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <Badge variant="outline">{booking.bookingType}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Date & Time</h4>
                        <p className="text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{booking.time}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Party Details</h4>
                        <p className="text-sm">{booking.partySize} people</p>
                        <p className="text-sm text-muted-foreground">{booking.duration}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Special Info</h4>
                        {booking.occasion && <p className="text-sm">{booking.occasion}</p>}
                        {booking.specialRequests && (
                          <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Actions</h4>
                        <div className="flex gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" onClick={() => updateBookingStatus(booking.id, "confirmed")}>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Menu Management</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{item.category}</Badge>
                              {item.isVegetarian && <Badge variant="outline">Vegetarian</Badge>}
                              {item.isPopular && <Badge>Popular</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">₹{item.price.toFixed(2)}</p>
                          <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => toggleMenuItemAvailability(item.id)}>
                            {item.isAvailable ? "Disable" : "Enable"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Customer management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Information</CardTitle>
                  <CardDescription>Update your coffee shop details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Shop Name" defaultValue="Brew & Bean" />
                    <Input placeholder="Phone Number" defaultValue="+91 93484 80855" />
                  </div>
                  <Textarea
                    placeholder="Address"
                    defaultValue="Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107"
                  />
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operating Hours</CardTitle>
                  <CardDescription>Set your shop's opening hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Weekdays</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="6:00 AM" />
                        <span className="flex items-center">to</span>
                        <Input placeholder="8:00 PM" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Weekends</label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="7:00 AM" />
                        <span className="flex items-center">to</span>
                        <Input placeholder="9:00 PM" />
                      </div>
                    </div>
                  </div>
                  <Button>Update Hours</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
