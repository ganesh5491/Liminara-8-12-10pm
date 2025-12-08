# Liminara API - E-commerce Backend

Node.js + Express backend for Liminara e-commerce platform.

## Features

- **Authentication**: Auth0 + JWT-based authentication
- **Products**: Browse, search, filter products
- **Shopping Cart**: Add to cart, update quantities
- **Wishlist**: Save favorite products
- **Orders**: Complete checkout with Razorpay or COD
- **Database**: MySQL with connection pooling
- **Email**: Order confirmations via Nodemailer
- **SMS**: Order notifications (Fast2SMS, Twilio, MSG91, TextLocal)
- **Payments**: Razorpay integration + Cash on Delivery

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - Database credentials
   - JWT secret
   - Email/SMS providers
   - Razorpay keys

4. Start server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication (Auth0 Integration)
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/sync` - Sync user from Auth0 (login/register)
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update user profile

### Products & Categories
- `GET /api/products` - Get all products (with filters, search, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/deals` - Get deal products
- `GET /api/products/:id` - Get single product details
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Submit product review
- `GET /api/products/:id/questions` - Get product Q&A
- `POST /api/products/:id/questions` - Ask product question
- `GET /api/categories` - Get all categories
- `GET /api/subcategories` - Get all subcategories

### Shopping Cart
- `GET /api/cart` - Get cart items (requires auth)
- `POST /api/cart` - Add product to cart (requires auth)
- `PUT /api/cart` - Update cart item quantity (requires auth)
- `DELETE /api/cart` - Remove item from cart (requires auth)

### Wishlist
- `GET /api/wishlist` - Get wishlist items (requires auth)
- `POST /api/wishlist` - Add to wishlist (requires auth)
- `DELETE /api/wishlist` - Remove from wishlist (requires auth)

### Orders & Checkout
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order from cart (requires auth)
- `POST /api/orders/direct-checkout` - Direct checkout (buy now)
- `POST /api/orders/:id/cancel` - Cancel order

### Payments
- `GET /api/payment/config` - Get Razorpay public config
- `POST /api/create-razorpay-order` - Create Razorpay payment order
- `POST /api/verify-razorpay-payment` - Verify Razorpay signature
- **Cash on Delivery (COD)** - Set `paymentMethod: 'cod'` in order creation

### Contact
- `POST /api/contact` - Submit customer inquiry

## Project Structure

```
api/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Request handlers
├── middleware/               # Auth, upload, error handlers
├── models/                   # Database models
├── routes/                   # Express routes
├── services/                 # Email, SMS, payment services
├── utils/                    # Helper functions
├── storage/                  # Uploads, logs
├── server.js                 # Express server
├── index.js                  # Route aggregator
└── package.json              # Dependencies
```

## Migration from PHP

This backend replaces all 71 PHP files with Node.js + Express:
- PHP sessions → JWT tokens
- PHP $_POST/$_GET → req.body/req.query
- PHP $_FILES → Multer
- PHP PDO → MySQL2
- PHPMailer → Nodemailer

## License

ISC
