/**
 * Admin & Delivery System Test Suite
 * Comprehensive testing for all features
 */

const BASE_URL = 'http://localhost:5001/api';

let adminToken = null;
let deliveryToken = null;
let adminId = null;
let agentId = null;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.cyan}🧪 ${msg}${colors.reset}`),
};

// Helper function to make requests
async function request(method, endpoint, body = null, isAdmin = true) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, options);
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    log.error(`Request failed: ${error.message}`);
    return { status: 0, ok: false, data: { error: error.message } };
  }
}

// Test suite functions
async function testAdminLogin() {
  log.test('Testing Admin Login');

  const res = await request('POST', '/admin/auth/login', {
    email: 'admin@liminara.com',
    password: 'admin123',
  });

  if (res.ok && res.data.user) {
    log.success('Admin login successful');
    adminId = res.data.user.id;
    return true;
  } else {
    log.error(`Admin login failed: ${res.data.message}`);
    return false;
  }
}

async function testGetCurrentAdmin() {
  log.test('Testing Get Current Admin');

  const res = await request('GET', '/admin/auth/me');

  if (res.ok && res.data.email) {
    log.success(`Retrieved admin: ${res.data.email}`);
    return true;
  } else {
    log.error(`Failed to get current admin: ${res.data.message}`);
    return false;
  }
}

async function testGetDashboardStats() {
  log.test('Testing Dashboard Stats');

  const res = await request('GET', '/admin/dashboard/stats');

  if (res.ok) {
    log.success(`Dashboard stats retrieved`);
    console.log(`   Total Orders: ${res.data.totalOrders}`);
    console.log(`   Total Users: ${res.data.totalUsers}`);
    console.log(`   Total Products: ${res.data.totalProducts}`);
    console.log(`   Total Sales: ₹${res.data.totalSales}`);
    return true;
  } else {
    log.error(`Failed to get stats: ${res.data.message}`);
    return false;
  }
}

async function testCreateProduct() {
  log.test('Testing Create Product');

  const res = await request('POST', '/admin/products-management', {
    name: 'Test Product',
    description: 'A test product',
    price: 299.99,
    category: 'skincare',
    stock: 50,
    sku: 'TEST-001',
  });

  if (res.ok && res.data.product) {
    log.success(`Product created: ${res.data.product.id}`);
    return true;
  } else {
    log.error(`Failed to create product: ${res.data.message}`);
    return false;
  }
}

async function testGetProducts() {
  log.test('Testing Get Products');

  const res = await request('GET', '/admin/products-management');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} products`);
    return true;
  } else {
    log.error(`Failed to get products: ${res.data.message}`);
    return false;
  }
}

async function testUpdateProduct() {
  log.test('Testing Update Product');

  // First get products
  const getRes = await request('GET', '/admin/products-management');
  if (!getRes.ok || getRes.data.length === 0) {
    log.warn('No products to update');
    return false;
  }

  const productId = getRes.data[0].id;

  const res = await request('PUT', `/admin/products-management/${productId}`, {
    name: 'Updated Product',
    price: 399.99,
  });

  if (res.ok) {
    log.success(`Product updated: ${productId}`);
    return true;
  } else {
    log.error(`Failed to update product: ${res.data.message}`);
    return false;
  }
}

async function testDeleteProduct() {
  log.test('Testing Delete Product');

  // First get products
  const getRes = await request('GET', '/admin/products-management');
  if (!getRes.ok || getRes.data.length === 0) {
    log.warn('No products to delete');
    return false;
  }

  // Get the last product
  const productId = getRes.data[getRes.data.length - 1].id;

  const res = await request('DELETE', `/admin/products-management/${productId}`);

  if (res.ok) {
    log.success(`Product deleted: ${productId}`);
    return true;
  } else {
    log.error(`Failed to delete product: ${res.data.message}`);
    return false;
  }
}

async function testGetOrders() {
  log.test('Testing Get Orders');

  const res = await request('GET', '/admin/orders-management');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} orders`);
    return true;
  } else {
    log.error(`Failed to get orders: ${res.data.message}`);
    return false;
  }
}

async function testGetDeliveryAgents() {
  log.test('Testing Get Delivery Agents');

  const res = await request('GET', '/admin/orders-management/delivery-agents/list');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} delivery agents`);
    if (res.data.length > 0) {
      agentId = res.data[0].id;
      console.log(`   Agent: ${res.data[0].name} (${res.data[0].email})`);
    }
    return true;
  } else {
    log.error(`Failed to get agents: ${res.data.message}`);
    return false;
  }
}

async function testAssignDeliveryAgent() {
  log.test('Testing Assign Delivery Agent');

  // Get orders first
  const ordersRes = await request('GET', '/admin/orders-management');
  if (!ordersRes.ok || ordersRes.data.length === 0) {
    log.warn('No orders to assign');
    return false;
  }

  const orderId = ordersRes.data[0].id;

  // Get agents
  const agentsRes = await request('GET', '/admin/orders-management/delivery-agents/list');
  if (!agentsRes.ok || agentsRes.data.length === 0) {
    log.warn('No agents available');
    return false;
  }

  const res = await request('POST', `/admin/orders-management/${orderId}/assign-delivery`, {
    agentId: agentsRes.data[0].id,
  });

  if (res.ok) {
    log.success(`Delivery agent assigned to order ${orderId}`);
    return true;
  } else {
    log.error(`Failed to assign agent: ${res.data.message}`);
    return false;
  }
}

