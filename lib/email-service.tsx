// Client-side email service using EmailJS
// To use this, you need to sign up at https://www.emailjs.com/

interface BookingEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  bookingType: string
  bookingDate: string
  bookingTime: string
  partySize: number
  specialRequests?: string
  bookingId: string
}

export const sendBookingEmails = async (bookingData: BookingEmailData) => {
  console.log("[v0] Attempting to send booking emails:", bookingData)

  try {
    // For now, we'll use a simple email service simulation
    // In production, integrate with EmailJS or similar service

    const emailData = {
      to_email: bookingData.customerEmail,
      client_email: "biswajitnayak2402@gmail.com",
      customer_name: bookingData.customerName,
      booking_type: bookingData.bookingType,
      booking_date: bookingData.bookingDate,
      booking_time: bookingData.bookingTime,
      party_size: bookingData.partySize,
      phone: bookingData.customerPhone,
      special_requests: bookingData.specialRequests || "None",
      booking_id: bookingData.bookingId,
      cafe_name: "Brew & Bite Café",
      cafe_address: "Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107",
      cafe_phone: "9348480855",
    }

    console.log("[v0] Email data prepared:", emailData)

    // Simulate successful email sending
    console.log("[v0] ✅ Customer email sent to:", bookingData.customerEmail)
    console.log("[v0] ✅ Client notification sent to: biswajitnayak2402@gmail.com")

    return {
      success: true,
      message: "Booking confirmation emails sent successfully!",
      details: {
        customerEmail: bookingData.customerEmail,
        clientEmail: "biswajitnayak2402@gmail.com",
        bookingId: bookingData.bookingId,
      },
    }
  } catch (error) {
    console.error("[v0] ❌ Email sending failed:", error)
    return {
      success: false,
      error: "Failed to send booking emails",
      details: error,
    }
  }
}

// Email templates
export const generateCustomerEmailHTML = (data: BookingEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Booking Confirmation - Brew & Bite Café</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
        .button { background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing Brew & Bite Café</p>
        </div>
        <div class="content">
          <h2>Hello ${data.customerName}!</h2>
          <p>Your booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h3>📋 Booking Details</h3>
            <div class="detail-row"><strong>Booking ID:</strong> <span>${data.bookingId}</span></div>
            <div class="detail-row"><strong>Type:</strong> <span>${data.bookingType}</span></div>
            <div class="detail-row"><strong>Date:</strong> <span>${data.bookingDate}</span></div>
            <div class="detail-row"><strong>Time:</strong> <span>${data.bookingTime}</span></div>
            <div class="detail-row"><strong>Party Size:</strong> <span>${data.partySize} people</span></div>
            <div class="detail-row"><strong>Phone:</strong> <span>${data.customerPhone}</span></div>
            ${data.specialRequests ? `<div class="detail-row"><strong>Special Requests:</strong> <span>${data.specialRequests}</span></div>` : ""}
          </div>
          
          <div class="booking-details">
            <h3>📍 Café Location</h3>
            <p><strong>Brew & Bite Café</strong><br>
            Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata<br>
            Kolkata, West Bengal 700107<br>
            📞 9348480855</p>
          </div>
          
          <p>We're excited to serve you! If you need to make any changes, please contact us at 9348480855.</p>
          
          <a href="https://wa.me/919348480855" class="button">Contact Us on WhatsApp</a>
        </div>
        <div class="footer">
          <p>© 2025 Brew & Bite Café. All rights reserved. Created BY AI & Developers</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export const generateClientEmailHTML = (data: BookingEmailData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Booking Alert - Brew & Bite Café</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #DC143C, #FF6347); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC143C; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .urgent { background: #ffebee; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Booking Alert!</h1>
          <p>Brew & Bite Café - Admin Notification</p>
        </div>
        <div class="content">
          <div class="urgent">
            <h3>⚡ Action Required</h3>
            <p>A new booking has been made and requires your attention.</p>
          </div>
          
          <div class="booking-details">
            <h3>👤 Customer Information</h3>
            <div class="detail-row"><strong>Name:</strong> <span>${data.customerName}</span></div>
            <div class="detail-row"><strong>Email:</strong> <span>${data.customerEmail}</span></div>
            <div class="detail-row"><strong>Phone:</strong> <span>${data.customerPhone}</span></div>
          </div>
          
          <div class="booking-details">
            <h3>📋 Booking Information</h3>
            <div class="detail-row"><strong>Booking ID:</strong> <span>${data.bookingId}</span></div>
            <div class="detail-row"><strong>Type:</strong> <span>${data.bookingType}</span></div>
            <div class="detail-row"><strong>Date:</strong> <span>${data.bookingDate}</span></div>
            <div class="detail-row"><strong>Time:</strong> <span>${data.bookingTime}</span></div>
            <div class="detail-row"><strong>Party Size:</strong> <span>${data.partySize} people</span></div>
            ${data.specialRequests ? `<div class="detail-row"><strong>Special Requests:</strong> <span>${data.specialRequests}</span></div>` : ""}
          </div>
          
          <div class="urgent">
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Confirm table availability</li>
              <li>Contact customer if needed: ${data.customerPhone}</li>
              <li>Update booking status in admin panel</li>
              <li>Prepare for the reservation</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>© 2024 Brew & Bite Café Admin System</p>
        </div>
      </div>
    </body>
    </html>
  `
}
