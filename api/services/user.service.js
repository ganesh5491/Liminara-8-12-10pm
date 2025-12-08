/**
 * User Service (JSON-based)
 * Replaces MySQL User model with JSON file storage
 */

const jsonDB = require('./json-db.service');
const { generateId } = require('../utils/helpers');
const logger = require('../utils/logger');

class UserService {
    constructor() {
        this.USERS_FILE = 'users.json';
    }

    /**
     * Generate user ID from identifier (phone or email)
     */
    generateUserId(identifier) {
        return `user_${identifier}`;
    }

    /**
     * Create new user
     */
    async createUser(data) {
        const { name, email, phone, address } = data;

        // Use phone OR email as identifier
        const identifier = phone || email;
        if (!identifier) {
            throw new Error('Either phone or email is required');
        }

        const userId = this.generateUserId(identifier);

        // Check if user already exists
        const exists = await jsonDB.has(this.USERS_FILE, userId);
        if (exists) {
            throw new Error('User already exists');
        }

        const userData = {
            id: userId,
            identifier,
            identifierType: phone ? 'phone' : 'email',
            name,
            email: email || null,
            phone: phone || null,
            address: address || null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            cart: [],
            wishlist: [],
            orders: []
        };

        await jsonDB.set(this.USERS_FILE, userId, userData);

        logger.success(`User created: ${userId}`);

        return userData;
    }

    /**
     * Get user by identifier (phone or email)
     */
    async getUserByIdentifier(identifier) {
        const userId = this.generateUserId(identifier);
        const user = await jsonDB.get(this.USERS_FILE, userId);
        return user || null;
    }

    /**
     * Update user profile
     */
    async updateUserProfile(identifier, updates) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        const allowedFields = ['name', 'email', 'phone', 'address'];
        const updatedUser = { ...user };

        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                updatedUser[field] = updates[field];
            }
        }

        updatedUser.lastLogin = new Date().toISOString();

        await jsonDB.set(this.USERS_FILE, userId, updatedUser);

        logger.info(`User updated: ${userId}`);

        return updatedUser;
    }

    /**
     * Update last login time
     */
    async updateLastLogin(identifier) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (user) {
            user.lastLogin = new Date().toISOString();
            await jsonDB.set(this.USERS_FILE, userId, user);
        }
    }

    // ==================== CART OPERATIONS ====================

    /**
     * Get user's cart
     */
    async getCart(identifier) {
        const user = await this.getUserByIdentifier(identifier);
        return user ? user.cart : [];
    }

    /**
     * Add item to cart
     */
    async addToCart(identifier, item) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if item already in cart
        const existingIndex = user.cart.findIndex(
            cartItem => cartItem.productId === item.productId
        );

        if (existingIndex >= 0) {
            // Update quantity
            user.cart[existingIndex].quantity += item.quantity || 1;
        } else {
            // Add new item
            user.cart.push({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity || 1,
                price: item.price,
                imageUrl: item.imageUrl || null,
                addedAt: new Date().toISOString()
            });
        }

        await jsonDB.set(this.USERS_FILE, userId, user);

        logger.info(`Item added to cart for ${userId}`);

        return user.cart;
    }

    /**
     * Update cart item quantity
     */
    async updateCartItem(identifier, productId, quantity) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        const itemIndex = user.cart.findIndex(item => item.productId === productId);

        if (itemIndex < 0) {
            throw new Error('Item not found in cart');
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0
            user.cart.splice(itemIndex, 1);
        } else {
            user.cart[itemIndex].quantity = quantity;
        }

        await jsonDB.set(this.USERS_FILE, userId, user);

        return user.cart;
    }

    /**
     * Remove item from cart
     */
    async removeFromCart(identifier, productId) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        user.cart = user.cart.filter(item => item.productId !== productId);

        await jsonDB.set(this.USERS_FILE, userId, user);

        logger.info(`Item removed from cart for ${userId}`);

        return user.cart;
    }

    /**
     * Clear entire cart
     */
    async clearCart(identifier) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        user.cart = [];

        await jsonDB.set(this.USERS_FILE, userId, user);

        return [];
    }

    // ==================== WISHLIST OPERATIONS ====================

    /**
     * Get user's wishlist
     */
    async getWishlist(identifier) {
        const user = await this.getUserByIdentifier(identifier);
        return user ? user.wishlist : [];
    }

    /**
     * Add item to wishlist
     */
    async addToWishlist(identifier, productId, productName = null) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if already in wishlist
        const exists = user.wishlist.some(item => item.productId === productId);

        if (exists) {
            return user.wishlist; // Already in wishlist
        }

        user.wishlist.push({
            productId,
            productName,
            addedAt: new Date().toISOString()
        });

        await jsonDB.set(this.USERS_FILE, userId, user);

        logger.info(`Item added to wishlist for ${userId}`);

        return user.wishlist;
    }

    /**
     * Remove item from wishlist
     */
    async removeFromWishlist(identifier, productId) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        user.wishlist = user.wishlist.filter(item => item.productId !== productId);

        await jsonDB.set(this.USERS_FILE, userId, user);

        logger.info(`Item removed from wishlist for ${userId}`);

        return user.wishlist;
    }

    // ==================== ORDER OPERATIONS ====================

    /**
     * Get user's orders
     */
    async getOrders(identifier) {
        const user = await this.getUserByIdentifier(identifier);
        return user ? user.orders : [];
    }

    /**
     * Add new order
     */
    async addOrder(identifier, orderData) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        const order = {
            orderId: orderData.orderId || generateId('order'),
            items: orderData.items,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: orderData.paymentStatus || 'pending',
            orderStatus: orderData.orderStatus || 'pending',
            shippingAddress: orderData.shippingAddress,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerEmail: orderData.customerEmail,
            pincode: orderData.pincode || null,
            razorpayOrderId: orderData.razorpayOrderId || null,
            razorpayPaymentId: orderData.razorpayPaymentId || null,
            razorpaySignature: orderData.razorpaySignature || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        user.orders.unshift(order); // Add to beginning (newest first)

        await jsonDB.set(this.USERS_FILE, userId, user);

        logger.success(`Order created for ${userId}: ${order.orderId}`);

        return order;
    }

    /**
     * Update order status
     */
    async updateOrderStatus(identifier, orderId, status) {
        const userId = this.generateUserId(identifier);
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            throw new Error('User not found');
        }

        const orderIndex = user.orders.findIndex(o => o.orderId === orderId);

        if (orderIndex < 0) {
            throw new Error('Order not found');
        }

        user.orders[orderIndex].orderStatus = status;
        user.orders[orderIndex].updatedAt = new Date().toISOString();

        await jsonDB.set(this.USERS_FILE, userId, user);

        return user.orders[orderIndex];
    }

    /**
     * Get single order
     */
    async getOrder(identifier, orderId) {
        const user = await this.getUserByIdentifier(identifier);

        if (!user) {
            return null;
        }

        return user.orders.find(o => o.orderId === orderId) || null;
    }
}

// Singleton instance
const userService = new UserService();

module.exports = userService;
