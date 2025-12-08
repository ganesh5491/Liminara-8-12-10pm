import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Truck, CreditCard, MapPin, User, Smartphone, Building, Banknote, CheckCircle, Loader2, QrCode } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    pincode: ''
  });

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'payment'>('details');
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [razorpayConfig, setRazorpayConfig] = useState<{ key: string, enabled: boolean } | null>(null);
  const [razorpayActive, setRazorpayActive] = useState(false);

  // Load cart items
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ["/api/cart"],
    enabled: !isDirectCheckout
  });

  // Load user profile but don't block checkout (allow guest checkout)
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false
  });

  // Load Razorpay configuration
  useEffect(() => {
    const loadRazorpayConfig = async () => {
      try {
        const response = await fetch('/api/payment/config');
        const config = await response.json();
        setRazorpayConfig(config);

        // Load Razorpay script if not already loaded and enabled
        if (config.enabled && !window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            console.log('Razorpay SDK loaded successfully');
          };
          document.body.appendChild(script);
        }
      } catch (error) {
        console.error('Failed to load Razorpay config:', error);
      }
    };
    loadRazorpayConfig();
  }, []);

  // Show login redirect only if user explicitly tried to access protected checkout
  useEffect(() => {
    // Store current location for redirect after login
    if (!user && !userLoading && !localStorage.getItem('checkoutItems') && !localStorage.getItem('buyNowItem')) {
      // User is not authenticated and there's no cart data - redirect to login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/login');
    }
  }, [user, userLoading, location, navigate]);

  // Create final order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      return await response.json();
    },
    onSuccess: (order) => {
      toast({
        title: "Order Created Successfully!",
        description: `Order #${order.id.slice(-8)} has been placed.`,
        variant: "default",
      });

      // Clear local storage and cart
      localStorage.removeItem('checkoutType');
      localStorage.removeItem('buyNowItem');
      localStorage.removeItem('checkoutItems');
      localStorage.removeItem('localCart'); // Clear local cart as well

      // Invalidate cart queries to refresh cart state
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });

      // Navigate to success page
      navigate(`/order-success?orderId=${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Order Creation Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  });

  useEffect(() => {
    // Check checkout type and load appropriate data - only once on mount
    const checkoutType = localStorage.getItem('checkoutType');
    const buyNowData = localStorage.getItem('buyNowItem');
    const cartData = localStorage.getItem('checkoutItems');

    if (checkoutType === 'direct' && buyNowData) {
      const item = JSON.parse(buyNowData);
      setIsDirectCheckout(true);
      setOrderItems([item]);
      setOrderTotal(item.total);
    } else if (checkoutType === 'cart' && cartData) {
      const items = JSON.parse(cartData);

      // Recalculate prices to apply deal prices
      const updatedItems = items.map((item: any) => {
        // Safety check for invalid items or missing product data
        if (!item || !item.product) {
          return null;
        }

        const now = new Date();
        const dealExpiry = item.product.dealExpiry ? new Date(item.product.dealExpiry) : null;
        const isValidDeal = item.product.isDeal && item.product.dealPrice && (!dealExpiry || dealExpiry > now);

        const effectivePrice = isValidDeal ? parseFloat(item.product.dealPrice) : parseFloat(item.product.price);

        return {
          ...item,
          price: effectivePrice,
          total: effectivePrice * item.quantity
        };
      }).filter((item: any) => item !== null);

      setOrderItems(updatedItems);
      setOrderTotal(updatedItems.reduce((sum: number, item: any) => sum + item.total, 0));
    }
    // Don't fall back to current cart items to prevent loops
  }, []); // Empty dependency array - run only on mount

  // Load cart items only when needed and no checkout data exists
  useEffect(() => {
    if (orderItems.length === 0 && !isDirectCheckout && Array.isArray(cartItems) && cartItems.length > 0) {
      const items = (cartItems as any[]).map((item: any) => {
        // Safety check: skip items with undefined products
        if (!item.product) {
          console.warn('Skipping cart item with undefined product:', item);
          return null;
        }

        // Use deal price if product is on deal and deal hasn't expired
        const now = new Date();
        const dealExpiry = item.product.dealExpiry ? new Date(item.product.dealExpiry) : null;
        const isValidDeal = item.product.isDeal && item.product.dealPrice && (!dealExpiry || dealExpiry > now);

        const effectivePrice = isValidDeal ? parseFloat(item.product.dealPrice) : parseFloat(item.product.price);

        return {
          product: item.product,
          quantity: item.quantity,
          price: effectivePrice,
          total: effectivePrice * item.quantity
        };
      }).filter(item => item !== null); // Remove items with undefined products
      setOrderItems(items);
      setOrderTotal(items.reduce((sum: number, item: any) => sum + item.total, 0));
    }
  }, [cartItems, orderItems.length, isDirectCheckout]);

  // User details effect - only run when user changes and fields are empty
  useEffect(() => {
    if (user && typeof user === 'object' && (!customerDetails.name || !customerDetails.email)) {
      const userObj = user as any;
      setCustomerDetails(prev => ({
        ...prev,
        name: prev.name || userObj.name || `${userObj.firstName || ''} ${userObj.lastName || ''}`.trim(),
        email: prev.email || userObj.email || '',
      }));
    }
  }, [user, customerDetails.name, customerDetails.email]); // Only depend on user and empty fields

  // Check for pre-selected address and auto-populate
  useEffect(() => {
    const savedAddress = localStorage.getItem('checkoutAddress');
    if (savedAddress) {
      try {
        const addressData = JSON.parse(savedAddress);
        setCustomerDetails({
          name: addressData.customerName || '',
          email: addressData.customerEmail || '',
          contact: addressData.customerPhone || '',
          address: addressData.shippingAddress || '',
          pincode: addressData.pincode || ''
        });
        // Skip to payment step if address is pre-filled
        setCheckoutStep('payment');
      } catch (error) {
        console.error('Failed to parse saved address:', error);
      }
    }
  }, []); // Run only on mount

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!customerDetails.name || !customerDetails.contact || !customerDetails.address || !customerDetails.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setCheckoutStep('payment');
  };

  const handlePaymentMethod = async (method: string) => {
    setSelectedPaymentMethod(method);
    setLoading(true);

    try {
      if (method === 'cod') {
        // Show confirmation for COD
        if (window.confirm("Confirm Cash on Delivery order?")) {
          await handleCodPayment();
        } else {
          setLoading(false);
        }
      } else {
        // Handle Razorpay payment methods
        await handleRazorpayPayment(method);
      }
    } catch (error) {
      console.error('Payment method selection failed:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCodPayment = async () => {
    try {
      const orderData = {
        customerName: customerDetails.name,
        customerPhone: customerDetails.contact,
        customerEmail: customerDetails.email,
        shippingAddress: customerDetails.address,
        pincode: customerDetails.pincode,
        paymentMethod: 'cod',
        orderItems: orderItems.map((item: any) => ({
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
          price: item.price?.toString() || item.product?.price || "0",
        })),
        total: orderTotal,
      };

      await createOrderMutation.mutateAsync(orderData);
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async (preferredMethod?: string) => {
    try {
      if (!razorpayConfig?.enabled) {
        throw new Error('Razorpay not configured');
      }

      const productDetails = {
        id: isDirectCheckout ? orderItems[0]?.product?.id : (orderItems[0]?.product?.id || orderItems[0]?.productId),
        name: isDirectCheckout ? orderItems[0]?.product?.name : (orderItems.length === 1 ? orderItems[0]?.product?.name : `${orderItems.length} items`),
        isMultipleItems: !isDirectCheckout && orderItems.length > 1,
        orderItems: !isDirectCheckout ? orderItems : undefined
      };

      // Create Razorpay order
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productDetails.id,
          quantity: productDetails?.isMultipleItems ? (productDetails.orderItems?.reduce((sum: any, item: any) => sum + item.quantity, 0) || 1) : 1,
          currency: 'INR',
          isCartOrder: productDetails?.isMultipleItems || false,
          orderItems: productDetails?.isMultipleItems ? productDetails.orderItems?.map((item: any) => ({
            productId: item.productId || item.id,
            quantity: item.quantity,
            price: item.price || item.total / item.quantity
          })) : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await response.json();

      // Handle Mock Payment Mode
      if (orderData.isMock) {
        console.log('Processing MOCK payment for order:', orderData.id);
        toast({
          title: "Mock Payment Mode",
          description: "Processing simulated payment...",
        });

        // Simulate processing delay then success
        setTimeout(() => {
          handlePaymentSuccess({
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_order_id: orderData.id,
            razorpay_signature: "MOCK_PAYMENT_SIGNATURE"
          });
        }, 1500);
        return;
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayConfig.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Liminara cosmatics',
        description: productDetails?.name || 'Product Purchase',
        order_id: orderData.id,
        prefill: {
          name: customerDetails?.name,
          email: customerDetails?.email,
          contact: customerDetails?.contact,
        },
        notes: {
          address: customerDetails?.address,
          product_id: productDetails?.id,
          product_name: productDetails?.name,
          quantity: productDetails?.isMultipleItems ? productDetails.orderItems?.reduce((sum: any, item: any) => sum + item.quantity, 0) : '1',
          is_cart_order: productDetails?.isMultipleItems ? 'true' : 'false'
        },
        theme: {
          color: '#4B3A2F'
        },
        method: preferredMethod ? {
          [preferredMethod]: true
        } : undefined,
        handler: function (response: any) {
          setRazorpayActive(false);
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setRazorpayActive(false);
            console.log('Payment modal dismissed');
          }
        }
      };

      if (razorpayActive) {
        console.warn('Razorpay checkout already active');
        return;
      }

      const rzp = new window.Razorpay(options);
      setRazorpayActive(true);
      rzp.open();

    } catch (error) {
      console.error('Razorpay payment failed:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unable to initialize payment.",
        variant: "destructive",
      });
      setLoading(false);
      setRazorpayActive(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Verify payment with backend
      const verifyResponse = await fetch('/api/verify-razorpay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          customerDetails,
          productId: isDirectCheckout ? orderItems[0]?.product?.id : (orderItems[0]?.product?.id || orderItems[0]?.productId),
          quantity: !isDirectCheckout && orderItems.length > 1 ? orderItems.reduce((sum, item) => sum + item.quantity, 0) : 1,
          orderItems: !isDirectCheckout && orderItems.length > 1 ? orderItems : undefined,
          isCartOrder: !isDirectCheckout && orderItems.length > 1
        }),
      });

      const result = await verifyResponse.json();

      if (result.success) {
        // Order created successfully by verification endpoint
        toast({
          title: "Payment Successful!",
          description: `Order ${result.orderId} created successfully.`,
        });

        // Clear local storage
        localStorage.removeItem('checkoutType');
        localStorage.removeItem('buyNowItem');
        localStorage.removeItem('checkoutItems');
        localStorage.removeItem('localCart');

        queryClient.invalidateQueries({ queryKey: ["/api/cart"] });

        navigate(`/order-success?orderId=${result.orderId}`);
      } else {
        throw new Error(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast({
        title: "Payment Verification Failed",
        description: error instanceof Error ? error.message : "Payment processed but order creation failed.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (userLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading checkout...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderItems.length === 0 && !cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Items to Checkout</h2>
            <p className="text-gray-600 mb-4">Your cart is empty or checkout session expired.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmWhite">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-darkBrown mb-2">Secure Checkout</h1>
          <p className="text-primary">Complete your order with real-time payment processing</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${checkoutStep === 'details' ? 'text-primary' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep === 'details' ? 'wood-texture text-white' : 'bg-green-600 text-white'
                }`}>
                {checkoutStep === 'details' ? '1' : '✓'}
              </div>
              <span className="font-medium">Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300" />
            <div className={`flex items-center space-x-2 ${checkoutStep === 'payment' ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${checkoutStep === 'payment' ? 'wood-texture text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.imageUrl || '/placeholder-furniture.jpg'}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.product.name}</div>
                      <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">₹{item.total.toFixed(2)}</div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {checkoutStep === 'details' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDetailsSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerDetails.name}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                          data-testid="input-customer-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact">Phone Number *</Label>
                        <Input
                          id="contact"
                          value={customerDetails.contact}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, contact: e.target.value }))}
                          placeholder="Enter your phone number"
                          required
                          data-testid="input-customer-phone"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email (optional)"
                        data-testid="input-customer-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Shipping Address *</Label>
                      <Textarea
                        id="address"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your complete shipping address"
                        rows={3}
                        required
                        data-testid="input-customer-address"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">PIN Code *</Label>
                        <Input
                          id="pincode"
                          value={customerDetails.pincode}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="Enter PIN code"
                          required
                          data-testid="input-customer-pincode"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 wood-texture text-white hover:opacity-90 transition-opacity"
                        data-testid="button-continue-to-payment"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div><strong>Name:</strong> {customerDetails.name}</div>
                      <div><strong>Phone:</strong> {customerDetails.contact}</div>
                      {customerDetails.email && <div><strong>Email:</strong> {customerDetails.email}</div>}
                      <div><strong>Address:</strong> {customerDetails.address}</div>
                      <div><strong>PIN Code:</strong> {customerDetails.pincode}</div>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary text-primary hover:bg-primary/10"
                        onClick={() => setCheckoutStep('details')}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* UPI Payment */}
                      {razorpayConfig?.enabled && (
                        <Button
                          onClick={() => handlePaymentMethod('upi')}
                          disabled={loading}
                          className={`w-full h-16 justify-start space-x-4 ${selectedPaymentMethod === 'upi' ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'} hover:bg-purple-50 text-gray-800 border`}
                          variant="outline"
                        >
                          {loading && selectedPaymentMethod === 'upi' ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <QrCode className="h-6 w-6 text-purple-600" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold">UPI Payment</div>
                            <div className="text-xs text-gray-600">Pay via UPI apps (Google Pay, PhonePe, Paytm)</div>
                          </div>
                        </Button>
                      )}

                      {/* Credit/Debit Cards */}
                      {razorpayConfig?.enabled && (
                        <Button
                          onClick={() => handlePaymentMethod('card')}
                          disabled={loading}
                          className={`w-full h-16 justify-start space-x-4 ${selectedPaymentMethod === 'card' ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'} hover:bg-orange-50 text-gray-800 border`}
                          variant="outline"
                        >
                          {loading && selectedPaymentMethod === 'card' ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <CreditCard className="h-6 w-6 text-[#4B3A2F]" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold">Credit / Debit Card</div>
                            <div className="text-xs text-gray-600">Visa, MasterCard, RuPay, AMEX</div>
                          </div>
                        </Button>
                      )}

                      {/* Net Banking */}
                      {razorpayConfig?.enabled && (
                        <Button
                          onClick={() => handlePaymentMethod('netbanking')}
                          disabled={loading}
                          className={`w-full h-16 justify-start space-x-4 ${selectedPaymentMethod === 'netbanking' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} hover:bg-green-50 text-gray-800 border`}
                          variant="outline"
                        >
                          {loading && selectedPaymentMethod === 'netbanking' ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Building className="h-6 w-6 text-green-600" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold">Net Banking</div>
                            <div className="text-xs text-gray-600">All major banks supported</div>
                          </div>
                        </Button>
                      )}

                      {/* Wallet */}
                      {razorpayConfig?.enabled && (
                        <Button
                          onClick={() => handlePaymentMethod('wallet')}
                          disabled={loading}
                          className={`w-full h-16 justify-start space-x-4 ${selectedPaymentMethod === 'wallet' ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'} hover:bg-red-50 text-gray-800 border`}
                          variant="outline"
                        >
                          {loading && selectedPaymentMethod === 'wallet' ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Banknote className="h-6 w-6 text-orange-600" />
                          )}
                          <div className="text-left">
                            <div className="font-semibold">Digital Wallets</div>
                            <div className="text-xs text-gray-600">Paytm, Mobikwik, FreeCharge, etc.</div>
                          </div>
                        </Button>
                      )}

                      {/* Cash on Delivery */}
                      <Button
                        onClick={() => handlePaymentMethod('cod')}
                        disabled={loading}
                        className={`w-full h-16 justify-start space-x-4 ${selectedPaymentMethod === 'cod' ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'} hover:bg-amber-50 text-gray-800 border`}
                        variant="outline"
                      >
                        {loading && selectedPaymentMethod === 'cod' ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <Truck className="h-6 w-6 text-amber-600" />
                        )}
                        <div className="text-left">
                          <div className="font-semibold">Cash on Delivery</div>
                          <div className="text-xs text-gray-600">Pay when your order arrives</div>
                        </div>
                      </Button>
                    </div>

                    <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Secure payment gateway</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>SSL encrypted transactions</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}