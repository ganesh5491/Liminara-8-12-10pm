import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthRedirectHandler() {
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Only run if user is authenticated
    if (!isAuthenticated) return;

    // Check for pending actions after login
    const pendingAction = sessionStorage.getItem('pendingAction');
    const pendingProductId = sessionStorage.getItem('pendingProductId');
    const pendingQuantity = sessionStorage.getItem('pendingQuantity');

    // Skip if these actions should be handled by callback.tsx
    // Only handle add-to-cart actions that weren't handled by callback
    if (pendingAction === 'add-to-cart' && pendingProductId) {
      // Clear the pending action first
      sessionStorage.removeItem('pendingAction');
      sessionStorage.removeItem('pendingProductId');
      sessionStorage.removeItem('pendingQuantity');

      // Add the product to cart
      handleAddToCart(pendingProductId, parseInt(pendingQuantity || '1'));
    }

    // Don't handle buy-now actions here - let callback.tsx handle them
    // Don't show "Welcome back!" message as it interferes with the buy-now flow
  }, [isAuthenticated]);

  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity
        })
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      window.dispatchEvent(new Event('cartUpdated'));

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  // This component doesn't render anything
  return null;
}