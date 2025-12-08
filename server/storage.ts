import {
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ContactInquiry,
  type InsertContactInquiry,
  type ProductReview,
  type InsertProductReview,
  type ProductQuestion,
  type InsertProductQuestion,
  type UserAddress,
  type InsertUserAddress,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: User): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Subcategory operations
  getSubcategories(categoryId?: string): Promise<Subcategory[]>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // Product operations
  getProducts(filters?: {
    search?: string;
    categoryId?: string;
    subcategoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    isDeal?: boolean;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getDealProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Wishlist operations
  getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItems(orderItems: InsertOrderItem[]): Promise<OrderItem[]>;
  getOrders(userId: string): Promise<(Order & { orderItems: (OrderItem & { product: Product })[] })[]>;
  getOrder(id: string): Promise<(Order & { orderItems: (OrderItem & { product: Product })[] }) | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Contact operations
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;

  // Review operations
  getProductReviews(productId: string): Promise<ProductReview[]>;
  createProductReview(review: InsertProductReview): Promise<ProductReview>;

  // Q&A operations
  getProductQuestions(productId: string): Promise<ProductQuestion[]>;
  createProductQuestion(question: InsertProductQuestion): Promise<ProductQuestion>;
  updateProductQuestion(id: string, data: Partial<ProductQuestion>): Promise<ProductQuestion | undefined>;
  updateProductQuestion(id: string, data: Partial<ProductQuestion>): Promise<ProductQuestion | undefined>;

  // Address operations
  getUserAddresses(userId: string): Promise<UserAddress[]>;
  createUserAddress(address: InsertUserAddress): Promise<UserAddress>;
  updateUserAddress(id: string, address: Partial<InsertUserAddress>): Promise<UserAddress | undefined>;
  deleteUserAddress(id: string, userId: string): Promise<boolean>;
}

// Use MySQL storage implementation
import { createStorage } from "./mysql-config";
import { JSONStorage } from "./json-storage";

// Initialize storage (will be MySQL if credentials available, otherwise JSON fallback)
let storageInstance: IStorage | null = null;

export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await createStorage();
  }
  return storageInstance;
};

// For immediate access (will initialize with JSON fallback first, then switch to MySQL)
export const storage = new JSONStorage();