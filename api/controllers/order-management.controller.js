/**
 * Order Management Controller
 * Handles order operations for admin panel
 */

const fs = require('fs');
const path = require('path');

const ordersFile = path.join(__dirname, '../../data/orders.json');
const agentsFile = path.join(__dirname, '../../data/deliveryAgents.json');

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

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = readJSON(ordersFile);
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = readJSON(ordersFile);
    const order = orders.find(o => o.id === id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const orders = readJSON(ordersFile);
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[orderIndex];
    order.status = status;
    order.updatedAt = new Date().toISOString();

    writeJSON(ordersFile, orders);

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// Assign delivery agent
exports.assignDeliveryAgent = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    const orders = readJSON(ordersFile);
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify agent exists
    const agents = readJSON(agentsFile);
    if (!agents.find(a => a.id === agentId)) {
      return res.status(400).json({ message: 'Delivery agent not found' });
    }

    const order = orders[orderIndex];
    order.assignedDeliveryAgent = agentId;
    order.status = 'assigned';
    order.updatedAt = new Date().toISOString();

    writeJSON(ordersFile, orders);

    res.json({
      message: 'Delivery agent assigned',
      order,
    });
  } catch (error) {
    console.error('Assign delivery agent error:', error);
    res.status(500).json({ message: 'Error assigning delivery agent' });
  }
};

// Get delivery agents for assignment
exports.getDeliveryAgents = async (req, res) => {
  try {
    const agents = readJSON(agentsFile);
    const activeAgents = agents.filter(a => a.status === 'active');

    res.json(activeAgents.map(a => ({
      id: a.id,
      name: a.name,
      email: a.email,
      phone: a.phone,
      rating: a.rating,
      totalDeliveries: a.totalDeliveries,
      completedDeliveries: a.completedDeliveries,
    })));
  } catch (error) {
    console.error('Get delivery agents error:', error);
    res.status(500).json({ message: 'Error fetching agents' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const orders = readJSON(ordersFile);
    const orderIndex = orders.findIndex(o => o.id === id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[orderIndex];
    order.status = 'cancelled';
    order.cancellationReason = reason || '';
    order.cancelledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    writeJSON(ordersFile, orders);

    res.json({
      message: 'Order cancelled',
      order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

module.exports = exports;
