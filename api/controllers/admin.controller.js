/**
 * Admin Controller
 * Handles admin authentication, dashboard stats, and management
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// File paths for data storage
const adminsFile = path.join(__dirname, '../../data/adminUsers.json');
const usersFile = path.join(__dirname, '../../data/users.json');
const productsFile = path.join(__dirname, '../../data/products.json');
const ordersFile = path.join(__dirname, '../../data/orders.json');
const reviewsFile = path.join(__dirname, '../../data/productReviews.json');
const inquiriesFile = path.join(__dirname, '../../data/contactInquiries.json');
const questionsFile = path.join(__dirname, '../../data/productQuestions.json');

// Initialize files if they don't exist
const initializeFiles = () => {
  const filesToCheck = [adminsFile, usersFile, productsFile, ordersFile, reviewsFile, inquiriesFile, questionsFile];
  
  filesToCheck.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify([], null, 2));
    }
  });
};

// Read JSON file safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write JSON file safely
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Initialize admin accounts if empty
const initializeAdminAccounts = () => {
  initializeFiles();
  const admins = readJSON(adminsFile);
  
  if (admins.length === 0) {
    const defaultAdmin = {
      id: '1',
      email: 'admin@liminara.com',
      password: bcrypt.hashSync('admin123', 10),
      firstName: 'Liminara',
      lastName: 'Admin',
      phone: '9876543210',
      role: 'admin',
      permissions: {
        products: true,
        orders: true,
        users: true,
        inquiries: true,
        reviews: true,
        questions: true,
        manageDelivery: true,
        manageAdmins: true,
        settings: true,
        salesDashboard: true,
      },
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    };
    writeJSON(adminsFile, [defaultAdmin]);
    console.log('✅ Default admin created: admin@liminara.com / admin123');
  }
};

// Admin login
exports.login = async (req, res) => {
  try {
    initializeAdminAccounts();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admins = readJSON(adminsFile);
    const admin = admins.find(a => a.email === email);

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set session/cookie
    req.session.adminId = admin.id;
    req.session.isAdmin = true;

    const response = {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      role: admin.role,
      permissions: admin.permissions,
      mustChangePassword: admin.mustChangePassword || false,
    };

    res.json({
      message: 'Login successful',
      user: response,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get current admin
exports.getCurrentAdmin = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const admins = readJSON(adminsFile);
    const admin = admins.find(a => a.id === req.session.adminId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      role: admin.role,
      permissions: admin.permissions,
      mustChangePassword: admin.mustChangePassword || false,
    });
  } catch (error) {
    console.error('Get current admin error:', error);
    res.status(500).json({ message: 'Error fetching admin' });
  }
};

// Admin logout
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords required' });
    }

    const admins = readJSON(adminsFile);
    const adminIndex = admins.findIndex(a => a.id === req.session.adminId);

    if (adminIndex === -1) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = admins[adminIndex];

    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    admin.password = bcrypt.hashSync(newPassword, 10);
    admin.mustChangePassword = false;
    writeJSON(adminsFile, admins);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Password change failed' });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const users = readJSON(usersFile);
    const products = readJSON(productsFile);
    const orders = readJSON(ordersFile);
    const reviews = readJSON(reviewsFile);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const calculateSales = (orderList) => {
      return orderList.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    };

    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    };

    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const weeklyOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= weekStart && orderDate <= weekEnd;
    });

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const monthlyOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= monthStart && orderDate <= monthEnd;
    });

    const totalSales = calculateSales(orders);
    const todaySales = calculateSales(todayOrders);
    const weeklySales = calculateSales(weeklyOrders);
    const monthlySales = calculateSales(monthlyOrders);

    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;

    res.json({
      totalOrders: orders.length,
      totalUsers: users.length,
      totalProducts: products.length,
      totalSales,
      todayOrders: todayOrders.length,
      todaySales,
      weeklySales,
      monthlySales,
      pendingOrders,
      pendingReviews,
      recentOrders: orders.slice(-10).reverse(),
      topProducts: products.slice(0, 5),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

// Admin users list
exports.getAdminUsers = async (req, res) => {
  try {
    initializeAdminAccounts();
    const admins = readJSON(adminsFile);
    
    const adminList = admins.map(admin => ({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      phone: admin.phone,
      role: admin.role,
      createdAt: admin.createdAt,
    }));

    res.json(adminList);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Error fetching admin users' });
  }
};

// Add admin user
exports.addAdminUser = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { email, password, firstName, lastName, phone, role, permissions } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const admins = readJSON(adminsFile);

    if (admins.find(a => a.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newAdmin = {
      id: Date.now().toString(),
      email,
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
      phone,
      role: role || 'staff',
      permissions: permissions || {},
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    writeJSON(adminsFile, admins);

    res.json({
      message: 'Admin user created',
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error('Add admin user error:', error);
    res.status(500).json({ message: 'Error creating admin user' });
  }
};

module.exports = exports;
