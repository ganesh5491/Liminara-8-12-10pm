import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, X, CreditCard, Smartphone, Building, Truck, CheckCircle } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";


import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  showDealBadge?: boolean;
}

export default function ProductCard({ product, showDealBadge = false }: ProductCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);


  // Rapid-click protection cooldown
  const [cartCooldown, setCartCooldown] = useState(false);

  // This component handles authentication flows in the product detail page now
  // No complex authentication detection needed here anymore

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      console.log('🛒 Add to cart clicked', { productId: product.id, isAuthenticated });

      // For authenticated users, use API only
      if (isAuthenticated) {
        console.log('✅ Authenticated, adding to cart via API');
        const res = await fetch("/api/cart", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1
          })
        });

        if (res.ok) {
          console.log('✅ Added to cart successfully via API');
          return { success: true, localStorage: false };
        }

        throw new Error("Failed to add to cart");
      }

      // For guest users only, use localStorage
      console.log('🛒 Using localStorage for cart (guest user)');
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');

      // Check if item already exists in cart
      const existingItemIndex = localCart.findIndex((item: any) =>
        item.productId === product.id || item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        localCart[existingItemIndex].quantity = (localCart[existingItemIndex].quantity || 1) + 1;
      } else {
        // Add new item with product details for display
        localCart.push({
          id: `local-${product.id}-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            images: product.images
          }
        });
      }

      localStorage.setItem('localCart', JSON.stringify(localCart));
      window.dispatchEvent(new Event('cartUpdated'));

      console.log('✅ Added to cart via localStorage');
      return { success: true, localStorage: true };
    },
    onSuccess: (result) => {
      if (result && !result.localStorage) {
        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      }
      window.dispatchEvent(new Event('cartUpdated'));

      // Set cooldown to prevent rapid clicks
      setCartCooldown(true);
      setTimeout(() => setCartCooldown(false), 1000);

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error) => {
      console.error('❌ Add to cart error:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      console.log('❤️ Wishlist clicked', { productId: product.id, isInWishlist });

      try {
        if (isInWishlist) {
          await apiRequest("DELETE", `/api/wishlist/${product.id}`);
        } else {
          await apiRequest("POST", "/api/wishlist", {
            productId: product.id
          });
        }
      } catch (error: any) {
        if (error.message?.includes('Authentication required') || error.message?.includes('401')) {
          console.log('🔒 Not authenticated, using localStorage for wishlist');
          // User not logged in - use local storage for wishlist
          const localWishlist = JSON.parse(localStorage.getItem('localWishlist') || '[]');

          if (isInWishlist) {
            const updatedWishlist = localWishlist.filter((item: any) => item.productId !== product.id);
            localStorage.setItem('localWishlist', JSON.stringify(updatedWishlist));
          } else {
            localWishlist.push({
              productId: product.id,
              product: product
            });
            localStorage.setItem('localWishlist', JSON.stringify(localWishlist));
          }

          // Dispatch custom event to update other components
          window.dispatchEvent(new CustomEvent('localWishlistUpdate'));
          return;
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      // Also dispatch the custom event to update localStorage-based components
      window.dispatchEvent(new CustomEvent('localWishlistUpdate'));
      setIsInWishlist(!isInWishlist);
      toast({
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: `${product.name} has been ${isInWishlist ? "removed from" : "added to"} your wishlist.`,
      });
    },
    onError: (error) => {
      console.error('❌ Wishlist error:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBuyNow = () => {
    console.log('💳 Buy now clicked', { productId: product.id, isAuthenticated });

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      console.log('🔒 Not authenticated, redirecting to login');
      // Store ONLY what we need for checkout redirect
      sessionStorage.setItem('checkoutProductId', product.id.toString());
      navigate('/auth');
      return;
    }

    console.log('✅ Authenticated, navigating to checkout page');

    // Store buy now item in sessionStorage for checkout page
    sessionStorage.setItem('buyNowItem', JSON.stringify({
      productId: product.id,
      quantity: 1,
      price: parseFloat(displayPrice),
      total: parseFloat(displayPrice),
      product: product
    }));

    // Set checkout type
    localStorage.setItem('checkoutType', 'direct');
    localStorage.setItem('buyNowItem', JSON.stringify({
      productId: product.id,
      quantity: 1,
      price: parseFloat(displayPrice),
      total: parseFloat(displayPrice),
      product: product
    }));

    // Navigate to checkout page
    navigate('/checkout');
  };



  const displayPrice = product.isDeal && product.dealPrice ? product.dealPrice : product.price;
  const hasDiscount = product.originalPrice && product.originalPrice !== product.price;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover-lift group relative">
        {showDealBadge && product.isDeal && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            {product.dealPrice === "1.00" ? "₹1 DEAL" : "DEAL"}
          </div>
        )}

        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-w-16 aspect-h-12 overflow-hidden cursor-pointer">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="p-6">
          <Link to={`/product/${product.id}`} className="block hover:no-underline">
            <h3 className="text-xl font-display font-semibold text-[#3B2D25] mb-2 hover:text-[#4B3A2F] transition-colors cursor-pointer" data-testid={`product-name-${product.id}`}>
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-2" data-testid={`product-description-${product.id}`}>
            {product.description || "No description available"}
          </p>

          <div className="flex items-start justify-between mb-4 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 flex-1 min-w-0">
              <span className="text-lg sm:text-2xl font-bold text-[#4B3A2F] truncate" data-testid={`product-price-${product.id}`}>
                ₹{displayPrice}
              </span>
              {hasDiscount && (
                <span className="text-sm sm:text-lg text-gray-500 line-through truncate" data-testid={`product-original-price-${product.id}`}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => addToWishlistMutation.mutate()}
              disabled={addToWishlistMutation.isPending}
              className={`p-2 flex-shrink-0 ${isInWishlist ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist ? "fill-current" : ""}`} />
            </Button>
          </div>

          {product.isDeal && product.stock && (
            <div className="text-sm text-gray-600 mb-4">
              <span data-testid={`product-stock-${product.id}`}>{product.stock}</span> left
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending || cartCooldown}
              className="flex-1 bg-[#4B3A2F] text-white hover:bg-[#3B2D25] transition-opacity"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {addToCartMutation.isPending ? "Adding..." : cartCooldown ? "Added!" : "Add to Cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={addToCartMutation.isPending}
              className="flex-1 bg-gradient-to-r from-[#4B3A2F] to-[#3B2D25] text-white hover:opacity-90 transition-opacity"
              data-testid={`button-buy-now-${product.id}`}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>



    </>
  );
}
