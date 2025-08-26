"use client"

import { useState } from "react"
import { Calendar, Clock, Users, Phone, Mail, ArrowLeft, Coffee, Utensils, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function BookingPage() {
  const [bookingStep, setBookingStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    type: "",
    date: "",
    time: "",
    guests: "",
    name: "",
    phone: "",
    email: "",
    occasion: "",
    specialRequests: "",
  })

  const bookingTypes = [
    {
      id: "table",
      title: "Table Reservation",
      description: "Reserve a cozy table for dining",
      icon: Utensils,
      color: "bg-amber-100 text-amber-800",
    },
    {
      id: "event",
      title: "Private Event",
      description: "Host your special celebration",
      icon: PartyPopper,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "meeting",
      title: "Business Meeting",
      description: "Professional space for meetings",
      icon: Coffee,
      color: "bg-blue-100 text-blue-800",
    },
  ]

  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
  ]

  const handleSubmit = async () => {
    const bookingId = `BK${Date.now()}`
    const selectedBookingType = bookingTypes.find((t) => t.id === bookingData.type)

    console.log("[v0] Starting booking submission process...")

    const emailData = {
      customerName: bookingData.name,
      customerEmail: bookingData.email,
      customerPhone: bookingData.phone,
      bookingType: selectedBookingType?.title || bookingData.type,
      bookingDate: bookingData.date,
      bookingTime: bookingData.time,
      partySize: Number.parseInt(bookingData.guests),
      specialRequests: bookingData.specialRequests,
      occasion: bookingData.occasion,
      bookingId: bookingId,
    }

    const message = `🍴 *New Booking Request*

📋 *Booking Details:*
• Booking ID: ${bookingId}
• Type: ${selectedBookingType?.title}
• Date: ${bookingData.date}
• Time: ${bookingData.time}
• Guests: ${bookingData.guests}

👤 *Customer Information:*
• Name: ${bookingData.name}
• Phone: ${bookingData.phone}
• Email: ${bookingData.email}

${bookingData.occasion ? `🎉 *Special Occasion:* ${bookingData.occasion}` : ""}
${bookingData.specialRequests ? `📝 *Special Requests:* ${bookingData.specialRequests}` : ""}

📍 *Location:* Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107

Please confirm this booking. Thank you! ☕`

    try {
      console.log("[v0] Sending booking emails...")

      const response = await fetch("/api/send-booking-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      const result = await response.json()
      console.log("[v0] Email API response:", result)

      if (response.ok && result.success) {
        console.log("[v0] ✅ Booking emails sent successfully")
        alert(
          `🎉 Booking Confirmed!\n\nBooking ID: ${bookingId}\n\n✅ Confirmation emails sent to:\n• You: ${bookingData.email}\n• Café: biswajitnayak2402@gmail.com\n\nYou will also receive WhatsApp confirmation shortly.`,
        )
      } else {
        console.log("[v0] ⚠️ Email sending failed, proceeding with WhatsApp only")
        alert(
          `📋 Booking Submitted!\n\nBooking ID: ${bookingId}\n\n⚠️ Email confirmation failed, but your booking is recorded.\nYou will receive WhatsApp confirmation.`,
        )
      }
    } catch (error) {
      console.error("[v0] ❌ Email error:", error)
      alert(
        `📋 Booking Submitted!\n\nBooking ID: ${bookingId}\n\n⚠️ Email system temporarily unavailable.\nYou will receive WhatsApp confirmation.`,
      )
    }

    console.log("[v0] Opening WhatsApp confirmation...")
    const whatsappUrl = `https://wa.me/919348480855?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setTimeout(() => {
      setBookingStep(1)
      setBookingData({
        type: "",
        date: "",
        time: "",
        guests: "",
        name: "",
        phone: "",
        email: "",
        occasion: "",
        specialRequests: "",
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Book Your Experience</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step <= bookingStep ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step < bookingStep ? "bg-amber-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Step {bookingStep} of 3:{" "}
                  {bookingStep === 1
                    ? "Choose Experience"
                    : bookingStep === 2
                      ? "Select Date & Time"
                      : "Your Information"}
                </p>
              </div>
            </div>
          </div>

          {/* Step 1: Booking Type */}
          {bookingStep === 1 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Choose Your Experience</CardTitle>
                <CardDescription className="text-lg">Select the type of booking that suits your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bookingTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => {
                        setBookingData({ ...bookingData, type: type.id })
                        setBookingStep(2)
                      }}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        bookingData.type === type.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mb-4 mx-auto`}
                      >
                        <type.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-center mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-center">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time */}
          {bookingStep === 2 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Select Date & Time</CardTitle>
                <CardDescription className="text-lg">Choose your preferred date and time slot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Guests
                    </label>
                    <select
                      value={bookingData.guests}
                      onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Select guests</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBookingData({ ...bookingData, time })}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          bookingData.time === time
                            ? "bg-amber-600 text-white border-amber-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:bg-amber-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setBookingStep(1)} className="px-6">
                    Back
                  </Button>
                  <Button
                    onClick={() => setBookingStep(3)}
                    disabled={!bookingData.date || !bookingData.time || !bookingData.guests}
                    className="px-6 bg-amber-600 hover:bg-amber-700"
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customer Information */}
          {bookingStep === 3 && (
            <Card className="animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900">Your Information</CardTitle>
                <CardDescription className="text-lg">Please provide your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Occasion</label>
                  <select
                    value={bookingData.occasion}
                    onChange={(e) => setBookingData({ ...bookingData, occasion: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select occasion (optional)</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Business Meeting">Business Meeting</option>
                    <option value="Date Night">Date Night</option>
                    <option value="Family Gathering">Family Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Any special requests or dietary requirements..."
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setBookingStep(2)} className="px-6">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!bookingData.name || !bookingData.phone}
                    className="px-8 bg-amber-600 hover:bg-amber-700"
                  >
                    Complete Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
