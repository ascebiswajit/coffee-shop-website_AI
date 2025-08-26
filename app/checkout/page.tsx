"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingCart, MapPin, Clock, Phone, User, Minus, Plus, ArrowLeft, CheckCircle } from "lucide-react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  customization?: string
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [step, setStep] = useState(1)
  const [orderType, setOrderType] = useState("pickup")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    tableNumber: "",
    specialInstructions: "",
  })

  useEffect(() => {
    // Get cart from localStorage or parent window
    const savedCart = localStorage.getItem("coffeeShopCart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const updateQuantity = (id: number, customization: string | undefined, change: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === id && item.customization === customization) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as CartItem[]

      localStorage.setItem("coffeeShopCart", JSON.stringify(updatedCart))
      return updatedCart
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSubmitOrder = () => {
    const orderDetails = {
      items: cart,
      total: getTotalPrice(),
      orderType,
      customer: customerInfo,
      orderTime: new Date().toLocaleString(),
    }

    const message = `🛒 *New Order - Complete Your Booking*

📋 *Order Details:*
${cart
  .map(
    (item) =>
      `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}${item.customization ? `\n  Note: ${item.customization}` : ""}`,
  )
  .join("\n")}

💰 *Total: $${getTotalPrice().toFixed(2)}*

👤 *Customer Information:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}

🚚 *Order Type: ${orderType.toUpperCase()}*
${orderType === "delivery" ? `Address: ${customerInfo.address}` : ""}
${orderType === "dine-in" ? `Table: ${customerInfo.tableNumber}` : ""}

📝 *Special Instructions:*
${customerInfo.specialInstructions || "None"}

⏰ *Order Time: ${new Date().toLocaleString()}*

Please confirm this order and provide payment details.`

    const whatsappUrl = `https://wa.me/919348480855?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setStep(4)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Button onClick={() => window.close()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Complete Your Booking</h1>
          <p className="text-center text-gray-600">Review your order and provide details</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 4 && <div className={`w-8 h-0.5 ${step > stepNum ? "bg-orange-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Summary ({getTotalItems()} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    {item.customization && <p className="text-xs text-gray-500 italic">Note: {item.customization}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.customization, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.customization, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Choose Order Type</h3>
                  <RadioGroup value={orderType} onValueChange={setOrderType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                        <Clock className="w-4 h-4 mr-2" />
                        Pickup (Ready in 15-20 mins)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center cursor-pointer">
                        <MapPin className="w-4 h-4 mr-2" />
                        Delivery (30-45 mins)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dine-in" id="dine-in" />
                      <Label htmlFor="dine-in" className="flex items-center cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Dine In
                      </Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={() => setStep(2)} className="w-full">
                    Continue
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>

                  {orderType === "delivery" && (
                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Enter complete delivery address"
                        required
                      />
                    </div>
                  )}

                  {orderType === "dine-in" && (
                    <div>
                      <Label htmlFor="table">Preferred Table Number</Label>
                      <Input
                        id="table"
                        value={customerInfo.tableNumber}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                        placeholder="Table number (optional)"
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1"
                      disabled={
                        !customerInfo.name || !customerInfo.phone || (orderType === "delivery" && !customerInfo.address)
                      }
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Final Details</h3>
                  <div>
                    <Label htmlFor="instructions">Special Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={customerInfo.specialInstructions}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                      placeholder="Any special requests or dietary requirements..."
                    />
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Order Summary</h4>
                    <p>
                      <strong>Type:</strong> {orderType.charAt(0).toUpperCase() + orderType.slice(1)}
                    </p>
                    <p>
                      <strong>Items:</strong> {getTotalItems()}
                    </p>
                    <p>
                      <strong>Total:</strong> ${getTotalPrice().toFixed(2)}
                    </p>
                    <p>
                      <strong>Customer:</strong> {customerInfo.name}
                    </p>
                    {orderType === "delivery" && (
                      <p>
                        <strong>Address:</strong> {customerInfo.address}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={handleSubmitOrder} className="flex-1 bg-green-600 hover:bg-green-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Send Order via WhatsApp
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                  <h3 className="text-xl font-semibold">Order Sent Successfully!</h3>
                  <p className="text-gray-600">
                    Your order has been sent via WhatsApp. We'll confirm your order and provide payment details shortly.
                  </p>
                  <div className="space-y-2">
                    <Button onClick={() => window.close()} className="w-full">
                      Close Window
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep(1)
                        setCart([])
                      }}
                      className="w-full"
                    >
                      Place Another Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
