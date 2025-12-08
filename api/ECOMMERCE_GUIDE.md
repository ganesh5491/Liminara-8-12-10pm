# E-commerce Backend - Essential Files

This backend supports a complete e-commerce application with Auth0 authentication.

## Core Features

### 1. **User Authentication (Auth0)**
- JWT token-based authentication
- User profile management
- Session handling

### 2. **Product Management**
- Product browsing with filters
- Search functionality
- Featured products & deals
- Product reviews & Q&A
- Categories & subcategories

### 3. **Shopping Experience**
- Shopping cart (add, update, remove)
- Wishlist functionality
- Product recommendations

### 4. **Checkout & Orders**
- Complete order flow
- Cart checkout
- Direct checkout (buy now)
- Order history
- Order cancellation
- Payment integration (Razorpay)
- Cash on Delivery (COD) option

### 5. **Payment Processing**
- Razorpay integration for online payments
- Cash on Delivery support
- Payment verification
- Order confirmation emails
- Order confirmation SMS

### 6. **Customer Support**
- Contact form
- Email notifications

## File Structure

```
api/
├── config/
│   └── db.js                    # Database connection
├── controllers/
│   ├── auth.controller.js       # Auth0 + JWT auth
│   ├── product.controller.js    # Products, reviews, Q&A
│   ├── cart.controller.js       # Shopping cart
│   ├── wishlist.controller.js   # Wishlist
│   ├── order.controller.js      # Orders, checkout, COD
│   ├── category.controller.js   # Categories
│   ├── contact.controller.js    # Customer inquiries
│   └── payment.controller.js    # Razorpay + COD
├── models/
│   ├── BaseModel.js             # Base CRUD operations
│   ├── User.js                  # User data
│   ├── Product.js               # Products
│   ├── Category.js              # Categories
│   ├── Subcategory.js           # Subcategories
│   ├── Cart.js                  # Cart operations
│   ├── Wishlist.js              # Wishlist
│   ├── Order.js                 # Orders
│   ├── Contact.js               # Contact inquiries
│   └── ProductReview.js         # Reviews & Q&A
├── routes/
│   ├── auth.routes.js           # Auth endpoints
│   ├── product.routes.js        # Product endpoints
│   ├── cart.routes.js           # Cart endpoints
│   ├── wishlist.routes.js       # Wishlist endpoints
│   ├── order.routes.js          # Order endpoints
│   ├── category.routes.js       # Category endpoints
│   ├── subcategory.routes.js    # Subcategory endpoints
│   ├── contact.routes.js        # Contact endpoints
│   └── payment.routes.js        # Payment endpoints
├── services/
│   ├── email.service.js         # Email notifications
│   ├── sms.service.js           # SMS notifications
│   ├── sms.config.js            # SMS provider config
│   └── payment.service.js       # Razorpay integration
├── middleware/
│   ├── auth.js                  # JWT authentication
│   ├── upload.js                # File uploads (Multer)
│   └── errorHandler.js          # Error handling
├── utils/
│   ├── helpers.js               # Utility functions
│   └── logger.js                # Logging
├── storage/
│   ├── logs/                    # Error logs
│   └── uploads/                 # Product images, reviews
├── server.js                    # Express server
├── index.js                     # Route aggregator
├── package.json                 # Dependencies
└── .env                         # Environment config
```

## Required Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=liminara_ecommerce
DB_USER=root
DB_PASSWORD=your_password

# Auth0 (for frontend integration)
# JWT Secret for backend token verification
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email (for order confirmations)
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@liminara.com

# SMS (for order notifications)
SMS_PROVIDER=fast2sms
FAST2SMS_API_KEY=your_api_key

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## How It Works

### 1. User Authentication Flow
```
User → Auth0 (Login/Signup) → Frontend gets token → 
Backend `/api/auth/sync` → Create/Update user in DB → 
Return JWT for API calls
```

### 2. Shopping Flow
```
Browse Products → Add to Cart → View Cart → 
Checkout (Razorpay or COD) → Order Created → 
Email + SMS Confirmation
```

### 3. Payment Options
- **Razorpay**: Online payment with card/UPI/wallet
- **COD**: Cash on Delivery (set `paymentMethod: 'cod'` in order)

### 4. Data Storage
All data is stored in MySQL database:
- Users from Auth0
- Products catalog
- Shopping carts
- Wishlists
- Orders
- Reviews & Questions
- Contact inquiries

## What Was Removed

Non-essential features removed:
- ❌ Appointments scheduling
- ❌ Support ticket system
- ❌ Video call integration
- ❌ Email templates (using simple notifications)
- ❌ All PHP files (complete migration)

## Next Steps

1. Configure `.env` with your actual credentials
2. Set up Auth0 for frontend authentication
3. Import product data to MySQL
4. Test the complete flow:
   - User login via Auth0
   - Browse products
   - Add to cart
   - Checkout with payment
   - Verify order confirmation
