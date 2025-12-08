import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, User, Phone, Mail, MapPin, Hash, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Edit2, Trash2, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { type UserAddress } from "@shared/schema";

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [isBuyNow, setIsBuyNow] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Store current page as return URL
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/login');
      return;
    }
  }, [isAuthenticated, location, navigate]);



  // Fetch user addresses
  const { data: addresses = [], isLoading: isLoadingAddresses, refetch: refetchAddresses } = useQuery<UserAddress[]>({
    queryKey: ["/api/user/addresses"],
    enabled: isAuthenticated
  });

  // Pre-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.firstName + ' ' + (user.lastName || '') || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Set selected address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find((a: any) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses]);

  const createAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/user/addresses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/addresses"] });
      toast({
        title: "Address Added",
        description: "New address has been added successfully."
      });
      setIsAddressModalOpen(false);
      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const res = await apiRequest("PUT", `/api/user/addresses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/addresses"] });
      toast({
        title: "Address Updated",
        description: "Address has been updated successfully."
      });
      setIsAddressModalOpen(false);
      setEditingAddress(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/user/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/addresses"] });
      toast({
        title: "Address Deleted",
        description: "Address has been deleted successfully."
      });
      if (selectedAddressId === editingAddress?.id) {
        setSelectedAddressId("new");
      }
    }
  });

  // Check if this is a direct buy now flow or cart checkout
  useEffect(() => {
    const checkoutType = localStorage.getItem('checkoutType');
    const buyNowStored = localStorage.getItem('buyNowItem');
    const cartStored = localStorage.getItem('checkoutItems');

    if (checkoutType === 'direct' && buyNowStored) {
      setIsBuyNow(true);
      setBuyNowItem(JSON.parse(buyNowStored));
    } else if (checkoutType === 'cart' && cartStored) {
      setIsCartCheckout(true);
      setCheckoutItems(JSON.parse(cartStored));
    }
  }, []);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
    enabled: !isBuyNow && !isCartCheckout // Only fetch cart if not in buy now or cart checkout mode
  });

  // Calculate totals based on buy now, cart checkout, or regular cart
  const items = isBuyNow ? [buyNowItem] :
    isCartCheckout ? checkoutItems :
      (cartItems as any[]);

  const total = isBuyNow && buyNowItem ?
    buyNowItem.total :
    isCartCheckout ?
      checkoutItems.reduce((sum: number, item: any) => sum + item.total, 0) :
      (cartItems as any[]).reduce((sum: number, item: any) =>
        sum + (parseFloat(item.product?.price || "0") * item.quantity), 0
      );
  const shipping = 0; // Free shipping on all orders
  const finalTotal = total;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalAddressData;

    if (selectedAddressId === "new") {
      // Validation for new address
      if (!formData.name || !formData.phone || !formData.address || !formData.pincode || !formData.city || !formData.state) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      if (formData.phone.length < 10) {
        toast({
          title: "Invalid Phone",
          description: "Please enter a valid 10-digit phone number.",
          variant: "destructive"
        });
        return;
      }

      if (formData.pincode.length !== 6) {
        toast({
          title: "Invalid Pincode",
          description: "Please enter a valid 6-digit pincode.",
          variant: "destructive"
        });
        return;
      }

      finalAddressData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        pincode: formData.pincode
      };

      // Save this new address to profile if user wants
      if (formData.isDefault) {
        createAddressMutation.mutate(formData);
      }
    } else {
      // Use selected existing address
      const selectedAddr = addresses.find((a: any) => a.id === selectedAddressId);
      if (!selectedAddr) return;

      finalAddressData = {
        customerName: selectedAddr.name,
        customerPhone: selectedAddr.phone,
        customerEmail: selectedAddr.email,
        shippingAddress: `${selectedAddr.address}, ${selectedAddr.city}, ${selectedAddr.state}`,
        pincode: selectedAddr.pincode
      };
    }

    // Store address data and checkout type in localStorage
    localStorage.setItem('checkoutAddress', JSON.stringify(finalAddressData));
    localStorage.setItem('checkoutType', isBuyNow ? 'direct' : 'cart');
    navigate('/checkout');
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      email: address.email || "",
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: formData });
    } else {
      createAddressMutation.mutate(formData);
    }
  };

  const handleGoBack = () => {
    const checkoutType = localStorage.getItem('checkoutType');
    if (checkoutType === 'cart' || isCartCheckout) {
      navigate('/cart');
    } else {
      navigate('/products');
    }
  };

  if ((!isBuyNow && !isCartCheckout && isLoading) ||
    (!isBuyNow && !isCartCheckout && (cartItems as any[]).length === 0) ||
    (isBuyNow && !buyNowItem) ||
    (isCartCheckout && checkoutItems.length === 0)) {
    return (
      <div className="py-20 bg-warmWhite min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-display font-semibold text-darkBrown mb-4">
              {isLoading ? "Loading..." : "No items found"}
            </h2>
            <p className="text-gray-600 mb-8">
              {isLoading ? "Please wait while we load your items." : "Please add items to continue with checkout."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-20 bg-warmWhite min-h-screen">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-darkBrown"
            data-testid="button-go-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {isCartCheckout || localStorage.getItem('checkoutType') === 'cart' ? 'Back to Cart' : 'Back to Products'}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                1
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-primary">Address</span>
            </div>
            <div className="w-6 sm:w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">Payment</span>
            </div>
            <div className="w-6 sm:w-12 h-px bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">Success</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-bold text-darkBrown text-center mb-2 sm:mb-4">
            Shipping Address
          </h1>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Enter your details for delivery
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Address Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-darkBrown">
                  <MapPin className="mr-2 h-5 w-5" />
                  Delivery Information
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleAddNewAddress} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </CardHeader>
              <CardContent className="max-h-[80vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Saved Addresses */}
                  {addresses.length > 0 && (
                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="space-y-4">
                      {addresses.map((address: any) => (
                        <div key={address.id} className={`relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={address.id} className="cursor-pointer font-medium text-darkBrown flex items-center gap-2">
                              {address.name}
                              {address.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Default</span>}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                            <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEditAddress(address); }} className="h-8 w-8 text-gray-500 hover:text-primary">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); deleteAddressMutation.mutate(address.id); }} className="h-8 w-8 text-gray-500 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className={`relative flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-primary/50'}`}>
                        <RadioGroupItem value="new" id="new-address" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="new-address" className="cursor-pointer font-medium text-darkBrown">
                            Use a different address
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">Enter a new shipping address for this order</p>
                        </div>
                      </div>
                    </RadioGroup>
                  )}

                  {/* New Address Form (Show if no addresses or "new" selected) */}
                  {(addresses.length === 0 || selectedAddressId === "new") && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 border-t pt-6 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="name" className="flex items-center text-darkBrown">
                            <User className="mr-1 h-4 w-4" />
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="flex items-center text-darkBrown">
                            <Phone className="mr-1 h-4 w-4" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit phone number"
                            type="tel"
                            maxLength={10}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center text-darkBrown">
                          <Mail className="mr-1 h-4 w-4" />
                          Email Address (Optional)
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          type="email"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address" className="flex items-center text-darkBrown">
                          <MapPin className="mr-1 h-4 w-4" />
                          Complete Address *
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="House/Flat No., Street, Area"
                          rows={3}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="city" className="text-darkBrown">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-darkBrown">State *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="State"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pincode" className="text-darkBrown">Pincode *</Label>
                          <Input
                            id="pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Pincode"
                            maxLength={6}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="isDefault" className="text-sm text-gray-600 font-normal cursor-pointer">
                          Save this address for future orders
                        </Label>
                      </div>
                    </form>
                  )}

                  <Button
                    onClick={handleSubmit}
                    className="w-full wood-texture text-white py-3 font-semibold text-lg"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Modal */}
          <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modal-name">Full Name</Label>
                    <Input id="modal-name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="modal-phone">Phone</Label>
                    <Input id="modal-phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="modal-email">Email (Optional)</Label>
                  <Input id="modal-email" name="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="modal-address">Address</Label>
                  <Textarea id="modal-address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="modal-city">City</Label>
                    <Input id="modal-city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="modal-state">State</Label>
                    <Input id="modal-state" name="state" value={formData.state} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="modal-pincode">Pincode</Label>
                    <Input id="modal-pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="modal-isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="modal-isDefault">Set as default address</Label>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddressModalOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingAddress ? 'Update' : 'Save'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-darkBrown">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product?.imageUrl || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-darkBrown truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ₹{isBuyNow ? item.price : item.product?.price}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        ₹{isBuyNow ? item.total.toFixed(2) : (parseFloat(item.product?.price || "0") * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-darkBrown border-t pt-2">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}