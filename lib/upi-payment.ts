// UPI Payment Integration Library
export interface UPIPaymentDetails {
  merchantId: string
  merchantName: string
  transactionId: string
  amount: number
  currency: string
  note: string
  customerName?: string
  customerPhone?: string
}

export interface PaymentQRData {
  qrString: string
  paymentUrl: string
  transactionId: string
  expiryTime: Date
}

// Generate UPI payment string according to NPCI specifications
export function generateUPIString(details: UPIPaymentDetails): string {
  const {
    merchantId,
    merchantName,
    transactionId,
    amount,
    currency = "INR",
    note,
    customerName,
    customerPhone,
  } = details

  // UPI URL format: upi://pay?parameters
  const params = new URLSearchParams({
    pa: merchantId, // Payment Address (VPA)
    pn: merchantName, // Payee Name
    tr: transactionId, // Transaction Reference ID
    am: amount.toFixed(2), // Amount
    cu: currency, // Currency
    tn: note, // Transaction Note
  })

  // Add optional parameters
  if (customerName) {
    params.append("mc", "5411") // Merchant Category Code for restaurants
  }

  return `upi://pay?${params.toString()}`
}

// Generate PhonePe specific payment URL
export function generatePhonePeURL(details: UPIPaymentDetails): string {
  const upiString = generateUPIString(details)
  // PhonePe deep link format
  return `phonepe://pay?${upiString.replace("upi://pay?", "")}`
}

// Generate Google Pay specific payment URL
export function generateGooglePayURL(details: UPIPaymentDetails): string {
  const upiString = generateUPIString(details)
  // Google Pay deep link format
  return `tez://upi/pay?${upiString.replace("upi://pay?", "")}`
}

// Generate Paytm specific payment URL
export function generatePaytmURL(details: UPIPaymentDetails): string {
  const upiString = generateUPIString(details)
  // Paytm deep link format
  return `paytmmp://pay?${upiString.replace("upi://pay?", "")}`
}

// Create QR code data URL using a simple QR generation approach
export function generateQRCodeDataURL(text: string, size = 256): string {
  // For production, you would use a proper QR code library
  // This is a placeholder that creates a data URL
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) return ""

  canvas.width = size
  canvas.height = size

  // Simple pattern generation (in production, use proper QR library)
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = "#FFFFFF"

  // Create a simple pattern based on text hash
  const hash = text.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const blockSize = size / 25
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if ((hash + i * j) % 3 === 0) {
        ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize)
      }
    }
  }

  return canvas.toDataURL()
}

// Validate UPI ID format
export function validateUPIId(upiId: string): boolean {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
  return upiRegex.test(upiId)
}

// Generate transaction ID
export function generateTransactionId(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN${timestamp.slice(-8)}${random}`
}

// Payment status tracking
export interface PaymentStatus {
  transactionId: string
  status: "pending" | "success" | "failed" | "expired"
  amount: number
  timestamp: Date
  paymentMethod?: string
}

// Mock payment verification (in production, integrate with payment gateway)
export async function verifyPayment(transactionId: string): Promise<PaymentStatus> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock response (in production, call actual payment gateway API)
  return {
    transactionId,
    status: Math.random() > 0.3 ? "success" : "pending",
    amount: 0,
    timestamp: new Date(),
    paymentMethod: "UPI",
  }
}
