"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, MessageCircle, X, CalendarDays, PartyPopper } from "lucide-react"

interface WhatsAppBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onBookingSubmit: (bookingData: BookingData) => void
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

const timeSlots = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
]

const occasions = [
  "Birthday",
  "Anniversary",
  "Date Night",
  "Business Meeting",
  "Study Session",
  "Catch up with Friends",
  "First Date",
  "Proposal",
  "Celebration",
  "Other",
]

export default function WhatsAppBookingModal({ isOpen, onClose, onBookingSubmit }: WhatsAppBookingModalProps) {
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    bookingType: "table",
    date: "",
    time: "",
    duration: "1 hour",
    partySize: "2",
    specialRequests: "",
    occasion: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onBookingSubmit(bookingData)
    onClose()
    // Reset form
    setBookingData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      bookingType: "table",
      date: "",
      time: "",
      duration: "1 hour",
      partySize: "2",
      specialRequests: "",
      occasion: "",
    })
    setCurrentStep(1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.customerName && bookingData.customerPhone && bookingData.bookingType
      case 2:
        return bookingData.date && bookingData.time && bookingData.partySize
      case 3:
        return true // Optional step
      default:
        return false
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30) // Allow booking up to 30 days in advance
    return maxDate.toISOString().split("T")[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Table Booking
              </CardTitle>
              <CardDescription>Reserve your perfect spot at Brew & Bean</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-12 h-1 mx-2 ${i + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Personal Information & Booking Type */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">Let us know who's booking</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name *"
                  value={bookingData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  required
                />
                <Input
                  placeholder="Phone Number *"
                  value={bookingData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  required
                />
              </div>

              <Input
                placeholder="Email Address (optional)"
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
              />

              <div className="space-y-3">
                <label className="text-sm font-medium">Booking Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant={bookingData.bookingType === "table" ? "default" : "outline"}
                    onClick={() => handleInputChange("bookingType", "table")}
                    className="h-20 flex-col gap-2"
                  >
                    <Users className="w-6 h-6" />
                    <span>Table Reservation</span>
                  </Button>
                  <Button
                    variant={bookingData.bookingType === "event" ? "default" : "outline"}
                    onClick={() => handleInputChange("bookingType", "event")}
                    className="h-20 flex-col gap-2"
                  >
                    <PartyPopper className="w-6 h-6" />
                    <span>Private Event</span>
                  </Button>
                  <Button
                    variant={bookingData.bookingType === "meeting" ? "default" : "outline"}
                    onClick={() => handleInputChange("bookingType", "meeting")}
                    className="h-20 flex-col gap-2"
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Business Meeting</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date, Time & Party Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Booking Details</h3>
                <p className="text-sm text-muted-foreground">When would you like to visit?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time *
                  </label>
                  <Select value={bookingData.time} onValueChange={(value) => handleInputChange("time", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Party Size *
                  </label>
                  <Select
                    value={bookingData.partySize}
                    onValueChange={(value) => handleInputChange("partySize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Number of people" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                          {i + 1} {i + 1 === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                      <SelectItem value="12+">12+ people (Group Event)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Duration</label>
                  <Select value={bookingData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How long?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="1 hour">1 hour</SelectItem>
                      <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                      <SelectItem value="2+ hours">2+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {bookingData.bookingType === "event" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Occasion</label>
                  <Select
                    value={bookingData.occasion || ""}
                    onValueChange={(value) => handleInputChange("occasion", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="What's the occasion?" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasions.map((occasion) => (
                        <SelectItem key={occasion} value={occasion}>
                          {occasion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Special Requests & Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Special Requests</h3>
                <p className="text-sm text-muted-foreground">Any special requirements or preferences?</p>
              </div>

              <Textarea
                placeholder="Special requests, dietary requirements, seating preferences, decorations, etc..."
                value={bookingData.specialRequests}
                onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                rows={4}
              />

              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{bookingData.customerName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{bookingData.customerPhone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <Badge variant="secondary">
                        {bookingData.bookingType === "table"
                          ? "Table Reservation"
                          : bookingData.bookingType === "event"
                            ? "Private Event"
                            : "Business Meeting"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Party Size:</span>
                      <p>{bookingData.partySize} people</p>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <p>{new Date(bookingData.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <p>{bookingData.time}</p>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <p>{bookingData.duration}</p>
                    </div>
                    {bookingData.occasion && (
                      <div>
                        <span className="font-medium">Occasion:</span>
                        <p>{bookingData.occasion}</p>
                      </div>
                    )}
                  </div>
                  {bookingData.specialRequests && (
                    <div>
                      <span className="font-medium">Special Requests:</span>
                      <p className="text-sm text-muted-foreground mt-1">{bookingData.specialRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This booking request will be sent via WhatsApp to our team. You'll receive a
                  confirmation message once your booking is confirmed. Our team will contact you if any adjustments are
                  needed.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={!isStepValid()}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Booking Request
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
