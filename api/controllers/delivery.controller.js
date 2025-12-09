/**
 * Delivery Agent Controller
 * Handles delivery agent authentication and order management
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const agentsFile = path.join(__dirname, '../../data/deliveryAgents.json');
const ordersFile = path.join(__dirname, '../../data/orders.json');

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

// Initialize delivery agents if empty
const initializeDeliveryAgents = () => {
  if (!fs.existsSync(agentsFile)) {
    const defaultAgents = [
      {
        id: 'agent_1',
        email: 'agent1@liminara.com',
        password: bcrypt.hashSync('agent123', 10),
        name: 'Rajesh Kumar',
        phone: '9876543210',
        status: 'active',
        totalDeliveries: 125,
        completedDeliveries: 120,
        cancelledDeliveries: 5,
        rating: '4.8',
        earnings: '45000',
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'agent_2',
        email: 'agent2@liminara.com',
        password: bcrypt.hashSync('agent123', 10),
        name: 'Priya Singh',
        phone: '9876543211',
        status: 'active',
        totalDeliveries: 98,
        completedDeliveries: 95,
        cancelledDeliveries: 3,
        rating: '4.6',
        earnings: '38000',
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
      },
    ];
    writeJSON(agentsFile, defaultAgents);
    console.log('✅ Default delivery agents created');
  }
};

// Delivery agent login
exports.login = async (req, res) => {
  try {
    initializeDeliveryAgents();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const agents = readJSON(agentsFile);
    const agent = agents.find(a => a.email === email);

    if (!agent || !bcrypt.compareSync(password, agent.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (agent.status !== 'active') {
      return res.status(403).json({ message: 'Your account is inactive' });
    }

    // Set session
    req.session.agentId = agent.id;
    req.session.isDelivery = true;

    res.json({
      message: 'Login successful',
      agent: {
        id: agent.id,
        email: agent.email,
        name: agent.name,
        phone: agent.phone,
        rating: agent.rating,
        earnings: agent.earnings,
        status: agent.status,
        totalDeliveries: agent.totalDeliveries,
        completedDeliveries: agent.completedDeliveries,
        cancelledDeliveries: agent.cancelledDeliveries,
      },
    });
  } catch (error) {
    console.error('Delivery login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Get current delivery agent
exports.getCurrentAgent = async (req, res) => {
  try {
    if (!req.session.agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const agents = readJSON(agentsFile);
    const agent = agents.find(a => a.id === req.session.agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      id: agent.id,
      email: agent.email,
      name: agent.name,
      phone: agent.phone,
      rating: agent.rating,
      earnings: agent.earnings,
      status: agent.status,
      totalDeliveries: agent.totalDeliveries,
      completedDeliveries: agent.completedDeliveries,
      cancelledDeliveries: agent.cancelledDeliveries,
      mustChangePassword: agent.mustChangePassword || false,
    });
  } catch (error) {
    console.error('Get current agent error:', error);
    res.status(500).json({ message: 'Error fetching agent' });
  }
};

// Delivery agent logout
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Delivery logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    if (!req.session.agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords required' });
    }

    const agents = readJSON(agentsFile);
    const agentIndex = agents.findIndex(a => a.id === req.session.agentId);

    if (agentIndex === -1) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const agent = agents[agentIndex];

    if (!bcrypt.compareSync(currentPassword, agent.password)) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    agent.password = bcrypt.hashSync(newPassword, 10);
    agent.mustChangePassword = false;
    writeJSON(agentsFile, agents);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Password change failed' });
  }
};

// Get assigned orders
exports.getAssignedOrders = async (req, res) => {
  try {
    if (!req.session.agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const orders = readJSON(ordersFile);
    const assignedOrders = orders.filter(o => o.assignedDeliveryAgent === req.session.agentId);

    res.json(assignedOrders);
  } catch (error) {
    console.error('Get assigned orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.session.agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status required' });
    }

    const orders = readJSON(ordersFile);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[orderIndex];

    if (order.assignedDeliveryAgent !== req.session.agentId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === 'delivered') {
      order.deliveredAt = new Date().toISOString();
    }

    writeJSON(ordersFile, orders);

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// Get delivery stats
exports.getDeliveryStats = async (req, res) => {
  try {
    if (!req.session.agentId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const agents = readJSON(agentsFile);
    const agent = agents.find(a => a.id === req.session.agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const orders = readJSON(ordersFile);
    const todayOrders = orders.filter(o => {
      if (o.assignedDeliveryAgent !== req.session.agentId) return false;
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    });

    res.json({
      totalDeliveries: agent.totalDeliveries,
      completedDeliveries: agent.completedDeliveries,
      cancelledDeliveries: agent.cancelledDeliveries,
      rating: agent.rating,
      earnings: agent.earnings,
      todayDeliveries: todayOrders.length,
      todayCompleted: todayOrders.filter(o => o.status === 'delivered').length,
      avgRating: agent.rating,
      earnings: agent.earnings,
    });
  } catch (error) {
    console.error('Get delivery stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = exports;