async function testGetUsers() {
  log.test('Testing Get Users');

  const res = await request('GET', '/admin/content-management/users');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} users`);
    return true;
  } else {
    log.error(`Failed to get users: ${res.data.message}`);
    return false;
  }
}

async function testGetReviews() {
  log.test('Testing Get Reviews');

  const res = await request('GET', '/admin/content-management/reviews');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} reviews`);
    return true;
  } else {
    log.error(`Failed to get reviews: ${res.data.message}`);
    return false;
  }
}

async function testGetInquiries() {
  log.test('Testing Get Inquiries');

  const res = await request('GET', '/admin/content-management/inquiries');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} inquiries`);
    return true;
  } else {
    log.error(`Failed to get inquiries: ${res.data.message}`);
    return false;
  }
}

async function testGetQuestions() {
  log.test('Testing Get Questions');

  const res = await request('GET', '/admin/content-management/questions');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} questions`);
    return true;
  } else {
    log.error(`Failed to get questions: ${res.data.message}`);
    return false;
  }
}

async function testDeliveryLogin() {
  log.test('Testing Delivery Agent Login');

  const res = await request('POST', '/delivery/auth/login', {
    email: 'agent1@liminara.com',
    password: 'agent123',
  });

  if (res.ok && res.data.agent) {
    log.success('Delivery agent login successful');
    agentId = res.data.agent.id;
    return true;
  } else {
    log.error(`Delivery login failed: ${res.data.message}`);
    return false;
  }
}

async function testGetCurrentDeliveryAgent() {
  log.test('Testing Get Current Delivery Agent');

  const res = await request('GET', '/delivery/auth/me');

  if (res.ok && res.data.email) {
    log.success(`Retrieved agent: ${res.data.email}`);
    console.log(`   Name: ${res.data.name}`);
    console.log(`   Rating: ${res.data.rating}`);
    console.log(`   Completed Deliveries: ${res.data.completedDeliveries}`);
    return true;
  } else {
    log.error(`Failed to get current agent: ${res.data.message}`);
    return false;
  }
}

async function testGetDeliveryStats() {
  log.test('Testing Delivery Stats');

  const res = await request('GET', '/delivery/stats');

  if (res.ok) {
    log.success(`Delivery stats retrieved`);
    console.log(`   Total Deliveries: ${res.data.totalDeliveries}`);
    console.log(`   Completed: ${res.data.completedDeliveries}`);
    console.log(`   Rating: ${res.data.rating}`);
    console.log(`   Earnings: ₹${res.data.earnings}`);
    return true;
  } else {
    log.error(`Failed to get stats: ${res.data.message}`);
    return false;
  }
}

async function testGetAssignedOrders() {
  log.test('Testing Get Assigned Orders');

  const res = await request('GET', '/delivery/orders');

  if (res.ok && Array.isArray(res.data)) {
    log.success(`Retrieved ${res.data.length} assigned orders`);
    return true;
  } else {
    log.error(`Failed to get assigned orders: ${res.data.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  🚀 ADMIN & DELIVERY SYSTEM TEST SUITE' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset + '\n');

  let passed = 0;
  let failed = 0;

  // Admin Tests
  console.log(colors.blue + '\n📋 ADMIN AUTHENTICATION TESTS' + colors.reset);
  if (await testAdminLogin()) passed++;
  else failed++;

  if (await testGetCurrentAdmin()) passed++;
  else failed++;

  // Dashboard Tests
  console.log(colors.blue + '\n📊 ADMIN DASHBOARD TESTS' + colors.reset);
  if (await testGetDashboardStats()) passed++;
  else failed++;

  // Product Management Tests
  console.log(colors.blue + '\n📦 PRODUCT MANAGEMENT TESTS' + colors.reset);
  if (await testCreateProduct()) passed++;
  else failed++;

  if (await testGetProducts()) passed++;
  else failed++;

  if (await testUpdateProduct()) passed++;
  else failed++;

  if (await testDeleteProduct()) passed++;
  else failed++;

  // Order Management Tests
  console.log(colors.blue + '\n🛒 ORDER MANAGEMENT TESTS' + colors.reset);
  if (await testGetOrders()) passed++;
  else failed++;

  if (await testGetDeliveryAgents()) passed++;
  else failed++;

  if (await testAssignDeliveryAgent()) passed++;
  else failed++;

  // User/Review/Inquiry Tests
  console.log(colors.blue + '\n👥 CONTENT MANAGEMENT TESTS' + colors.reset);
  if (await testGetUsers()) passed++;
  else failed++;

  if (await testGetReviews()) passed++;
  else failed++;

  if (await testGetInquiries()) passed++;
  else failed++;

  if (await testGetQuestions()) passed++;
  else failed++;

  // Delivery Agent Tests
  console.log(colors.blue + '\n🚚 DELIVERY AGENT TESTS' + colors.reset);
  if (await testDeliveryLogin()) passed++;
  else failed++;

  if (await testGetCurrentDeliveryAgent()) passed++;
  else failed++;

  if (await testGetDeliveryStats()) passed++;
  else failed++;

  if (await testGetAssignedOrders()) passed++;
  else failed++;

  // Summary
  console.log('\n' + colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(colors.cyan + '  📈 TEST SUMMARY' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`${colors.yellow}📊 Total: ${passed + failed}${colors.reset}`);
  console.log(`${colors.yellow}🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%${colors.reset}\n`);

  if (failed === 0) {
    console.log(colors.green + '🎉 ALL TESTS PASSED! 🎉' + colors.reset + '\n');
  } else {
    console.log(colors.red + '⚠️  SOME TESTS FAILED' + colors.reset + '\n');
  }
}

// Run tests
runAllTests().catch(console.error);
