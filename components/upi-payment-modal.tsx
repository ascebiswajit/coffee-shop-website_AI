"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { QrCode, Smartphone, Copy, CheckCircle, Clock, AlertCircle, X, Wallet } from "lucide-react"
import {
  generateUPIString,
  generatePhonePeURL,
  generateGooglePayURL,
  generatePaytmURL,
  generateQRCodeDataURL,
  generateTransactionId,
  verifyPayment,
  type UPIPaymentDetails,
  type PaymentStatus,
} from "@/lib/upi-payment"

interface UPIPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  orderDetails: {
    items: Array<{ name: string; quantity: number; price: number }>
    customerName: string
    customerPhone: string
    orderType: string
    tableNumber?: string
    deliveryAddress?: string
  }
  onPaymentSuccess: (transactionId: string) => void
  onPaymentFailed: (error: string) => void
}

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  orderDetails,
  onPaymentSuccess,
  onPaymentFailed,
}: UPIPaymentModalProps) {
  const [transactionId, setTransactionId] = useState<string>("")
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [customUPIId, setCustomUPIId] = useState("")

  // Merchant details (in production, these would come from environment variables)
  const merchantDetails = {
    merchantId: "brewandbean@paytm", // Replace with actual UPI ID
    merchantName: "Brew & Bean Coffee Shop",
    currency: "INR",
  }

  useEffect(() => {
    if (isOpen) {
      const txnId = generateTransactionId()
      setTransactionId(txnId)

      const paymentDetails: UPIPaymentDetails = {
        ...merchantDetails,
        transactionId: txnId,
        amount: amount,
        note: `Order from Brew & Bean - ${orderDetails.items.length} items`,
        customerName: orderDetails.customerName,
        customerPhone: orderDetails.customerPhone,
      }

      const upiString = generateUPIString(paymentDetails)
      const qrCode = generateQRCodeDataURL(upiString, 256)
      setQrCodeDataURL(qrCode)

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setPaymentStatus({
              transactionId: txnId,
              status: "expired",
              amount: amount,
              timestamp: new Date(),
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, amount, orderDetails])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePaymentApp = (appType: "phonepe" | "googlepay" | "paytm") => {
    const paymentDetails: UPIPaymentDetails = {
      ...merchantDetails,
      transactionId,
      amount,
      note: `Order from Brew & Bean - ${orderDetails.items.length} items`,
      customerName: orderDetails.customerName,
      customerPhone: orderDetails.customerPhone,
    }

    let url = ""
    switch (appType) {
      case "phonepe":
        url = generatePhonePeURL(paymentDetails)
        break
      case "googlepay":
        url = generateGooglePayURL(paymentDetails)
        break
      case "paytm":
        url = generatePaytmURL(paymentDetails)
        break
    }

    window.open(url, "_blank")
    startPaymentVerification()
  }

  const handleCustomUPIPay = () => {
    if (!customUPIId.trim()) return

    const paymentDetails: UPIPaymentDetails = {
      merchantId: customUPIId,
      merchantName: merchantDetails.merchantName,
      transactionId,
      amount,
      currency: "INR",
      note: `Order from Brew & Bean - ${orderDetails.items.length} items`,
      customerName: orderDetails.customerName,
      customerPhone: orderDetails.customerPhone,
    }

    const upiString = generateUPIString(paymentDetails)
    window.open(upiString, "_blank")
    startPaymentVerification()
  }

  const startPaymentVerification = () => {
    setIsVerifying(true)

    // Simulate payment verification process
    const verificationInterval = setInterval(async () => {
      try {
        const status = await verifyPayment(transactionId)
        setPaymentStatus(status)

        if (status.status === "success") {
          clearInterval(verificationInterval)
          setIsVerifying(false)
          onPaymentSuccess(transactionId)
        } else if (status.status === "failed") {
          clearInterval(verificationInterval)
          setIsVerifying(false)
          onPaymentFailed("Payment failed. Please try again.")
        }
      } catch (error) {
        clearInterval(verificationInterval)
        setIsVerifying(false)
        onPaymentFailed("Payment verification failed. Please contact support.")
      }
    }, 3000)

    // Stop verification after 2 minutes
    setTimeout(() => {
      clearInterval(verificationInterval)
      setIsVerifying(false)
    }, 120000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                UPI Payment
              </CardTitle>
              <CardDescription>Complete your payment using any UPI app</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-lg text-primary">₹{amount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Time remaining: {formatTime(timeLeft)}</span>
          </div>

          {/* Payment Status */}
          {paymentStatus && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  {paymentStatus.status === "success" && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-500 font-medium">Payment Successful!</span>
                    </>
                  )}
                  {paymentStatus.status === "pending" && (
                    <>
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-500 font-medium">Payment Pending...</span>
                    </>
                  )}
                  {paymentStatus.status === "failed" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-500 font-medium">Payment Failed</span>
                    </>
                  )}
                  {paymentStatus.status === "expired" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-500 font-medium">Payment Expired</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>Scan with any UPI app to pay</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                {qrCodeDataURL && (
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCodeDataURL || "/placeholder.svg"} alt="UPI Payment QR Code" className="w-48 h-48" />
                  </div>
                )}
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{transactionId}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(transactionId)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Apps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Pay with Apps
                </CardTitle>
                <CardDescription>Choose your preferred UPI app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handlePaymentApp("phonepe")}
                  disabled={isVerifying || paymentStatus?.status === "success"}
                >
                  <div className="w-6 h-6 bg-purple-600 rounded mr-3"></div>
                  PhonePe
                </Button>

                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handlePaymentApp("googlepay")}
                  disabled={isVerifying || paymentStatus?.status === "success"}
                >
                  <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                  Google Pay
                </Button>

                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => handlePaymentApp("paytm")}
                  disabled={isVerifying || paymentStatus?.status === "success"}
                >
                  <div className="w-6 h-6 bg-blue-600 rounded mr-3"></div>
                  Paytm
                </Button>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Or enter UPI ID</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="yourname@upi"
                      value={customUPIId}
                      onChange={(e) => setCustomUPIId(e.target.value)}
                      disabled={isVerifying || paymentStatus?.status === "success"}
                    />
                    <Button
                      onClick={handleCustomUPIPay}
                      disabled={!customUPIId.trim() || isVerifying || paymentStatus?.status === "success"}
                    >
                      Pay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Verification Status */}
          {isVerifying && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Verifying payment...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Scan the QR code or click on your preferred UPI app</p>
              <p>2. Verify the payment details in your UPI app</p>
              <p>3. Enter your UPI PIN to complete the payment</p>
              <p>4. Wait for payment confirmation</p>
              <p className="text-xs mt-4">
                <strong>Note:</strong> This payment session will expire in {formatTime(timeLeft)}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
