import { db, isJSONStorage } from "./db";
import { eq, and, desc, asc, sql, like, gte, lte, or, isNull, count, sum } from "drizzle-orm";
import {
  adminUsers,
  deliveryAgents,
  roles,
  passwordResetTokens,
  orders,
  orderItems,
  orderStatusHistory,
  deliveryAssignments,
  products,
  categories,
  subcategories,
  users,
  contactInquiries,
  productReviews,
  productQuestions,
  activityLogs,
  salesReports,
  coupons,
  type AdminUser,
  type InsertAdminUser,
  type DeliveryAgent,
  type InsertDeliveryAgent,
  type Role,
  type InsertRole,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type Order,
  type InsertOrder,
  type OrderStatusHistory,
  type InsertOrderStatusHistory,
  type DeliveryAssignment,
  type InsertDeliveryAssignment,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type User,
  type ContactInquiry,
  type ProductReview,
  type ProductQuestion,
  type ActivityLog,
  type InsertActivityLog,
  type SalesReport,
  type InsertSalesReport,
  type Coupon,
  type InsertCoupon,
} from "@shared/schema";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// JSON Storage fallback for development
const jsonRoles: Map<string, Role> = new Map();
const jsonAdminUsers: Map<string, AdminUser> = new Map();
const jsonUsers: Map<string, User> = new Map();
const jsonOrders: Map<string, Order> = new Map();
const jsonOrderItems: Map<string, any> = new Map();
const jsonProducts: Map<string, Product> = new Map();
const jsonCategories: Map<string, Category> = new Map();
const jsonInquiries: Map<string, ContactInquiry> = new Map();
const jsonReviews: Map<string, ProductReview> = new Map();
const jsonQuestions: Map<string, ProductQuestion> = new Map();
const jsonCoupons: Map<string, Coupon> = new Map();
const jsonDeliveryAgents: Map<string, DeliveryAgent> = new Map();
let isAdminDataLoaded = false;
let isJsonDataLoaded = false;

// Generic JSON file loader
function loadJsonFile<T>(filename: string): T[] {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error);
  }
  return [];
}

