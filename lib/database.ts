import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export interface User {
  id: number
  name: string
  email?: string
  phone: string
  address?: string
  created_at: Date
  updated_at: Date
}

export interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category_id: number
  image_url?: string
  is_available: boolean
  preparation_time: number
  ingredients?: string[]
  allergens?: string[]
  nutritional_info?: any
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  order_type: "dine-in" | "takeaway" | "delivery"
  table_number?: number
  delivery_address?: string
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled"
  payment_status: "pending" | "paid" | "failed" | "refunded"
  payment_method?: string
  upi_transaction_id?: string
  barcode?: string
  special_instructions?: string
  estimated_completion_time?: Date
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  quantity: number
  unit_price: number
  total_price: number
  special_requests?: string
}

export interface Booking {
  id: number
  user_id: number
  booking_number: string
  table_number: number
  party_size: number
  booking_date: Date
  booking_time: string
  duration_hours: number
  status: "confirmed" | "cancelled" | "completed" | "no-show"
  special_requests?: string
  created_at: Date
  updated_at: Date
}

// Database operations
export const dbOperations = {
  // User operations
  async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    const result = await sql`
      INSERT INTO users (name, email, phone, address)
      VALUES (${userData.name}, ${userData.email || null}, ${userData.phone}, ${userData.address || null})
      RETURNING *
    `
    return result[0] as User
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE phone = ${phone} LIMIT 1
    `
    return (result[0] as User) || null
  },

  // Menu operations
  async getMenuItems(): Promise<MenuItem[]> {
    const result = await sql`
      SELECT mi.*, c.name as category_name 
      FROM menu_items mi 
      LEFT JOIN categories c ON mi.category_id = c.id 
      WHERE mi.is_available = true 
      ORDER BY c.display_order, mi.name
    `
    return result as MenuItem[]
  },

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const result = await sql`
      SELECT * FROM menu_items WHERE id = ${id} AND is_available = true LIMIT 1
    `
    return (result[0] as MenuItem) || null
  },

  // Order operations
  async createOrder(orderData: Omit<Order, "id" | "created_at" | "updated_at">): Promise<Order> {
    const result = await sql`
      INSERT INTO orders (
        user_id, order_number, order_type, table_number, delivery_address,
        total_amount, status, payment_status, payment_method, barcode, special_instructions
      )
      VALUES (
        ${orderData.user_id}, ${orderData.order_number}, ${orderData.order_type},
        ${orderData.table_number || null}, ${orderData.delivery_address || null},
        ${orderData.total_amount}, ${orderData.status}, ${orderData.payment_status},
        ${orderData.payment_method || null}, ${orderData.barcode || null}, ${orderData.special_instructions || null}
      )
      RETURNING *
    `
    return result[0] as Order
  },

  async createOrderItems(orderItems: Omit<OrderItem, "id">[]): Promise<OrderItem[]> {
    const values = orderItems
      .map(
        (item) =>
          `(${item.order_id}, ${item.menu_item_id}, ${item.quantity}, ${item.unit_price}, ${item.total_price}, ${item.special_requests ? `'${item.special_requests}'` : "NULL"})`,
      )
      .join(", ")

    const result = await sql`
      INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price, special_requests)
      VALUES ${sql.unsafe(values)}
      RETURNING *
    `
    return result as OrderItem[]
  },

  async getOrderByBarcode(barcode: string): Promise<Order | null> {
    const result = await sql`
      SELECT * FROM orders WHERE barcode = ${barcode} LIMIT 1
    `
    return (result[0] as Order) || null
  },

  async updateOrderStatus(orderId: number, status: Order["status"]): Promise<Order> {
    const result = await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${orderId} 
      RETURNING *
    `
    return result[0] as Order
  },

  // Booking operations
  async createBooking(bookingData: Omit<Booking, "id" | "created_at" | "updated_at">): Promise<Booking> {
    const result = await sql`
      INSERT INTO bookings (
        user_id, booking_number, table_number, party_size, 
        booking_date, booking_time, duration_hours, status, special_requests
      )
      VALUES (
        ${bookingData.user_id}, ${bookingData.booking_number}, ${bookingData.table_number},
        ${bookingData.party_size}, ${bookingData.booking_date}, ${bookingData.booking_time},
        ${bookingData.duration_hours}, ${bookingData.status}, ${bookingData.special_requests || null}
      )
      RETURNING *
    `
    return result[0] as Booking
  },

  async getAvailableTables(date: Date, time: string): Promise<number[]> {
    const result = await sql`
      SELECT table_number FROM tables 
      WHERE is_available = true 
      AND table_number NOT IN (
        SELECT table_number FROM bookings 
        WHERE booking_date = ${date} 
        AND booking_time = ${time}
        AND status = 'confirmed'
      )
      ORDER BY table_number
    `
    return result.map((row) => row.table_number)
  },

  // Analytics and reporting
  async getDailyOrderStats(date: Date) {
    const result = await sql`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders
      FROM orders 
      WHERE DATE(created_at) = ${date}
    `
    return result[0]
  },

  async getPopularItems(limit = 10) {
    const result = await sql`
      SELECT 
        mi.name,
        mi.price,
        SUM(oi.quantity) as total_sold,
        SUM(oi.total_price) as total_revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'delivered'
      GROUP BY mi.id, mi.name, mi.price
      ORDER BY total_sold DESC
      LIMIT ${limit}
    `
    return result
  },
}

// Utility functions
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `ORD${timestamp}${random}`
}

export function generateBookingNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0")
  return `BK${timestamp}${random}`
}

export function generateBarcode(phone: string): string {
  const timestamp = Date.now().toString().slice(-8)
  const phoneDigits = phone.slice(-4)
  return `BC${timestamp}${phoneDigits}`
}
