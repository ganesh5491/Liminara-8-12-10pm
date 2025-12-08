import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  identifier?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to migrate guest cart to authenticated user's cart
  const migrateGuestCart = async (authToken: string) => {
    try {
      // Check both possible localStorage keys for guest cart
      const localCartData = localStorage.getItem('localCart') || localStorage.getItem('guestCart');
      if (!localCartData) return;
      
      const guestItems = JSON.parse(localCartData);
      if (!Array.isArray(guestItems) || guestItems.length === 0) return;
      
      console.log('🛒 Migrating guest cart:', guestItems.length, 'items');
      
      let allSucceeded = true;
      
      // Add each guest cart item to the authenticated user's cart
      for (const item of guestItems) {
        // Get actual product ID - guest cart stores full product in item.product
        const productId = item.productId || item.product?.id;
        const quantity = item.quantity || 1;
        
        if (!productId) {
          console.warn('Skipping cart item with no product ID:', item);
          continue;
        }
        
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
          });
          
          if (!response.ok) {
            console.error('Failed to migrate cart item:', productId, response.status);
            allSucceeded = false;
          }
        } catch (err) {
          console.error('Failed to migrate cart item:', productId, err);
          allSucceeded = false;
        }
      }
      
      // Only clear local storage if all migrations succeeded
      if (allSucceeded) {
        localStorage.removeItem('localCart');
        localStorage.removeItem('guestCart');
        console.log('✅ Guest cart migrated successfully');
      } else {
        console.warn('⚠️ Some cart items failed to migrate, keeping local cart');
      }
      
      // Dispatch event to trigger cart refresh
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Failed to migrate guest cart:', error);
    }
  };

  const checkAuthStatus = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Migrate any guest cart that might exist
        await migrateGuestCart(authToken);
      } else {
        // Token invalid or expired
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        await checkAuthStatus(storedToken);
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData: User, authToken: string) => {
    console.log('🔐 Login called with user:', userData);
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);

    // Migrate guest cart to authenticated user's cart
    await migrateGuestCart(authToken);

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAuthenticated: true, user: userData } }));

    // Force a small delay to ensure state is updated
    setTimeout(() => {
      console.log('🔄 Auth state updated, dispatching event');
    }, 100);
  };

  const logout = () => {
    console.log('🔓 Logout called');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isAuthenticated: false, user: null } }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}