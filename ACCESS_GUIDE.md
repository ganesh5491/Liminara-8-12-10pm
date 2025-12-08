# 🎯 Quick Access Guide

## Your Application URLs

After running `npm run dev`, access:

### Frontend (React App)
🌐 **http://localhost:5000**
- Main application interface
- User-facing pages
- Shopping experience

### Backend API
🔌 **http://localhost:5001/api**
- RESTful API endpoints
- E-commerce backend

### Quick Tests

✅ **Frontend Health**: http://localhost:5000  
✅ **Backend Health**: http://localhost:5001/api/health  
✅ **Products API**: http://localhost:5001/api/products  
✅ **Categories API**: http://localhost:5001/api/categories  

---

## Why Two Ports?

- **Port 5000**: Frontend (React + TypeScript server)
- **Port 5001**: Backend API (Node.js + Express)

This prevents port conflicts and keeps services separated.

---

## Common URLs

### Shopping
- Products: `GET http://localhost:5001/api/products`
- Categories: `GET http://localhost:5001/api/categories`
- Cart: `GET http://localhost:5001/api/cart` (requires auth)

### Authentication
- Check auth: `GET http://localhost:5001/api/auth/me` (requires auth token)
- Sync user: `POST http://localhost:5001/api/auth/sync`

### Orders
- Create order: `POST http://localhost:5001/api/orders` (requires auth)
- Get orders: `GET http://localhost:5001/api/orders` (requires auth)

### Payments
- Razorpay config: `GET http://localhost:5001/api/payment/config`
- Create order: `POST http://localhost:5001/api/create-razorpay-order`
- Verify payment: `POST http://localhost:5001/api/verify-razorpay-payment`

---

## Frontend API Configuration

In your React app, set the API base URL to:

```javascript
const API_BASE_URL = 'http://localhost:5001/api';

// Example API call
fetch(`${API_BASE_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data));
```

Or with axios:
```javascript
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5001/api';

// Now all requests go to the API
axios.get('/products');
axios.post('/cart', { productId: '123' });
```

---

## Environment Variables

Add to your `.env` file (or `api/.env`):
```env
API_PORT=5001
```

This is already set as default in `api/server.js` if not specified.

---

Ready to test! 🚀
