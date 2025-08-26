interface BookingEmailProps {
  customerName: string
  bookingType: string
  date: string
  time: string
  guests: string
  phone: string
  email: string
  occasion?: string
  specialRequests?: string
}

export const CustomerBookingEmail = ({
  customerName,
  bookingType,
  date,
  time,
  guests,
  phone,
  occasion,
  specialRequests,
}: BookingEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fef7ed",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#d97706", margin: "0" }}>☕ Coffee Shop Booking Confirmation</h1>
      </div>

      <div
        style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <h2 style={{ color: "#374151", marginTop: "0" }}>Dear {customerName},</h2>
        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
          Thank you for your booking! Here are your reservation details:
        </p>

        <div style={{ background: "#fef3c7", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
          <h3 style={{ color: "#d97706", marginTop: "0" }}>📋 Booking Details</h3>
          <p style={{ margin: "5px 0" }}>
            <strong>Type:</strong> {bookingType}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Date:</strong> {date}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Time:</strong> {time}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Guests:</strong> {guests}
          </p>
          {occasion && (
            <p style={{ margin: "5px 0" }}>
              <strong>Occasion:</strong> {occasion}
            </p>
          )}
        </div>

        <div style={{ background: "#f3f4f6", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
          <h3 style={{ color: "#374151", marginTop: "0" }}>📍 Location</h3>
          <p style={{ margin: "0", color: "#6b7280" }}>
            Basani Devi Colony, Sector IV, Nawbhanga, Chingrighata, Kolkata, West Bengal 700107
          </p>
        </div>

        <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
          We'll confirm your booking shortly via WhatsApp. If you have any questions, please contact us at +91
          9348480855.
        </p>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p style={{ color: "#d97706", fontWeight: "bold" }}>Thank you for choosing our coffee shop! ☕</p>
        </div>
      </div>
    </div>
  )
}

export const ClientBookingEmail = ({
  customerName,
  bookingType,
  date,
  time,
  guests,
  phone,
  email,
  occasion,
  specialRequests,
}: BookingEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#dc2626", margin: "0" }}>🚨 New Booking Alert</h1>
      </div>

      <div
        style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
      >
        <h2 style={{ color: "#374151", marginTop: "0" }}>New Booking Received</h2>

        <div
          style={{
            background: "#fee2e2",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0",
            borderLeft: "4px solid #dc2626",
          }}
        >
          <h3 style={{ color: "#dc2626", marginTop: "0" }}>👤 Customer Information</h3>
          <p style={{ margin: "5px 0" }}>
            <strong>Name:</strong> {customerName}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Phone:</strong> {phone}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Email:</strong> {email}
          </p>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0",
            borderLeft: "4px solid #d97706",
          }}
        >
          <h3 style={{ color: "#d97706", marginTop: "0" }}>📋 Booking Details</h3>
          <p style={{ margin: "5px 0" }}>
            <strong>Type:</strong> {bookingType}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Date:</strong> {date}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Time:</strong> {time}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Guests:</strong> {guests}
          </p>
          {occasion && (
            <p style={{ margin: "5px 0" }}>
              <strong>Occasion:</strong> {occasion}
            </p>
          )}
          {specialRequests && (
            <p style={{ margin: "5px 0" }}>
              <strong>Special Requests:</strong> {specialRequests}
            </p>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            padding: "20px",
            background: "#f3f4f6",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "#374151", margin: "0", fontWeight: "bold" }}>
            Please confirm this booking via WhatsApp: +91 9348480855
          </p>
        </div>
      </div>
    </div>
  )
}
