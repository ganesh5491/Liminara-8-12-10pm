import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import * as AdminStorage from "./admin-storage";
import { isJSONStorage } from "./db";
import { z } from "zod";

// Extend session type
declare module "express-session" {
  interface SessionData {
    adminUser?: {
      id: string;
      email: string;
      name: string;
      roleId: string | null;
      permissions: Record<string, boolean>;
    };
    deliveryAgent?: {
      id: string;
      email: string;
      name: string;
    };
  }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "public/uploads/products";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Email transporter
function createEmailTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Send order status update email
async function sendOrderStatusEmail(order: any, status: string, deliveryAgent?: any) {
  try {
    const transporter = createEmailTransporter();
    if (!process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
      console.log("SMTP not configured, skipping email notification");
      return;
    }

    const statusMessages: Record<string, string> = {
      pending: "Your order is being reviewed.",
      confirmed: "Great news! Your order has been confirmed and is being processed.",
      packed: "Your order has been carefully packed and is ready for shipping.",
      shipped: "Your order is on its way! It has been shipped.",
      out_for_delivery: "Your order is out for delivery. It will arrive soon!",
      delivered: "Your order has been delivered successfully. Thank you for shopping with us!",
      cancelled: "Your order has been cancelled. If you have any questions, please contact us.",
    };

    let deliveryInfo = "";
    if (deliveryAgent && ["shipped", "out_for_delivery"].includes(status)) {
      deliveryInfo = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0 0 10px;">Delivery Agent Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${deliveryAgent.name}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${deliveryAgent.phone}</p>
          ${deliveryAgent.email ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${deliveryAgent.email}</p>` : ""}
        </div>
      `;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">IndoSaga</h1>
        </div>
        <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear ${order.customerName || "Customer"},</p>
          <p>${statusMessages[status] || `Your order status has been updated to: ${status}`}</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> #${order.orderNumber || order.id?.slice(0, 8)}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #8b5cf6; font-weight: bold;">${status.replace(/_/g, " ").toUpperCase()}</span></p>
          </div>
          
          ${deliveryInfo}
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px; color: #666;">
            Thank you for shopping with IndoSaga!<br>
            <strong>The IndoSaga Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: order.customerEmail,
      subject: `Order #${order.orderNumber || order.id?.slice(0, 8)} - Status Update: ${status.replace(/_/g, " ").toUpperCase()}`,
      html: emailHtml,
    });

    console.log(`Order status email sent to ${order.customerEmail} for order ${order.id}`);
  } catch (error) {
    console.error("Failed to send order status email:", error);
  }
}

// Middleware to check admin authentication
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminUser) {
    return res.status(401).json({ message: "Unauthorized - Admin login required" });
  }
  next();
}

// Middleware to check specific permission
function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.adminUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.session.adminUser.permissions[permission]) {
      return res.status(403).json({ message: "Access denied - Insufficient permissions" });
    }
    next();
  };
}

// Middleware to check delivery agent authentication
function requireDeliveryAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.deliveryAgent) {
    return res.status(401).json({ message: "Unauthorized - Delivery agent login required" });
  }
  next();
}