// Generic JSON file saver
function saveJsonFile<T>(filename: string, data: T[]): void {
  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Failed to save ${filename}:`, error);
  }
}

// Load all JSON data files
// Load all JSON data files
function loadAllJsonData() {
  if (!isJSONStorage) return;
  // Always reload to ensure synchronization with main storage
  jsonUsers.clear();
  jsonOrders.clear();
  jsonOrderItems.clear();
  jsonProducts.clear();
  jsonCategories.clear();
  jsonDeliveryAgents.clear();

  // Note: We don't clear cached Roles/AdminUsers as they are managed primarily by this file
  // But for safety let's reload everything consistent with file state


  // Load users
  const usersData = loadJsonFile<User>("users.json");
  usersData.forEach((user) => {
    user.createdAt = new Date(user.createdAt || Date.now());
    user.updatedAt = new Date(user.updatedAt || Date.now());
    jsonUsers.set(user.id, user);
  });

  // Load orders
  const ordersData = loadJsonFile<Order>("orders.json");
  ordersData.forEach((order) => {
    order.createdAt = new Date(order.createdAt || Date.now());
    order.updatedAt = new Date(order.updatedAt || Date.now());
    jsonOrders.set(order.id, order);
  });

  // Load order items
  const orderItemsData = loadJsonFile<any>("orderItems.json");
  orderItemsData.forEach((item) => {
    item.createdAt = new Date(item.createdAt || Date.now());
    jsonOrderItems.set(item.id, item);
  });

  // Load products
  const productsData = loadJsonFile<any>("products.json");
  productsData.forEach((product) => {
    // Convert to proper Product format
    const productObj: any = {
      id: product.id,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      stock: product.stock,
      featured: product.featured,
      category: product.category,
      categoryId: product.categoryId || null,
      subcategory: product.subcategory,
      inStock: product.inStock !== false,
      isPublished: product.isPublished !== false,
      createdAt: new Date(product.createdAt || Date.now()),
      updatedAt: new Date(product.updatedAt || Date.now()),
    };
    jsonProducts.set(product.id, productObj);
  });

  // Load categories
  const categoriesData = loadJsonFile<Category>("categories.json");
  categoriesData.forEach((category) => {
    category.createdAt = new Date(category.createdAt || Date.now());
    category.updatedAt = new Date(category.updatedAt || Date.now());
    jsonCategories.set(category.id, category);
  });

  // Load delivery agents
  const agentsData = loadJsonFile<DeliveryAgent>("deliveryAgents.json");
  agentsData.forEach((agent) => {
    agent.createdAt = new Date(agent.createdAt || Date.now());
    agent.updatedAt = new Date(agent.updatedAt || Date.now());
    agent.lastLogin = agent.lastLogin ? new Date(agent.lastLogin) : null;
    jsonDeliveryAgents.set(agent.id, agent);
  });

  // Load inquiries
  const inquiriesData = loadJsonFile<ContactInquiry>("contactInquiries.json");
  inquiriesData.forEach((inquiry) => {
    inquiry.createdAt = new Date(inquiry.createdAt || Date.now());
    jsonInquiries.set(inquiry.id, inquiry);
  });

  // Load reviews
  const reviewsData = loadJsonFile<ProductReview>("productReviews.json");
  reviewsData.forEach((review) => {
    review.createdAt = new Date(review.createdAt || Date.now());
    review.updatedAt = new Date(review.updatedAt || Date.now());
    jsonReviews.set(review.id, review);
  });

  // Load questions
  const questionsData = loadJsonFile<ProductQuestion>("productQuestions.json");
  questionsData.forEach((question) => {
    question.createdAt = new Date(question.createdAt || Date.now());
    question.updatedAt = new Date(question.updatedAt || Date.now());
    jsonQuestions.set(question.id, question);
  });

  // Load coupons
  const couponsData = loadJsonFile<Coupon>("coupons.json");
  couponsData.forEach((coupon) => {
    coupon.createdAt = new Date(coupon.createdAt || Date.now());
    coupon.updatedAt = new Date(coupon.updatedAt || Date.now());
    coupon.validFrom = coupon.validFrom ? new Date(coupon.validFrom) : null;
    coupon.validUntil = coupon.validUntil ? new Date(coupon.validUntil) : null;
    jsonCoupons.set(coupon.id, coupon);
  });

  isJsonDataLoaded = true;
  console.log("✅ JSON data loaded: users:", jsonUsers.size, "orders:", jsonOrders.size, "products:", jsonProducts.size, "agents:", jsonDeliveryAgents.size, "categories:", jsonCategories.size, "coupons:", jsonCoupons.size);
}

// Initialize default roles for JSON storage
function initializeDefaultRoles() {
  if (isJSONStorage && jsonRoles.size === 0) {
    const defaultRoles = [
      {
        id: "1",
        name: "super_admin",
        displayName: "Super Admin",
        permissions: {
          products: true,
          orders: true,
          users: true,
          inquiries: true,
          reviews: true,
          questions: true,
          settings: true,
          salesDashboard: true,
          deliveryDashboard: true,
          manageAdmins: true,
          manageDelivery: true,
          manageRoles: true,
          coupons: true,
          customers: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "admin",
        displayName: "Admin",
        permissions: {
          products: true,
          orders: true,
          users: true,
          inquiries: true,
          reviews: true,
          questions: true,
          settings: true,
          salesDashboard: true,
          deliveryDashboard: true,
          manageAdmins: false,
          manageDelivery: true,
          manageRoles: false,
          coupons: true,
          customers: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "sales",
        displayName: "Sales",
        permissions: {
          products: true,
          orders: true,
          users: false,
          inquiries: true,
          reviews: true,
          questions: true,
          settings: false,
          salesDashboard: true,
          deliveryDashboard: false,
          manageAdmins: false,
          manageDelivery: false,
          manageRoles: false,
          coupons: true,
          customers: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "delivery",
        displayName: "Delivery",
        permissions: {
          products: false,
          orders: true,
          users: false,
          inquiries: false,
          reviews: false,
          questions: false,
          settings: false,
          salesDashboard: false,
          deliveryDashboard: true,
          manageAdmins: false,
          manageDelivery: false,
          manageRoles: false,
          coupons: false,
          customers: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        name: "user",
        displayName: "User",
        permissions: {
          products: false,
          orders: false,
          users: false,
          inquiries: false,
          reviews: false,
          questions: false,
          settings: false,
          salesDashboard: false,
          deliveryDashboard: false,
          manageAdmins: false,
          manageDelivery: false,
          manageRoles: false,
          coupons: false,
          customers: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    defaultRoles.forEach((role) => jsonRoles.set(role.id, role as Role));
  }
}

// Load admin data from JSON file
function loadAdminData() {
  if (!isJSONStorage || isAdminDataLoaded) return;

  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "adminUsers.json");

    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const users = JSON.parse(data);
      users.forEach((user: AdminUser) => {
        // Convert string dates back to Date objects
        const parsedUser = {
          ...user,
          createdAt: new Date(user.createdAt || Date.now()),
          updatedAt: new Date(user.updatedAt || Date.now()),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          lockedUntil: user.lockedUntil ? new Date(user.lockedUntil) : null,
        };
        jsonAdminUsers.set(user.id, parsedUser);
      });
    }
    isAdminDataLoaded = true;
  } catch (error) {
    console.error("Failed to load admin users from JSON:", error);
  }
}

// Save admin data to JSON file
function saveAdminData() {
  if (!isJSONStorage) return;

  try {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "adminUsers.json");
    const users = Array.from(jsonAdminUsers.values());
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Failed to save admin users to JSON:", error);
  }
}

// =====================
// ROLE OPERATIONS
// =====================
export async function getRoles(): Promise<Role[]> {
  if (isJSONStorage) {
    initializeDefaultRoles();
    return Array.from(jsonRoles.values());
  }
  return await db!.select().from(roles).orderBy(asc(roles.name));
}

export async function getRoleById(id: string): Promise<Role | undefined> {
  if (isJSONStorage) {
    initializeDefaultRoles();
    return jsonRoles.get(id);
  }
  const result = await db!.select().from(roles).where(eq(roles.id, id)).limit(1);
  return result[0];
}

export async function getRoleByName(name: string): Promise<Role | undefined> {
  if (isJSONStorage) {
    initializeDefaultRoles();
    for (const role of Array.from(jsonRoles.values())) {
      if (role.name === name) return role;
    }
    return undefined;
  }
  const result = await db!.select().from(roles).where(eq(roles.name, name)).limit(1);
  return result[0];
}

export async function createRole(role: InsertRole): Promise<Role> {
  if (isJSONStorage) {
    const newRole: Role = {
      id: crypto.randomUUID(),
      name: role.name,
      displayName: role.displayName || role.name,
      description: role.description || null,
      permissions: role.permissions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jsonRoles.set(newRole.id, newRole);
    return newRole;
  }
  const result = await db!.insert(roles).values(role).returning();
  return result[0];
}

export async function updateRole(id: string, data: Partial<InsertRole>): Promise<Role | undefined> {
  if (isJSONStorage) {
    const role = jsonRoles.get(id);
    if (!role) return undefined;
    const updated: Role = {
      ...role,
      ...data,
      updatedAt: new Date(),
    };
    jsonRoles.set(id, updated);
    return updated;
  }
  const result = await db!.update(roles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(roles.id, id))
    .returning();
  return result[0];
}

export async function deleteRole(id: string): Promise<boolean> {
  if (isJSONStorage) {
    return jsonRoles.delete(id);
  }
  const result = await db!.delete(roles).where(eq(roles.id, id)).returning();
  return result.length > 0;
}

// =====================
// ADMIN USER OPERATIONS
// =====================
export async function getAdminUsers(): Promise<AdminUser[]> {
  if (isJSONStorage) {
    loadAdminData();
    return Array.from(jsonAdminUsers.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
  return await db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
}

export async function getAdminUserById(id: string): Promise<AdminUser | undefined> {
  if (isJSONStorage) {
    loadAdminData();
    return jsonAdminUsers.get(id);
  }
  const result = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return result[0];
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
  if (isJSONStorage) {
    loadAdminData();
    return Array.from(jsonAdminUsers.values()).find(u => u.email === email);
  }
  const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  return result[0];
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
  if (isJSONStorage) {
    loadAdminData();
    return Array.from(jsonAdminUsers.values()).find(u => u.username === username);
  }
  const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  return result[0];
}

export async function createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
  const passwordHash = await bcrypt.hash(user.passwordHash, 10);

  if (isJSONStorage) {
    loadAdminData();
    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      email: user.email,
      name: user.name,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      profileImageUrl: user.profileImageUrl || null,
      username: user.username || user.email.split('@')[0],
      passwordHash,
      roleId: user.roleId || null,
      isActive: user.isActive ?? true,
      mustChangePassword: user.mustChangePassword ?? false,
      loginAttempts: 0,
      lockedUntil: null,
      lastLogin: null,
      createdBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jsonAdminUsers.set(newUser.id, newUser);
    saveAdminData();
    return newUser;
  }

  const result = await db.insert(adminUsers).values({
    ...user,
    passwordHash,
  }).returning();
  return result[0];
}

export async function updateAdminUser(id: string, data: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
  const updateData: any = { ...data, updatedAt: new Date() };
  if (data.passwordHash) {
    updateData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
  }

  if (isJSONStorage) {
    loadAdminData();
    const user = jsonAdminUsers.get(id);
    if (!user) return undefined;

    const updated: AdminUser = {
      ...user,
      ...updateData,
    };
    jsonAdminUsers.set(id, updated);
    saveAdminData();
    return updated;
  }

  const result = await db.update(adminUsers)
    .set(updateData)
    .where(eq(adminUsers.id, id))
    .returning();
  return result[0];
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  if (isJSONStorage) {
    loadAdminData();
    const deleted = jsonAdminUsers.delete(id);
    if (deleted) saveAdminData();
    return deleted;
  }
  const result = await db.delete(adminUsers).where(eq(adminUsers.id, id)).returning();
  return result.length > 0;
}

export async function verifyAdminPassword(email: string, password: string): Promise<AdminUser | null> {
  const user = await getAdminUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;

  if (isJSONStorage) {
    const updated = {
      ...user,
      lastLogin: new Date(),
      loginAttempts: 0
    };
    jsonAdminUsers.set(user.id, updated);
    saveAdminData();
    return updated;
  }

  // Update last login
  await db.update(adminUsers)
    .set({ lastLogin: new Date(), loginAttempts: 0 })
    .where(eq(adminUsers.id, user.id));

  return user;
}

export async function incrementLoginAttempts(email: string): Promise<void> {
  const user = await getAdminUserByEmail(email);
  if (!user) return;

  const attempts = (user.loginAttempts || 0) + 1;
  const updates: any = { loginAttempts: attempts };

  // Lock account after 5 failed attempts for 30 minutes
  if (attempts >= 5) {
    updates.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  if (isJSONStorage) {
    const updated = { ...user, ...updates };
    jsonAdminUsers.set(user.id, updated);
    saveAdminData();
    return;
  }

  await db.update(adminUsers).set(updates).where(eq(adminUsers.id, user.id));
}

// =====================
// DELIVERY AGENT OPERATIONS
// =====================
export async function getDeliveryAgents(): Promise<DeliveryAgent[]> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const agents = Array.from(jsonDeliveryAgents.values());
    return agents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return await db.select().from(deliveryAgents).orderBy(desc(deliveryAgents.createdAt));
}

export async function getAvailableDeliveryAgents(): Promise<DeliveryAgent[]> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const agents = Array.from(jsonDeliveryAgents.values())
      .filter(a => a.isActive && a.isAvailable)
      .sort((a, b) => a.name.localeCompare(b.name));
    return agents;
  }
  return await db.select().from(deliveryAgents)
    .where(and(eq(deliveryAgents.isActive, true), eq(deliveryAgents.isAvailable, true)))
    .orderBy(asc(deliveryAgents.name));
}

export async function getDeliveryAgentById(id: string): Promise<DeliveryAgent | undefined> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    return jsonDeliveryAgents.get(id);
  }
  const result = await db.select().from(deliveryAgents).where(eq(deliveryAgents.id, id)).limit(1);
  return result[0];
}

export async function getDeliveryAgentByEmail(email: string): Promise<DeliveryAgent | undefined> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    for (const agent of jsonDeliveryAgents.values()) {
      if (agent.email === email) return agent;
    }
    return undefined;
  }
  const result = await db.select().from(deliveryAgents).where(eq(deliveryAgents.email, email)).limit(1);
  return result[0];
}

export async function createDeliveryAgent(agent: InsertDeliveryAgent): Promise<DeliveryAgent> {
  const passwordHash = await bcrypt.hash(agent.passwordHash, 10);

  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();

    const newAgent: DeliveryAgent = {
      id: crypto.randomUUID(),
      email: agent.email,
      name: agent.name,
      phone: agent.phone || "",
      passwordHash,
      address: agent.address || null,
      city: agent.city || null,
      state: agent.state || null,
      pincode: agent.pincode || null,
      permanentAddress: agent.permanentAddress || null,
      permanentCity: agent.permanentCity || null,
      permanentState: agent.permanentState || null,
      permanentPincode: agent.permanentPincode || null,
      currentAddress: agent.currentAddress || null,
      currentCity: agent.currentCity || null,
      currentState: agent.currentState || null,
      currentPincode: agent.currentPincode || null,
      sameAsPermAddress: agent.sameAsPermAddress || false,
      aadharNumber: agent.aadharNumber,
      panNumber: agent.panNumber || null,
      profileImageUrl: agent.profileImageUrl || null,
      isActive: true,
      isAvailable: true,
      mustChangePassword: agent.mustChangePassword ?? true,
      lastLogin: null,
      totalDeliveries: 0,
      completedDeliveries: 0,
      cancelledDeliveries: 0,
      rating: "5.00",
      earnings: "0",
      vehicleType: agent.vehicleType || null,
      vehicleNumber: agent.vehicleNumber || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jsonDeliveryAgents.set(newAgent.id, newAgent);
    saveJsonFile("deliveryAgents.json", Array.from(jsonDeliveryAgents.values()));
    return newAgent;
  }

  const result = await db.insert(deliveryAgents).values({
    ...agent,
    passwordHash,
  }).returning();
  return result[0];
}

export async function updateDeliveryAgent(id: string, data: Partial<InsertDeliveryAgent>): Promise<DeliveryAgent | undefined> {
  const updateData: any = { ...data, updatedAt: new Date() };
  if (data.passwordHash) {
    updateData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
  }

  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const agent = jsonDeliveryAgents.get(id);
    if (!agent) return undefined;

    const updated = { ...agent, ...updateData };
    jsonDeliveryAgents.set(id, updated);
    saveJsonFile("deliveryAgents.json", Array.from(jsonDeliveryAgents.values()));
    return updated;
  }

  const result = await db.update(deliveryAgents)
    .set(updateData)
    .where(eq(deliveryAgents.id, id))
    .returning();
  return result[0];
}

export async function deleteDeliveryAgent(id: string): Promise<boolean> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const deleted = jsonDeliveryAgents.delete(id);
    if (deleted) saveJsonFile("deliveryAgents.json", Array.from(jsonDeliveryAgents.values()));
    return deleted;
  }

  const result = await db.delete(deliveryAgents).where(eq(deliveryAgents.id, id)).returning();
  return result.length > 0;
}

export async function verifyDeliveryAgentPassword(email: string, password: string): Promise<DeliveryAgent | null> {
  const agent = await getDeliveryAgentByEmail(email);
  if (!agent || !agent.isActive) return null;

  const isValid = await bcrypt.compare(password, agent.passwordHash);
  if (!isValid) return null;

  // Update last login
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const updated = { ...agent, lastLogin: new Date() };
    jsonDeliveryAgents.set(agent.id, updated);
    saveJsonFile("deliveryAgents.json", Array.from(jsonDeliveryAgents.values()));
  } else {
    await db.update(deliveryAgents)
      .set({ lastLogin: new Date() })
      .where(eq(deliveryAgents.id, agent.id));
  }

  return agent;
}

export async function updateDeliveryAgentStats(id: string, completed: boolean): Promise<void> {
  const agent = await getDeliveryAgentById(id);
  if (!agent) return;

  const updates: any = {
    totalDeliveries: (agent.totalDeliveries || 0) + 1,
    updatedAt: new Date(),
  };

  if (completed) {
    updates.completedDeliveries = (agent.completedDeliveries || 0) + 1;
  } else {
    updates.cancelledDeliveries = (agent.cancelledDeliveries || 0) + 1;
  }

  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    const updated = { ...agent, ...updates };
    jsonDeliveryAgents.set(id, updated);
    saveJsonFile("deliveryAgents.json", Array.from(jsonDeliveryAgents.values()));
  } else {
    await db.update(deliveryAgents).set(updates).where(eq(deliveryAgents.id, id));
  }
}

// =====================
// PASSWORD RESET OPERATIONS
// =====================
export async function createPasswordResetToken(
  email: string,
  userType: "admin" | "delivery" | "user"
): Promise<{ token: string; temporaryPassword: string }> {
  const token = crypto.randomBytes(32).toString("hex");
  const temporaryPassword = crypto.randomBytes(8).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(passwordResetTokens).values({
    email,
    token,
    temporaryPassword: await bcrypt.hash(temporaryPassword, 10),
    userType,
    expiresAt,
  });

  return { token, temporaryPassword };
}

export async function verifyPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
  const result = await db.select().from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.token, token),
      eq(passwordResetTokens.used, false),
      gte(passwordResetTokens.expiresAt, new Date())
    ))
    .limit(1);

  return result[0] || null;
}

export async function markTokenUsed(id: string): Promise<void> {
  await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, id));
}

export async function verifyTemporaryPassword(email: string, tempPassword: string, userType: string): Promise<boolean> {
  const result = await db.select().from(passwordResetTokens)
    .where(and(
      eq(passwordResetTokens.email, email),
      eq(passwordResetTokens.userType, userType),
      eq(passwordResetTokens.used, false),
      gte(passwordResetTokens.expiresAt, new Date())
    ))
    .orderBy(desc(passwordResetTokens.createdAt))
    .limit(1);

  if (!result[0]) return false;

  const isValid = await bcrypt.compare(tempPassword, result[0].temporaryPassword || "");
  if (isValid) {
    await markTokenUsed(result[0].id);
  }
  return isValid;
}

// =====================
// ORDER OPERATIONS (Admin)
// =====================
export async function getAllOrders(filters?: {
  status?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  deliveryAgentId?: string;
}): Promise<Order[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let ordersArr = Array.from(jsonOrders.values());

    if (filters?.status) {
      ordersArr = ordersArr.filter(o => o.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      ordersArr = ordersArr.filter(o =>
        (o.customerName?.toLowerCase().includes(search)) ||
        (o.customerEmail?.toLowerCase().includes(search)) ||
        o.id.toLowerCase().includes(search)
      );
    }
    if (filters?.startDate) {
      ordersArr = ordersArr.filter(o => new Date(o.createdAt || 0) >= filters.startDate!);
    }
    if (filters?.endDate) {
      ordersArr = ordersArr.filter(o => new Date(o.createdAt || 0) <= filters.endDate!);
    }

    return ordersArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  let query = db.select().from(orders);
  const conditions: any[] = [];

  if (filters?.status) {
    conditions.push(eq(orders.status, filters.status));
  }
  if (filters?.search) {
    conditions.push(or(
      like(orders.customerName, `%${filters.search}%`),
      like(orders.customerEmail, `%${filters.search}%`),
      like(orders.orderNumber, `%${filters.search}%`),
      like(orders.id, `%${filters.search}%`)
    ));
  }
  if (filters?.startDate) {
    conditions.push(gte(orders.createdAt, filters.startDate));
  }
  if (filters?.endDate) {
    conditions.push(lte(orders.createdAt, filters.endDate));
  }
  if (filters?.deliveryAgentId) {
    conditions.push(eq(orders.deliveryAgentId, filters.deliveryAgentId));
  }

  if (conditions.length > 0) {
    return await db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt));
  }

  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderWithDetails(id: string) {
  const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order[0]) return null;

  const items = await db.select({
    orderItem: orderItems,
    product: products,
  })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  const statusHistory = await db.select().from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, id))
    .orderBy(desc(orderStatusHistory.createdAt));

  let deliveryAgent = null;
  if (order[0].deliveryAgentId) {
    const agent = await db.select().from(deliveryAgents)
      .where(eq(deliveryAgents.id, order[0].deliveryAgentId))
      .limit(1);
    deliveryAgent = agent[0] || null;
  }

  return {
    ...order[0],
    orderItems: items,
    statusHistory,
    deliveryAgent,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  changedBy: string,
  changedByType: "admin" | "delivery" | "system",
  notes?: string
): Promise<Order | undefined> {
  if (isJSONStorage) {
    const order = jsonOrders.get(orderId);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date(),
    };
    jsonOrders.set(orderId, updatedOrder);

    // Create new status history entry
    const newHistory: OrderStatusHistory = {
      id: crypto.randomUUID(),
      orderId,
      status,
      changedBy,
      changedByType,
      notes: notes || null,
      location: null,
      createdAt: new Date(),
    };

    // Save orders
    saveJsonFile("orders.json", Array.from(jsonOrders.values()));

    // Save history (we need to load and save history separately)
    // For now, let's just save the main order update which is critical

    return updatedOrder;
  }

  // Update order status
  const result = await db.update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();

  if (result[0]) {
    // Add to status history
    await db.insert(orderStatusHistory).values({
      orderId,
      status,
      changedBy,
      changedByType,
      notes,
    });
  }

  return result[0];
}

export async function assignDeliveryAgent(
  orderId: string,
  deliveryAgentId: string,
  assignedBy: string
): Promise<Order | undefined> {
  if (isJSONStorage) {
    const order = jsonOrders.get(orderId);
    if (!order) return undefined;

    const updatedOrder = {
      ...order,
      deliveryAgentId,
      deliveryStatus: "assigned",
      updatedAt: new Date(),
    };
    jsonOrders.set(orderId, updatedOrder);
    saveJsonFile("orders.json", Array.from(jsonOrders.values()));
    return updatedOrder;
  }

  const result = await db.update(orders)
    .set({
      deliveryAgentId,
      deliveryStatus: "assigned",
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  if (result[0]) {
    // Create delivery assignment record
    await db.insert(deliveryAssignments).values({
      orderId,
      deliveryAgentId,
      assignedBy,
      status: "assigned",
    });

    // Add to status history
    await db.insert(orderStatusHistory).values({
      orderId,
      status: "delivery_assigned",
      changedBy: assignedBy,
      changedByType: "admin",
      notes: `Delivery agent assigned`,
      location: null,
    });
  }

  return result[0];
}

// =====================
// DELIVERY OPERATIONS
// =====================
export async function getDeliveryAgentOrders(agentId: string, status?: string): Promise<Order[]> {
  if (isJSONStorage) {
    if (!isJsonDataLoaded) loadAllJsonData();
    let ordersArr = Array.from(jsonOrders.values());
    ordersArr = ordersArr.filter(o => o.deliveryAgentId === agentId);
    if (status) {
      ordersArr = ordersArr.filter(o => o.deliveryStatus === status);
    }
    return ordersArr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const conditions = [eq(orders.deliveryAgentId, agentId)];
  if (status) {
    conditions.push(eq(orders.deliveryStatus, status));
  }

  return await db.select().from(orders)
    .where(and(...conditions))
    .orderBy(desc(orders.createdAt));
}

export async function updateDeliveryStatus(
  orderId: string,
  deliveryStatus: string,
  agentId: string,
  notes?: string,
  location?: string
): Promise<Order | undefined> {
  const updates: any = {
    deliveryStatus,
    updatedAt: new Date(),
  };

  if (deliveryStatus === "delivered") {
    updates.actualDelivery = new Date();
    updates.status = "delivered";
    await updateDeliveryAgentStats(agentId, true);
  } else if (deliveryStatus === "failed") {
    await updateDeliveryAgentStats(agentId, false);
  }

  const result = await db.update(orders)
    .set(updates)
    .where(eq(orders.id, orderId))
    .returning();

  if (result[0]) {
    // Add to status history
    await db.insert(orderStatusHistory).values({
      orderId,
      status: deliveryStatus,
      changedBy: agentId,
      changedByType: "delivery",
      notes,
      location,
    });

    // Update delivery assignment
    const assignmentUpdates: any = { status: deliveryStatus, updatedAt: new Date() };
    if (deliveryStatus === "picked_up") {
      assignmentUpdates.pickedUpAt = new Date();
    } else if (deliveryStatus === "delivered") {
      assignmentUpdates.deliveredAt = new Date();
    } else if (deliveryStatus === "failed") {
      assignmentUpdates.failureReason = notes;
    }

    await db.update(deliveryAssignments)
      .set(assignmentUpdates)
      .where(and(
        eq(deliveryAssignments.orderId, orderId),
        eq(deliveryAssignments.deliveryAgentId, agentId)
      ));
  }

  return result[0];
}

// =====================
// PRODUCT OPERATIONS (Admin)
// =====================
export async function getAllProducts(filters?: {
  search?: string;
  categoryId?: string;
  isPublished?: boolean;
}): Promise<Product[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let productsArr = Array.from(jsonProducts.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      productsArr = productsArr.filter(p =>
        p.name?.toLowerCase().includes(search)
      );
    }
    if (filters?.categoryId) {
      productsArr = productsArr.filter(p => p.categoryId === filters.categoryId);
    }
    if (filters?.isPublished !== undefined) {
      productsArr = productsArr.filter(p => p.isPublished === filters.isPublished);
    }

    return productsArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const conditions: any[] = [];

  if (filters?.search) {
    conditions.push(or(
      like(products.name, `%${filters.search}%`),
      like(products.sku, `%${filters.search}%`)
    ));
  }
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.isPublished !== undefined) {
    conditions.push(eq(products.isPublished, filters.isPublished));
  }

  if (conditions.length > 0) {
    return await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt));
  }

  return await db.select().from(products).orderBy(desc(products.createdAt));
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const result = await db.insert(products).values(product).returning();
  return result[0];
}

export async function updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
  const result = await db.update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return result[0];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await db.delete(products).where(eq(products.id, id)).returning();
  return result.length > 0;
}

export async function toggleProductPublished(id: string): Promise<Product | undefined> {
  const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!product[0]) return undefined;

  const result = await db.update(products)
    .set({ isPublished: !product[0].isPublished, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  return result[0];
}

// =====================
// CATEGORY OPERATIONS (Admin)
// =====================
export async function getAllCategories(): Promise<Category[]> {
  return await db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function createCategory(category: InsertCategory): Promise<Category> {
  const result = await db.insert(categories).values(category).returning();
  return result[0];
}

export async function updateCategory(id: string, data: Partial<InsertCategory>): Promise<Category | undefined> {
  const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
  return result[0];
}

export async function deleteCategory(id: string): Promise<boolean> {
  const result = await db.delete(categories).where(eq(categories.id, id)).returning();
  return result.length > 0;
}

// =====================
// USER OPERATIONS (Admin)
// =====================
export async function getAllUsers(filters?: {
  search?: string;
}): Promise<User[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let usersArr = Array.from(jsonUsers.values());

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      usersArr = usersArr.filter(u =>
        u.email?.toLowerCase().includes(search) ||
        u.name?.toLowerCase().includes(search) ||
        u.phone?.includes(search)
      );
    }

    return usersArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  if (filters?.search) {
    return await db.select().from(users)
      .where(or(
        like(users.email, `%${filters.search}%`),
        like(users.name, `%${filters.search}%`),
        like(users.phone, `%${filters.search}%`)
      ))
      .orderBy(desc(users.createdAt));
  }

  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserWithStats(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user[0]) return null;

  const userOrders = await db.select().from(orders).where(eq(orders.userId, id));
  const totalSpent = userOrders.reduce((sum: number, order: any) => sum + parseFloat(order.total || "0"), 0);

  return {
    ...user[0],
    totalOrders: userOrders.length,
    totalSpent,
    orders: userOrders,
  };
}

export async function createUser(data: {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  password: string;
}): Promise<User> {
  const bcrypt = await import("bcrypt");
  const hashedPassword = await bcrypt.hash(data.password, 10);

  if (isJSONStorage) {
    loadAllJsonData();
    const id = crypto.randomUUID();
    const newUser: User = {
      id,
      email: data.email,
      name: data.name,
      phone: data.phone || null,
      address: data.address || null,
      password: hashedPassword,
      role: "customer",
      profileImageUrl: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jsonUsers.set(id, newUser);
    return newUser;
  }

  const result = await db.insert(users).values({
    email: data.email,
    name: data.name,
    phone: data.phone || null,
    address: data.address || null,
    password: hashedPassword,
    role: "customer",
  }).returning();

  return result[0];
}

export async function updateUser(id: string, data: {
  name?: string;
  phone?: string | null;
  address?: string | null;
}): Promise<User | undefined> {
  if (isJSONStorage) {
    loadAllJsonData();
    const user = jsonUsers.get(id);
    if (!user) return undefined;
    const updated = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    jsonUsers.set(id, updated);
    return updated;
  }

  const result = await db.update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  return result[0];
}

export async function deleteUser(id: string): Promise<boolean> {
  if (isJSONStorage) {
    loadAllJsonData();
    return jsonUsers.delete(id);
  }

  const result = await db.delete(users).where(eq(users.id, id)).returning();
  return result.length > 0;
}

// =====================
// INQUIRY OPERATIONS (Admin)
// =====================
export async function getAllInquiries(status?: string): Promise<ContactInquiry[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let inquiriesArr = Array.from(jsonInquiries.values());

    if (status) {
      inquiriesArr = inquiriesArr.filter(i => i.status === status);
    }

    return inquiriesArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  if (status) {
    return await db.select().from(contactInquiries)
      .where(eq(contactInquiries.status, status))
      .orderBy(desc(contactInquiries.createdAt));
  }
  return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
}

export async function updateInquiryStatus(id: string, status: string, notes?: string): Promise<ContactInquiry | undefined> {
  const updates: any = { status };
  if (notes) updates.adminNotes = notes;

  const result = await db.update(contactInquiries).set(updates).where(eq(contactInquiries.id, id)).returning();
  return result[0];
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const result = await db.delete(contactInquiries).where(eq(contactInquiries.id, id)).returning();
  return result.length > 0;
}

// =====================
// REVIEW OPERATIONS (Admin)
// =====================
export async function getAllReviews(status?: string): Promise<ProductReview[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let reviewsArr = Array.from(jsonReviews.values());

    if (status) {
      reviewsArr = reviewsArr.filter(r => r.status === status);
    }

    return reviewsArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  if (status) {
    return await db.select().from(productReviews)
      .where(eq(productReviews.status, status))
      .orderBy(desc(productReviews.createdAt));
  }
  return await db.select().from(productReviews).orderBy(desc(productReviews.createdAt));
}

export async function updateReviewStatus(
  id: string,
  status: "approved" | "rejected",
  adminReply?: string,
  adminId?: string
): Promise<ProductReview | undefined> {
  const updates: any = { status, updatedAt: new Date() };
  if (adminReply) {
    updates.adminReply = adminReply;
    updates.adminReplyBy = adminId;
    updates.adminReplyAt = new Date();
  }

  const result = await db.update(productReviews).set(updates).where(eq(productReviews.id, id)).returning();
  return result[0];
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = await db.delete(productReviews).where(eq(productReviews.id, id)).returning();
  return result.length > 0;
}

// =====================
// QUESTION OPERATIONS (Admin)
// =====================
export async function getAllQuestions(status?: string): Promise<ProductQuestion[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    let questionsArr = Array.from(jsonQuestions.values());

    if (status) {
      questionsArr = questionsArr.filter(q => q.status === status);
    }

    return questionsArr.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  if (status) {
    return await db.select().from(productQuestions)
      .where(eq(productQuestions.status, status))
      .orderBy(desc(productQuestions.createdAt));
  }
  return await db.select().from(productQuestions).orderBy(desc(productQuestions.createdAt));
}

export async function answerQuestion(
  id: string,
  answer: string,
  answeredBy: string
): Promise<ProductQuestion | undefined> {
  const result = await db.update(productQuestions)
    .set({
      answer,
      answeredBy,
      answeredAt: new Date(),
      status: "answered",
      updatedAt: new Date(),
    })
    .where(eq(productQuestions.id, id))
    .returning();
  return result[0];
}

export async function deleteQuestion(id: string): Promise<boolean> {
  const result = await db.delete(productQuestions).where(eq(productQuestions.id, id)).returning();
  return result.length > 0;
}

// =====================
// DASHBOARD STATS
// =====================
export async function getDashboardStats() {
  if (isJSONStorage) {
    loadAllJsonData();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const ordersArr = Array.from(jsonOrders.values());
    const usersArr = Array.from(jsonUsers.values());
    const productsArr = Array.from(jsonProducts.values());
    const reviewsArr = Array.from(jsonReviews.values());
    const orderItemsArr = Array.from(jsonOrderItems.values());

    // Calculate total sales from paid orders
    const paidOrders = ordersArr.filter(o => o.paymentStatus === "paid");
    const totalSales = paidOrders.reduce((sum, o) => sum + parseFloat(String(o.total || "0")), 0);

    // Today's orders
    const todayOrdersArr = ordersArr.filter(o => new Date(o.createdAt || 0) >= todayStart);
    const todayPaidOrders = todayOrdersArr.filter(o => o.paymentStatus === "paid");
    const todaySales = todayPaidOrders.reduce((sum, o) => sum + parseFloat(String(o.total || "0")), 0);

    // Weekly sales
    const weekPaidOrders = paidOrders.filter(o => new Date(o.createdAt || 0) >= weekStart);
    const weeklySales = weekPaidOrders.reduce((sum, o) => sum + parseFloat(String(o.total || "0")), 0);

    // Monthly sales
    const monthPaidOrders = paidOrders.filter(o => new Date(o.createdAt || 0) >= monthStart);
    const monthlySales = monthPaidOrders.reduce((sum, o) => sum + parseFloat(String(o.total || "0")), 0);

    // Recent orders (top 10)
    const recentOrders = ordersArr
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 10);

    // Top products by sales
    const productSales: Record<string, { productId: string; productName: string; totalSold: number; totalRevenue: number }> = {};
    orderItemsArr.forEach(item => {
      const product = jsonProducts.get(item.productId);
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          productId: item.productId,
          productName: product?.name || "Unknown",
          totalSold: 0,
          totalRevenue: 0,
        };
      }
      productSales[item.productId].totalSold += Number(item.quantity) || 0;
      productSales[item.productId].totalRevenue += (parseFloat(String(item.price || "0")) * (Number(item.quantity) || 1));
    });
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10);

    // Pending counts
    const pendingOrdersCount = ordersArr.filter(o => o.status === "pending").length;
    const pendingReviewsCount = reviewsArr.filter(r => r.status === "pending").length;

    return {
      totalOrders: ordersArr.length,
      totalUsers: usersArr.length,
      totalProducts: productsArr.length,
      totalSales,
      todayOrders: todayOrdersArr.length,
      todaySales,
      weeklySales,
      monthlySales,
      recentOrders,
      topProducts,
      pendingOrders: pendingOrdersCount,
      pendingReviews: pendingReviewsCount,
    };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total stats
  const totalOrders = await db.select({ count: count() }).from(orders);
  const totalUsers = await db.select({ count: count() }).from(users);
  const totalProducts = await db.select({ count: count() }).from(products);
  const totalSales = await db.select({ total: sum(orders.total) }).from(orders)
    .where(eq(orders.paymentStatus, "paid"));

  // Today's stats
  const todayOrders = await db.select({ count: count() }).from(orders)
    .where(gte(orders.createdAt, todayStart));
  const todaySales = await db.select({ total: sum(orders.total) }).from(orders)
    .where(and(
      gte(orders.createdAt, todayStart),
      eq(orders.paymentStatus, "paid")
    ));

  // Weekly stats
  const weeklySales = await db.select({ total: sum(orders.total) }).from(orders)
    .where(and(
      gte(orders.createdAt, weekStart),
      eq(orders.paymentStatus, "paid")
    ));

  // Monthly stats
  const monthlySales = await db.select({ total: sum(orders.total) }).from(orders)
    .where(and(
      gte(orders.createdAt, monthStart),
      eq(orders.paymentStatus, "paid")
    ));

  // Recent orders
  const recentOrders = await db.select().from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(10);

  // Top products by sales
  const topProducts = await db.select({
    productId: orderItems.productId,
    productName: products.name,
    totalSold: sum(orderItems.quantity),
    totalRevenue: sum(sql`CAST(${orderItems.price} AS DECIMAL) * ${orderItems.quantity}`),
  })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .groupBy(orderItems.productId, products.name)
    .orderBy(desc(sum(orderItems.quantity)))
    .limit(10);

  // Pending orders count
  const pendingOrders = await db.select({ count: count() }).from(orders)
    .where(eq(orders.status, "pending"));

  // Pending reviews count
  const pendingReviews = await db.select({ count: count() }).from(productReviews)
    .where(eq(productReviews.status, "pending"));

  return {
    totalOrders: totalOrders[0]?.count || 0,
    totalUsers: totalUsers[0]?.count || 0,
    totalProducts: totalProducts[0]?.count || 0,
    totalSales: parseFloat(totalSales[0]?.total || "0"),
    todayOrders: todayOrders[0]?.count || 0,
    todaySales: parseFloat(todaySales[0]?.total || "0"),
    weeklySales: parseFloat(weeklySales[0]?.total || "0"),
    monthlySales: parseFloat(monthlySales[0]?.total || "0"),
    recentOrders,
    topProducts,
    pendingOrders: pendingOrders[0]?.count || 0,
    pendingReviews: pendingReviews[0]?.count || 0,
  };
}

// =====================
// ACTIVITY LOG OPERATIONS
// =====================
export async function logActivity(data: any): Promise<ActivityLog | void> {
  if (!db) return;

  // Handle both old and new signatures
  if (data.email !== undefined) {
    // Old signature - data is InsertActivityLog
    const result = await db.insert(activityLogs).values(data).returning();
    return result[0];
  }

  // New signature - convert object to InsertActivityLog
  const activityData: InsertActivityLog = {
    userId: data.userId,
    userType: data.userType,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId || null,
    ipAddress: data.ipAddress || null,
    userAgent: data.userAgent || null,
    details: data.details || null,
    timestamp: new Date(),
  };

  const result = await db.insert(activityLogs).values(activityData).returning();
  return result[0];
}

export async function getActivityLogs(filters?: {
  userId?: string;
  userType?: string;
  action?: string;
  entityType?: string;
  limit?: number;
}): Promise<ActivityLog[]> {
  const conditions: any[] = [];

  if (filters?.userId) conditions.push(eq(activityLogs.userId, filters.userId));
  if (filters?.userType) conditions.push(eq(activityLogs.userType, filters.userType));
  if (filters?.action) conditions.push(eq(activityLogs.action, filters.action));
  if (filters?.entityType) conditions.push(eq(activityLogs.entityType, filters.entityType));

  let query = db.select().from(activityLogs);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query.orderBy(desc(activityLogs.createdAt)).limit(filters?.limit || 100);
}

// =====================
// COUPON OPERATIONS
// =====================
export async function getCoupons(): Promise<Coupon[]> {
  if (isJSONStorage) {
    loadAllJsonData();
    return Array.from(jsonCoupons.values()).sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }
  return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
}

export async function getCouponByCode(code: string): Promise<Coupon | undefined> {
  const result = await db.select().from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1);
  return result[0];
}

export async function createCoupon(coupon: InsertCoupon): Promise<Coupon> {
  const code = coupon.code.toUpperCase();

  if (isJSONStorage) {
    loadAllJsonData();
    const newCoupon: Coupon = {
      id: crypto.randomUUID(),
      code,
      description: coupon.description || null,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(), // Ensure string
      minOrderValue: coupon.minOrderValue ? coupon.minOrderValue.toString() : null,
      maxDiscount: coupon.maxDiscount ? coupon.maxDiscount.toString() : null,
      validFrom: coupon.validFrom || new Date(),
      validUntil: coupon.validUntil || null,
      usageLimit: coupon.usageLimit || null,
      usedCount: 0,
      isActive: coupon.isActive ?? true,
      createdBy: coupon.createdBy || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jsonCoupons.set(newCoupon.id, newCoupon);
    saveJsonFile("coupons.json", Array.from(jsonCoupons.values()));
    return newCoupon;
  }

  const result = await db.insert(coupons).values({
    ...coupon,
    code,
  }).returning();
  return result[0];
}

export async function updateCoupon(id: string, data: Partial<InsertCoupon>): Promise<Coupon | undefined> {
  const updateData: any = { ...data, updatedAt: new Date() };
  if (data.code) updateData.code = data.code.toUpperCase();

  const result = await db.update(coupons).set(updateData).where(eq(coupons.id, id)).returning();
  return result[0];
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const result = await db.delete(coupons).where(eq(coupons.id, id)).returning();
  return result.length > 0;
}

// =====================
// SEED DEFAULT ROLES
// =====================
export async function seedDefaultRoles(): Promise<void> {
  const defaultRoles = [
    {
      name: "super_admin",
      displayName: "Super Admin",
      description: "Full system access with all permissions",
      permissions: {
        products: true,
        orders: true,
        users: true,
        inquiries: true,
        reviews: true,
        questions: true,
        settings: true,
        salesDashboard: true,
        deliveryDashboard: true,
        manageAdmins: true,
        manageDelivery: true,
        manageRoles: true,
      },
    },
    {
      name: "admin",
      displayName: "Admin",
      description: "Administrative access without user management",
      permissions: {
        products: true,
        orders: true,
        users: true,
        inquiries: true,
        reviews: true,
        questions: true,
        settings: true,
        salesDashboard: true,
        deliveryDashboard: true,
        manageAdmins: false,
        manageDelivery: true,
        manageRoles: false,
      },
    },
    {
      name: "sales",
      displayName: "Sales",
      description: "Sales team with access to orders and sales reports",
      permissions: {
        products: false,
        orders: true,
        users: true,
        inquiries: true,
        reviews: false,
        questions: false,
        settings: false,
        salesDashboard: true,
        deliveryDashboard: false,
        manageAdmins: false,
        manageDelivery: false,
        manageRoles: false,
      },
    },
    {
      name: "delivery",
      displayName: "Delivery",
      description: "Delivery agent role (for reference)",
      permissions: {
        products: false,
        orders: false,
        users: false,
        inquiries: false,
        reviews: false,
        questions: false,
        settings: false,
        salesDashboard: false,
        deliveryDashboard: true,
        manageAdmins: false,
        manageDelivery: false,
        manageRoles: false,
      },
    },
  ];

  for (const role of defaultRoles) {
    const existing = await getRoleByName(role.name);
    if (!existing) {
      await createRole(role);
    }
  }
}

// =====================
// SEED DEFAULT SUPER ADMIN
// =====================
export async function seedDefaultSuperAdmin(): Promise<void> {
  if (isJSONStorage) {
    // In JSON storage mode, we check if the file exists and has users
    loadAdminData();
    if (jsonAdminUsers.size === 0) {
      const superAdminEmail = "admin@liminara.com";
      const superAdminRole = await getRoleByName("super_admin");

      if (superAdminRole) {
        const passwordHash = await bcrypt.hash("admin123", 10);
        const newUser: AdminUser = {
          id: crypto.randomUUID(),
          email: superAdminEmail,
          username: "admin",
          name: "Super Admin",
          firstName: "Super",
          lastName: "Admin",
          phone: null,
          profileImageUrl: null,
          passwordHash,
          roleId: superAdminRole.id,
          isActive: true,
          mustChangePassword: false,
          loginAttempts: 0,
          lockedUntil: null,
          lastLogin: null,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        jsonAdminUsers.set(newUser.id, newUser);
        saveAdminData();
        console.log("✅ Default super admin created in JSON storage");
      }
    }
    return;
  }

  const superAdminEmail = "ganeshkale030303@gmail.com";
  const existing = await getAdminUserByEmail(superAdminEmail);

  if (!existing) {
    const superAdminRole = await getRoleByName("super_admin");
    if (superAdminRole && db) {
      await db.insert(adminUsers).values({
        email: superAdminEmail,
        username: "superadmin",
        name: "Super Admin",
        firstName: "Super",
        lastName: "Admin",
        passwordHash: await bcrypt.hash("Admin@123", 10),
        roleId: superAdminRole.id,
        isActive: true,
        mustChangePassword: true,
      });
    }
  }
}