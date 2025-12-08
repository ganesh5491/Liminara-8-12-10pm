import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Roles table for role-based access control
export const roles = pgTable("roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").unique().notNull(), // super_admin, admin, sales, delivery, user
  displayName: varchar("display_name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").default('{}'), // JSON object with permission flags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin/Staff users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  username: varchar("username").unique(),
  name: varchar("name").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  passwordHash: varchar("password_hash").notNull(),
  roleId: varchar("role_id").references(() => roles.id),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(false),
  lastLogin: timestamp("last_login"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Delivery agents table
export const deliveryAgents = pgTable("delivery_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  passwordHash: varchar("password_hash").notNull(),
  address: text("address"),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode"),
  permanentAddress: text("permanent_address"),
  permanentCity: varchar("permanent_city"),
  permanentState: varchar("permanent_state"),
  permanentPincode: varchar("permanent_pincode"),
  currentAddress: text("current_address"),
  currentCity: varchar("current_city"),
  currentState: varchar("current_state"),
  currentPincode: varchar("current_pincode"),
  sameAsPermAddress: boolean("same_as_perm_address").default(false),
  aadharNumber: varchar("aadhar_number").notNull(),
  panNumber: varchar("pan_number"),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  isAvailable: boolean("is_available").default(true),
  mustChangePassword: boolean("must_change_password").default(false),
  totalDeliveries: integer("total_deliveries").default(0),
  completedDeliveries: integer("completed_deliveries").default(0),
  cancelledDeliveries: integer("cancelled_deliveries").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  token: varchar("token").notNull(),
  temporaryPassword: varchar("temporary_password"),
  userType: varchar("user_type").notNull(), // admin, delivery, user
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Users table with auth fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  name: varchar("name"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  phone: varchar("phone"),
  address: text("address"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  provider: varchar("provider"),
  mustChangePassword: boolean("must_change_password").default(false),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  orderCount: integer("order_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subcategories table
export const subcategories = pgTable("subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  categoryId: varchar("category_id").references(() => categories.id).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table with extended fields
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  fullDescription: text("full_description"), // HTML content for rich description
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  categoryId: varchar("category_id").references(() => categories.id),
  subcategoryId: varchar("subcategory_id").references(() => subcategories.id),
  brand: varchar("brand"),
  sku: varchar("sku"),
  tags: text("tags").array(),
  specifications: jsonb("specifications").default('{}'), // JSON for specs
  careGuide: text("care_guide"), // Care instructions
  variants: jsonb("variants").default('[]'), // JSON array for variants
  imageUrl: varchar("image_url"),
  images: text("images").array(),
  inStock: boolean("in_stock").default(true),
  stock: integer("stock").default(0),
  featured: boolean("featured").default(false),
  isPublished: boolean("is_published").default(true),
  isDeal: boolean("is_deal").default(false),
  dealPrice: decimal("deal_price", { precision: 10, scale: 2 }),
  dealExpiry: timestamp("deal_expiry"),
  viewCount: integer("view_count").default(0),
  soldCount: integer("sold_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wishlist items table
export const wishlistItems = pgTable("wishlist_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table with delivery tracking
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique(),
  userId: varchar("user_id").references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  status: varchar("status").default("pending"), // pending, confirmed, packed, shipped, out_for_delivery, delivered, cancelled, rejected
  paymentId: varchar("payment_id"),
  paymentStatus: varchar("payment_status").default("pending"),
  paymentMethod: varchar("payment_method"), // upi, card, netbanking, wallet, qr, cod
  razorpayOrderId: varchar("razorpay_order_id"),
  razorpayPaymentId: varchar("razorpay_payment_id"),
  razorpaySignature: varchar("razorpay_signature"),
  customerName: varchar("customer_name").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  customerEmail: varchar("customer_email"),
  shippingAddress: text("shipping_address").notNull(),
  city: varchar("city"),
  state: varchar("state"),
  pincode: varchar("pincode").notNull(),
  trackingId: varchar("tracking_id"),
  couponCode: varchar("coupon_code"),
  couponDiscount: decimal("coupon_discount", { precision: 10, scale: 2 }).default("0"),
  deliveryAgentId: varchar("delivery_agent_id").references(() => deliveryAgents.id),
  deliveryStatus: varchar("delivery_status"), // assigned, picked_up, in_transit, out_for_delivery, delivered, failed
  deliveryNotes: text("delivery_notes"),
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order status history/timeline
export const orderStatusHistory = pgTable("order_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  status: varchar("status").notNull(),
  notes: text("notes"),
  changedBy: varchar("changed_by"), // admin user id or delivery agent id
  changedByType: varchar("changed_by_type"), // admin, delivery, system
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id).notNull(),
  productName: varchar("product_name"),
  productImage: varchar("product_image"),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Delivery assignments table
export const deliveryAssignments = pgTable("delivery_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  deliveryAgentId: varchar("delivery_agent_id").references(() => deliveryAgents.id).notNull(),
  status: varchar("status").default("assigned"), // assigned, accepted, picked_up, in_transit, delivered, failed, cancelled
  assignedBy: varchar("assigned_by").references(() => adminUsers.id),
  assignedAt: timestamp("assigned_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
  failureReason: text("failure_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support tickets table for helpdesk
export const supportTickets = pgTable("support_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone"),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("open"), // open, in_progress, resolved, closed
  priority: varchar("priority").default("medium"), // low, medium, high, urgent
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments table for virtual meetings
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone").notNull(),
  appointmentDate: timestamp("appointment_date").notNull(),
  duration: integer("duration").default(30), // in minutes
  meetingType: varchar("meeting_type").default("virtual_showroom"), // consultation, virtual_showroom, product_demo
  status: varchar("status").default("scheduled"), // scheduled, confirmed, in_progress, completed, cancelled
  meetingLink: varchar("meeting_link"),
  meetingId: varchar("meeting_id"),
  notes: text("notes"),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries table
export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  inquiryType: varchar("inquiry_type").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("new"), // new, contacted, resolved
  assignedTo: varchar("assigned_to"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product reviews table with moderation
export const productReviews = pgTable("product_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  userName: varchar("user_name").notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title"),
  comment: text("comment").notNull(),
  images: text("images").array(),
  isVerified: boolean("is_verified").default(false),
  status: varchar("status").default("pending"), // pending, approved, rejected
  adminReply: text("admin_reply"),
  adminReplyBy: varchar("admin_reply_by"),
  adminReplyAt: timestamp("admin_reply_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product Q&A table
export const productQuestions = pgTable("product_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  userName: varchar("user_name").notNull(),
  userEmail: varchar("user_email"),
  question: text("question").notNull(),
  answer: text("answer"),
  answeredBy: varchar("answered_by"),
  answeredAt: timestamp("answered_at"),
  isPublic: boolean("is_public").default(true),
  status: varchar("status").default("pending"), // pending, answered, hidden
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Addresses table
export const userAddresses = pgTable("user_addresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  pincode: varchar("pincode").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs for admin actions
export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  userType: varchar("user_type"), // admin, delivery, user, system
  action: varchar("action").notNull(), // create, update, delete, login, logout, etc.
  entityType: varchar("entity_type"), // product, order, user, etc.
  entityId: varchar("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sales reports table for caching
export const salesReports = pgTable("sales_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportType: varchar("report_type").notNull(), // daily, weekly, monthly, yearly
  reportDate: timestamp("report_date").notNull(),
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).default("0"),
  totalOrders: integer("total_orders").default(0),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }).default("0"),
  topProducts: jsonb("top_products").default('[]'),
  salesByCategory: jsonb("sales_by_category").default('{}'),
  salesByPaymentMethod: jsonb("sales_by_payment_method").default('{}'),
  newCustomers: integer("new_customers").default(0),
  returningCustomers: integer("returning_customers").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").unique().notNull(),
  description: text("description"),
  discountType: varchar("discount_type").notNull(), // percentage, fixed
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }).default("0"),
  maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const rolesRelations = relations(roles, ({ many }) => ({
  adminUsers: many(adminUsers),
}));

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  role: one(roles, {
    fields: [adminUsers.roleId],
    references: [roles.id],
  }),
}));

export const deliveryAgentsRelations = relations(deliveryAgents, ({ many }) => ({
  orders: many(orders),
  assignments: many(deliveryAssignments),
}));

export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orders: many(orders),
  reviews: many(productReviews),
  addresses: many(userAddresses),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  orderItems: many(orderItems),
  reviews: many(productReviews),
  questions: many(productQuestions),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  deliveryAgent: one(deliveryAgents, {
    fields: [orders.deliveryAgentId],
    references: [deliveryAgents.id],
  }),
  orderItems: many(orderItems),
  statusHistory: many(orderStatusHistory),
  assignments: many(deliveryAssignments),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const deliveryAssignmentsRelations = relations(deliveryAssignments, ({ one }) => ({
  order: one(orders, {
    fields: [deliveryAssignments.orderId],
    references: [orders.id],
  }),
  deliveryAgent: one(deliveryAgents, {
    fields: [deliveryAssignments.deliveryAgentId],
    references: [deliveryAgents.id],
  }),
  assignedByAdmin: one(adminUsers, {
    fields: [deliveryAssignments.assignedBy],
    references: [adminUsers.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

export const productQuestionsRelations = relations(productQuestions, ({ one }) => ({
  product: one(products, {
    fields: [productQuestions.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productQuestions.userId],
    references: [users.id],
  }),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeliveryAgentSchema = createInsertSchema(deliveryAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
}).extend({
  productId: z.string().or(z.number()).pipe(z.coerce.string()),
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderStatusHistorySchema = createInsertSchema(orderStatusHistory).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryAssignmentSchema = createInsertSchema(deliveryAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductQuestionSchema = createInsertSchema(productQuestions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAddressSchema = createInsertSchema(userAddresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSalesReportSchema = createInsertSchema(salesReports).omit({
  id: true,
  createdAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type DeliveryAgent = typeof deliveryAgents.$inferSelect;
export type InsertDeliveryAgent = z.infer<typeof insertDeliveryAgentSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type InsertOrderStatusHistory = z.infer<typeof insertOrderStatusHistorySchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type DeliveryAssignment = typeof deliveryAssignments.$inferSelect;
export type InsertDeliveryAssignment = z.infer<typeof insertDeliveryAssignmentSchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
export type ProductQuestion = typeof productQuestions.$inferSelect;
export type InsertProductQuestion = z.infer<typeof insertProductQuestionSchema>;
export type UserAddress = typeof userAddresses.$inferSelect;
export type InsertUserAddress = z.infer<typeof insertUserAddressSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type SalesReport = typeof salesReports.$inferSelect;
export type InsertSalesReport = z.infer<typeof insertSalesReportSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