export function registerAdminRoutes(app: Express) {
  // Initialize default roles and super admin (skip super admin creation in JSON mode)
  (async () => {
    try {
      await AdminStorage.seedDefaultRoles();
      console.log("✅ Admin roles initialized");

      // Seed super admin (works for both DB and JSON storage now)
      await AdminStorage.seedDefaultSuperAdmin();
      console.log("✅ Super admin initialized");
    } catch (error) {
      console.error("Failed to initialize admin system:", error);
    }
  })();

  // =====================
  // ADMIN AUTHENTICATION
  // =====================

  // Admin login
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Check if account is locked
      const user = await AdminStorage.getAdminUserByEmail(email);
      if (user?.lockedUntil && new Date(user.lockedUntil) > new Date()) {
        const remainingTime = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
        return res.status(423).json({
          message: `Account locked. Try again in ${remainingTime} minutes.`
        });
      }

      const adminUser = await AdminStorage.verifyAdminPassword(email, password);

      if (!adminUser) {
        await AdminStorage.incrementLoginAttempts(email);
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!adminUser.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      // Get role permissions
      let permissions: Record<string, boolean> = {};
      if (adminUser.roleId) {
        const role = await AdminStorage.getRoleById(adminUser.roleId);
        if (role?.permissions) {
          permissions = role.permissions as Record<string, boolean>;
        }
      }

      // Set session
      req.session.adminUser = {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        roleId: adminUser.roleId,
        permissions,
      };

      // Log activity
      await AdminStorage.logActivity({
        userId: adminUser.id,
        userType: "admin",
        action: "login",
        entityType: "session",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      res.json({
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          mustChangePassword: adminUser.mustChangePassword,
          permissions,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/auth/logout", requireAdminAuth, async (req, res) => {
    try {
      if (req.session.adminUser) {
        await AdminStorage.logActivity({
          userId: req.session.adminUser.id,
          userType: "admin",
          action: "logout",
          entityType: "session",
        });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get current admin user
  app.get("/api/admin/auth/me", requireAdminAuth, async (req, res) => {
    try {
      const user = await AdminStorage.getAdminUserById(req.session.adminUser!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let role = null;
      if (user.roleId) {
        role = await AdminStorage.getRoleById(user.roleId);
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
        mustChangePassword: user.mustChangePassword,
        role: role ? { name: role.name, displayName: role.displayName } : null,
        permissions: req.session.adminUser!.permissions,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Change password
  app.post("/api/admin/auth/change-password", requireAdminAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters" });
      }

      // Verify current password
      const user = await AdminStorage.verifyAdminPassword(
        req.session.adminUser!.email,
        currentPassword
      );

      if (!user) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Update password
      await AdminStorage.updateAdminUser(user.id, {
        passwordHash: newPassword,
        mustChangePassword: false,
      });

      await AdminStorage.logActivity({
        userId: user.id,
        userType: "admin",
        action: "password_change",
        entityType: "admin_user",
        entityId: user.id,
      });

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Forgot password
  app.post("/api/admin/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await AdminStorage.getAdminUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return res.json({ success: true, message: "If the email exists, a reset email will be sent" });
      }

      // Create reset token
      const { temporaryPassword } = await AdminStorage.createPasswordResetToken(email, "admin");

      // Send email - for admin, always send to ganeshkale030303@gmail.com
      const recipientEmail = "ganeshkale030303@gmail.com";

      if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
        const transporter = createEmailTransporter();
        await transporter.sendMail({
          from: `"Liminara Admin" <${process.env.SMTP_USERNAME}>`,
          to: recipientEmail,
          subject: "Password Reset - Liminara Admin",
          html: `
            <h2>Password Reset Request</h2>
            <p>A password reset was requested for admin account: ${email}</p>
            <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
            <p>This password expires in 10 minutes.</p>
            <p>After logging in with this temporary password, you will be required to change it.</p>
          `,
        });
      }

      await AdminStorage.logActivity({
        userId: user.id,
        userType: "admin",
        action: "forgot_password",
        entityType: "admin_user",
        entityId: user.id,
      });

      res.json({ success: true, message: "If the email exists, a reset email will be sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Login with temporary password
  app.post("/api/admin/auth/login-temp", async (req, res) => {
    try {
      const { email, temporaryPassword } = req.body;

      const isValid = await AdminStorage.verifyTemporaryPassword(email, temporaryPassword, "admin");
      if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired temporary password" });
      }

      const user = await AdminStorage.getAdminUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Force password change
      await AdminStorage.updateAdminUser(user.id, { mustChangePassword: true });

      // Get role permissions
      let permissions: Record<string, boolean> = {};
      if (user.roleId) {
        const role = await AdminStorage.getRoleById(user.roleId);
        if (role?.permissions) {
          permissions = role.permissions as Record<string, boolean>;
        }
      }

      req.session.adminUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        permissions,
      };

      res.json({
        success: true,
        mustChangePassword: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          permissions,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // =====================
  // DASHBOARD
  // =====================

  app.get("/api/admin/dashboard/stats", requireAdminAuth, async (req, res) => {
    try {
      const stats = await AdminStorage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // =====================
  // ROLES MANAGEMENT
  // =====================

  app.get("/api/admin/roles", requireAdminAuth, requirePermission("manageRoles"), async (req, res) => {
    try {
      const roles = await AdminStorage.getRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get roles" });
    }
  });

  app.post("/api/admin/roles", requireAdminAuth, requirePermission("manageRoles"), async (req, res) => {
    try {
      const role = await AdminStorage.createRole(req.body);
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put("/api/admin/roles/:id", requireAdminAuth, requirePermission("manageRoles"), async (req, res) => {
    try {
      const role = await AdminStorage.updateRole(req.params.id, req.body);
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete("/api/admin/roles/:id", requireAdminAuth, requirePermission("manageRoles"), async (req, res) => {
    try {
      await AdminStorage.deleteRole(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete role" });
    }
  });

  // =====================
  // ADMIN USERS MANAGEMENT
  // =====================

  app.get("/api/admin/users/admins", requireAdminAuth, requirePermission("manageAdmins"), async (req, res) => {
    try {
      const admins = await AdminStorage.getAdminUsers();
      res.json(admins.map(a => ({
        ...a,
        passwordHash: undefined, // Don't send password hash
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to get admin users" });
    }
  });

  app.post("/api/admin/users/admins", requireAdminAuth, requirePermission("manageAdmins"), async (req, res) => {
    try {
      const { email, name, firstName, lastName, phone, password, roleId } = req.body;

      // Check if email already exists
      const existing = await AdminStorage.getAdminUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const admin = await AdminStorage.createAdminUser({
        email,
        name,
        firstName,
        lastName,
        phone,
        passwordHash: password,
        roleId,
        createdBy: req.session.adminUser!.id,
        mustChangePassword: true,
      });

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "create",
        entityType: "admin_user",
        entityId: admin.id,
        details: { email },
      });

      res.json({ ...admin, passwordHash: undefined });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  app.post("/api/admin/users/admins", requireAdminAuth, requirePermission("manageAdmins"), async (req, res) => {
    try {
      const existing = await AdminStorage.getAdminUserByEmail(req.body.email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const admin = await AdminStorage.createAdminUser({
        ...req.body,
        passwordHash: req.body.password,
      });

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "create",
        entityType: "admin_user",
        entityId: admin.id,
      });

      res.json({ ...admin, passwordHash: undefined });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  app.put("/api/admin/users/admins/:id", requireAdminAuth, requirePermission("manageAdmins"), async (req, res) => {
    try {
      const updates: any = { ...req.body };
      if (updates.password) {
        updates.passwordHash = updates.password;
        delete updates.password;
      }

      const admin = await AdminStorage.updateAdminUser(req.params.id, updates);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "update",
        entityType: "admin_user",
        entityId: req.params.id,
      });

      res.json({ ...admin, passwordHash: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to update admin user" });
    }
  });

  app.delete("/api/admin/users/admins/:id", requireAdminAuth, requirePermission("manageAdmins"), async (req, res) => {
    try {
      // Can't delete yourself
      if (req.params.id === req.session.adminUser!.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }

      await AdminStorage.deleteAdminUser(req.params.id);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "delete",
        entityType: "admin_user",
        entityId: req.params.id,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete admin user" });
    }
  });

  // =====================
  // DELIVERY AGENTS MANAGEMENT
  // =====================

  app.get("/api/admin/delivery-agents", requireAdminAuth, requirePermission("manageDelivery"), async (req, res) => {
    try {
      const agents = await AdminStorage.getDeliveryAgents();
      res.json(agents.map(a => ({
        ...a,
        passwordHash: undefined,
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to get delivery agents" });
    }
  });

  app.get("/api/admin/delivery-agents/available", requireAdminAuth, async (req, res) => {
    try {
      const agents = await AdminStorage.getAvailableDeliveryAgents();
      res.json(agents.map(a => ({
        id: a.id,
        name: a.name,
        phone: a.phone,
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to get available delivery agents" });
    }
  });

  app.post("/api/admin/delivery-agents", requireAdminAuth, requirePermission("manageDelivery"), async (req, res) => {
    try {
      const existing = await AdminStorage.getDeliveryAgentByEmail(req.body.email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const agent = await AdminStorage.createDeliveryAgent({
        ...req.body,
        passwordHash: req.body.password,
        mustChangePassword: true,
      });

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "create",
        entityType: "delivery_agent",
        entityId: agent.id,
      });

      res.json({ ...agent, passwordHash: undefined });
    } catch (error) {
      console.error("Create delivery agent error:", error);
      res.status(500).json({ message: "Failed to create delivery agent" });
    }
  });

  app.put("/api/admin/delivery-agents/:id", requireAdminAuth, requirePermission("manageDelivery"), async (req, res) => {
    try {
      const updates: any = { ...req.body };
      if (updates.password) {
        updates.passwordHash = updates.password;
        delete updates.password;
      }

      const agent = await AdminStorage.updateDeliveryAgent(req.params.id, updates);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "update",
        entityType: "delivery_agent",
        entityId: req.params.id,
      });

      res.json({ ...agent, passwordHash: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to update delivery agent" });
    }
  });

  app.delete("/api/admin/delivery-agents/:id", requireAdminAuth, requirePermission("manageDelivery"), async (req, res) => {
    try {
      await AdminStorage.deleteDeliveryAgent(req.params.id);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "delete",
        entityType: "delivery_agent",
        entityId: req.params.id,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete delivery agent" });
    }
  });

  // =====================
  // ORDERS MANAGEMENT
  // =====================

  app.get("/api/admin/orders", requireAdminAuth, requirePermission("orders"), async (req, res) => {
    try {
      const { status, search, startDate, endDate, deliveryAgentId } = req.query;
      const orders = await AdminStorage.getAllOrders({
        status: status as string,
        search: search as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        deliveryAgentId: deliveryAgentId as string,
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  app.get("/api/admin/orders/:id", requireAdminAuth, requirePermission("orders"), async (req, res) => {
    try {
      const order = await AdminStorage.getOrderWithDetails(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order" });
    }
  });

  app.put("/api/admin/orders/:id/status", requireAdminAuth, requirePermission("orders"), async (req, res) => {
    try {
      const { status, notes } = req.body;
      const order = await AdminStorage.updateOrderStatus(
        req.params.id,
        status,
        req.session.adminUser!.id,
        "admin",
        notes
      );

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "update_status",
        entityType: "order",
        entityId: req.params.id,
        details: { status },
      });

      // Send email notification to customer
      if (order) {
        let deliveryAgent = null;
        if (order.deliveryAgentId) {
          deliveryAgent = await AdminStorage.getDeliveryAgentById(order.deliveryAgentId);
        }
        sendOrderStatusEmail(order, status, deliveryAgent);
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  app.put("/api/admin/orders/:id/assign-delivery", requireAdminAuth, requirePermission("orders"), async (req, res) => {
    try {
      const { deliveryAgentId } = req.body;
      const order = await AdminStorage.assignDeliveryAgent(
        req.params.id,
        deliveryAgentId,
        req.session.adminUser!.id
      );

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "assign_delivery",
        entityType: "order",
        entityId: req.params.id,
        details: { deliveryAgentId },
      });

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to assign delivery agent" });
    }
  });

  // =====================
  // PRODUCTS MANAGEMENT
  // =====================

  app.get("/api/admin/products", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const { search, categoryId, isPublished } = req.query;
      const products = await AdminStorage.getAllProducts({
        search: search as string,
        categoryId: categoryId as string,
        isPublished: isPublished === "true" ? true : isPublished === "false" ? false : undefined,
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.post("/api/admin/products", requireAdminAuth, requirePermission("products"), upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const images = files?.map(f => `/uploads/products/${f.filename}`) || [];

      const productData = {
        ...req.body,
        images,
        imageUrl: images[0] || req.body.imageUrl || null,
        price: req.body.price,
        originalPrice: req.body.originalPrice || null,
        stock: parseInt(req.body.stock) || 0,
        featured: req.body.featured === "true" || req.body.featured === true,
        isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
        isDeal: req.body.isDeal === "true" || req.body.isDeal === true,
        // Parsed JSON fields
        specifications: typeof req.body.specifications === 'string'
          ? JSON.parse(req.body.specifications)
          : req.body.specifications || {},
        variants: typeof req.body.variants === 'string'
          ? JSON.parse(req.body.variants)
          : req.body.variants || [],
        tags: typeof req.body.tags === 'string'
          ? JSON.parse(req.body.tags)
          : req.body.tags || [],
      };

      const product = await AdminStorage.createProduct(productData);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "create",
        entityType: "product",
        entityId: product.id,
        details: { name: product.name },
      });

      res.json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", requireAdminAuth, requirePermission("products"), upload.array("images", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const newImages = files?.map(f => `/uploads/products/${f.filename}`) || [];

      const updates: any = {
        ...req.body,
      };

      // Handle images: combines existing (parsed from JSON) + new uploads
      let finalImages: string[] = [];
      if (req.body.existingImages) {
        try {
          const existing = typeof req.body.existingImages === 'string'
            ? JSON.parse(req.body.existingImages)
            : req.body.existingImages;
          if (Array.isArray(existing)) {
            finalImages = [...existing];
          }
        } catch (e) {
          console.error("Error parsing existingImages:", e);
        }
      }

      if (newImages.length > 0) {
        finalImages = [...finalImages, ...newImages];
      }

      // Only update images if we have some handling here, otherwise keep existing if not mentioned? 
      // Usually if existingImages is sent, we replace the list.
      if (req.body.existingImages || newImages.length > 0) {
        updates.images = finalImages;
        updates.imageUrl = finalImages[0] || null;
      }

      // Handle JSON fields
      if (req.body.specifications) {
        updates.specifications = typeof req.body.specifications === 'string'
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
      }
      if (req.body.variants) {
        updates.variants = typeof req.body.variants === 'string'
          ? JSON.parse(req.body.variants)
          : req.body.variants;
      }
      if (req.body.tags) {
        updates.tags = typeof req.body.tags === 'string'
          ? JSON.parse(req.body.tags)
          : req.body.tags;
      }

      // Handle numeric and boolean fields
      if (updates.stock !== undefined) updates.stock = parseInt(updates.stock);
      if (updates.featured !== undefined) updates.featured = updates.featured === "true" || updates.featured === true;
      if (updates.isPublished !== undefined) updates.isPublished = updates.isPublished === "true" || updates.isPublished === true;
      if (updates.isDeal !== undefined) updates.isDeal = updates.isDeal === "true" || updates.isDeal === true;

      const product = await AdminStorage.updateProduct(req.params.id, updates);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "update",
        entityType: "product",
        entityId: req.params.id,
        details: { name: product?.name },
      });

      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      await AdminStorage.deleteProduct(req.params.id);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "delete",
        entityType: "product",
        entityId: req.params.id,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.put("/api/admin/products/:id/toggle-publish", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const product = await AdminStorage.toggleProductPublished(req.params.id);

      await AdminStorage.logActivity({
        userId: req.session.adminUser!.id,
        userType: "admin",
        action: "toggle_publish",
        entityType: "product",
        entityId: req.params.id,
        details: { isPublished: product?.isPublished },
      });

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle product publish status" });
    }
  });

  // =====================
  // CATEGORIES MANAGEMENT
  // =====================

  app.get("/api/admin/categories", requireAdminAuth, async (req, res) => {
    try {
      const categories = await AdminStorage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get categories" });
    }
  });

  app.post("/api/admin/categories", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const category = await AdminStorage.createCategory(req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const category = await AdminStorage.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      await AdminStorage.deleteCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // =====================
  // USERS MANAGEMENT
  // =====================

  app.get("/api/admin/users", requireAdminAuth, requirePermission("users"), async (req, res) => {
    try {
      const { search } = req.query;
      const users = await AdminStorage.getAllUsers({ search: search as string });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.get("/api/admin/users/:id", requireAdminAuth, requirePermission("users"), async (req, res) => {
    try {
      const user = await AdminStorage.getUserWithStats(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Alias route for customers (same as users)
  app.get("/api/admin/customers", requireAdminAuth, async (req, res) => {
    try {
      const { search } = req.query;
      const users = await AdminStorage.getAllUsers({ search: search as string });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get customers" });
    }
  });

  app.get("/api/admin/customers/:id", requireAdminAuth, async (req, res) => {
    try {
      const user = await AdminStorage.getUserWithStats(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get customer" });
    }
  });

  app.post("/api/admin/customers", requireAdminAuth, async (req, res) => {
    try {
      const { name, email, phone, address, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }
      const customer = await AdminStorage.createUser({
        name,
        email,
        phone: phone || null,
        address: address || null,
        password,
      });
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create customer" });
    }
  });

  app.put("/api/admin/customers/:id", requireAdminAuth, async (req, res) => {
    try {
      const { name, phone, address } = req.body;
      const customer = await AdminStorage.updateUser(req.params.id, {
        name,
        phone,
        address,
      });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update customer" });
    }
  });

  app.delete("/api/admin/customers/:id", requireAdminAuth, async (req, res) => {
    try {
      const success = await AdminStorage.deleteUser(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to delete customer" });
    }
  });

  // =====================
  // INQUIRIES MANAGEMENT
  // =====================

  app.get("/api/admin/inquiries", requireAdminAuth, requirePermission("inquiries"), async (req, res) => {
    try {
      const { status } = req.query;
      const inquiries = await AdminStorage.getAllInquiries(status as string);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to get inquiries" });
    }
  });

  app.put("/api/admin/inquiries/:id", requireAdminAuth, requirePermission("inquiries"), async (req, res) => {
    try {
      const { status, notes } = req.body;
      const inquiry = await AdminStorage.updateInquiryStatus(req.params.id, status, notes);
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  app.delete("/api/admin/inquiries/:id", requireAdminAuth, requirePermission("inquiries"), async (req, res) => {
    try {
      await AdminStorage.deleteInquiry(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete inquiry" });
    }
  });

  // =====================
  // REVIEWS MANAGEMENT
  // =====================

  app.get("/api/admin/reviews", requireAdminAuth, requirePermission("reviews"), async (req, res) => {
    try {
      const { status } = req.query;
      const reviews = await AdminStorage.getAllReviews(status as string);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to get reviews" });
    }
  });

  app.put("/api/admin/reviews/:id", requireAdminAuth, requirePermission("reviews"), async (req, res) => {
    try {
      const { status, adminReply } = req.body;
      const review = await AdminStorage.updateReviewStatus(
        req.params.id,
        status,
        adminReply,
        req.session.adminUser!.id
      );
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/admin/reviews/:id", requireAdminAuth, requirePermission("reviews"), async (req, res) => {
    try {
      await AdminStorage.deleteReview(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // =====================
  // QUESTIONS MANAGEMENT
  // =====================

  app.get("/api/admin/questions", requireAdminAuth, requirePermission("questions"), async (req, res) => {
    try {
      const { status } = req.query;
      const questions = await AdminStorage.getAllQuestions(status as string);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get questions" });
    }
  });

  app.put("/api/admin/questions/:id/answer", requireAdminAuth, requirePermission("questions"), async (req, res) => {
    try {
      const { answer } = req.body;
      const question = await AdminStorage.answerQuestion(
        req.params.id,
        answer,
        req.session.adminUser!.name
      );
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to answer question" });
    }
  });

  app.delete("/api/admin/questions/:id", requireAdminAuth, requirePermission("questions"), async (req, res) => {
    try {
      await AdminStorage.deleteQuestion(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete question" });
    }
  });

  // =====================
  // COUPONS MANAGEMENT
  // =====================

  app.get("/api/admin/coupons", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const coupons = await AdminStorage.getCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Failed to get coupons" });
    }
  });

  app.post("/api/admin/coupons", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const coupon = await AdminStorage.createCoupon({
        ...req.body,
        createdBy: req.session.adminUser!.id,
      });
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Failed to create coupon" });
    }
  });

  app.put("/api/admin/coupons/:id", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      const coupon = await AdminStorage.updateCoupon(req.params.id, req.body);
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });

  app.delete("/api/admin/coupons/:id", requireAdminAuth, requirePermission("products"), async (req, res) => {
    try {
      await AdminStorage.deleteCoupon(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });

  // =====================
  // ACTIVITY LOGS
  // =====================

  app.get("/api/admin/activity-logs", requireAdminAuth, requirePermission("settings"), async (req, res) => {
    try {
      const { userId, userType, action, entityType, limit } = req.query;
      const logs = await AdminStorage.getActivityLogs({
        userId: userId as string,
        userType: userType as string,
        action: action as string,
        entityType: entityType as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get activity logs" });
    }
  });

  // =====================
  // DELIVERY AGENT PORTAL
  // =====================

  // Delivery agent login
  app.post("/api/delivery/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const agent = await AdminStorage.verifyDeliveryAgentPassword(email, password);

      if (!agent) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.deliveryAgent = {
        id: agent.id,
        email: agent.email,
        name: agent.name,
      };

      res.json({
        success: true,
        agent: {
          id: agent.id,
          email: agent.email,
          name: agent.name,
          mustChangePassword: agent.mustChangePassword,
        },
      });
    } catch (error) {
      console.error("Delivery login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Delivery agent logout
  app.post("/api/delivery/auth/logout", requireDeliveryAuth, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current delivery agent
  app.get("/api/delivery/auth/me", requireDeliveryAuth, async (req, res) => {
    try {
      const agent = await AdminStorage.getDeliveryAgentById(req.session.deliveryAgent!.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json({
        id: agent.id,
        email: agent.email,
        name: agent.name,
        phone: agent.phone,
        profileImageUrl: agent.profileImageUrl,
        totalDeliveries: agent.totalDeliveries,
        completedDeliveries: agent.completedDeliveries,
        cancelledDeliveries: agent.cancelledDeliveries,
        rating: agent.rating,
        earnings: agent.earnings,
        mustChangePassword: agent.mustChangePassword,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get agent info" });
    }
  });

  // Change delivery agent password
  app.post("/api/delivery/auth/change-password", requireDeliveryAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const agent = await AdminStorage.verifyDeliveryAgentPassword(
        req.session.deliveryAgent!.email,
        currentPassword
      );

      if (!agent) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      await AdminStorage.updateDeliveryAgent(agent.id, {
        passwordHash: newPassword,
        mustChangePassword: false,
      });

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Update delivery agent profile
  app.put("/api/delivery/profile", requireDeliveryAuth, async (req, res) => {
    try {
      const { name, phone, vehicleType, vehicleNumber } = req.body;
      const agentId = req.session.deliveryAgent!.id;

      const updatedAgent = await AdminStorage.updateDeliveryAgent(agentId, {
        name,
        phone,
        vehicleType,
        vehicleNumber,
      });

      if (!updatedAgent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      // Update session data
      req.session.deliveryAgent = {
        ...req.session.deliveryAgent!,
        name: updatedAgent.name,
      };

      res.json(updatedAgent);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update profile" });
    }
  });

  // Delivery agent forgot password
  app.post("/api/delivery/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      const agent = await AdminStorage.getDeliveryAgentByEmail(email);
      if (!agent) {
        return res.json({ success: true, message: "If the email exists, a reset email will be sent" });
      }

      const { temporaryPassword } = await AdminStorage.createPasswordResetToken(email, "delivery");

      if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
        const transporter = createEmailTransporter();
        await transporter.sendMail({
          from: `"Liminara Delivery" <${process.env.SMTP_USERNAME}>`,
          to: email,
          subject: "Password Reset - Liminara Delivery",
          html: `
            <h2>Password Reset Request</h2>
            <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
            <p>This password expires in 10 minutes.</p>
          `,
        });
      }

      res.json({ success: true, message: "If the email exists, a reset email will be sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Get delivery agent orders
  app.get("/api/delivery/orders", requireDeliveryAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const orders = await AdminStorage.getDeliveryAgentOrders(
        req.session.deliveryAgent!.id,
        status as string
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to get orders" });
    }
  });

  // Get delivery order details
  app.get("/api/delivery/orders/:id", requireDeliveryAuth, async (req, res) => {
    try {
      const order = await AdminStorage.getOrderWithDetails(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Verify this order is assigned to this agent
      if (order.deliveryAgentId !== req.session.deliveryAgent!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to get order" });
    }
  });

  // Update delivery status
  app.put("/api/delivery/orders/:id/status", requireDeliveryAuth, async (req, res) => {
    try {
      const { status, notes, location } = req.body;

      // Verify order belongs to this agent
      const order = await AdminStorage.getOrderWithDetails(req.params.id);
      if (!order || order.deliveryAgentId !== req.session.deliveryAgent!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedOrder = await AdminStorage.updateDeliveryStatus(
        req.params.id,
        status,
        req.session.deliveryAgent!.id,
        notes,
        location
      );

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update delivery status" });
    }
  });

  // Get delivery statistics
  app.get("/api/delivery/stats", requireDeliveryAuth, async (req, res) => {
    try {
      const agent = await AdminStorage.getDeliveryAgentById(req.session.deliveryAgent!.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const pendingOrders = await AdminStorage.getDeliveryAgentOrders(agent.id, "assigned");
      const inProgressOrders = await AdminStorage.getDeliveryAgentOrders(agent.id, "picked_up");

      res.json({
        totalDeliveries: agent.totalDeliveries,
        completedDeliveries: agent.completedDeliveries,
        cancelledDeliveries: agent.cancelledDeliveries,
        pendingOrders: pendingOrders.length,
        inProgressOrders: inProgressOrders.length,
        rating: agent.rating,
        earnings: agent.earnings,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get statistics" });
    }
  });

  console.log("✅ Admin and Delivery routes registered");
}
