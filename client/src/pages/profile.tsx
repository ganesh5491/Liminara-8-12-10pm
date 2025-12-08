import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Package, Settings, LogOut, MapPin, Phone, Mail, Save, X, Heart, ShoppingCart, MessageCircle, Receipt, Camera, ImageIcon, Trash2, TrendingUp, Calendar, CreditCard, Filter, Search, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@shared/schema";
import ReceiptModal from "@/components/receipt-modal";
import OrderTrackingModal from "@/components/order-tracking-modal";
import OrderCancellationModal from "@/components/order-cancellation-modal";

// Extended order type that includes orderItems relation
type OrderWithItems = Order & {
  orderItems?: Array<{
    quantity: number;
    product?: {
      name: string;
    };
  }>;
};

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [showTracking, setShowTracking] = useState<boolean>(false);
  const [showCancellation, setShowCancellation] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [cancellationOrder, setCancellationOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 70830 96332",
    address: "123 Home Street, Mumbai, Maharashtra 400001",
    profileImage: ""
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Order filtering and search state
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");

  // Auto-scroll to orders section if hash is present
  useEffect(() => {
    if (window.location.hash === '#orders') {
      setTimeout(() => {
        const ordersSection = document.getElementById('orders-section');
        if (ordersSection) {
          ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Show a toast message for successful order completion
          toast({
            title: "Order placed successfully!",
            description: "Your order has been confirmed. You can track it below.",
          });
        }
      }, 500); // Small delay to ensure component is fully rendered
    }
  }, [toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  // Check authentication status using React Query (same as navigation)
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Use real user data from Auth0
  const currentUser = {
    name: user ? ((user as any).name || `${(user as any).given_name || ''} ${(user as any).family_name || ''}`.trim() || 'User') : "User",
    email: (user as any)?.email || "",
    phone: (user as any)?.phone || "", // Will be populated from profile update
    address: (user as any)?.address || "", // Will be populated from profile update
    joinDate: "Recently",
    profileImage: (user as any)?.picture
  };

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        recentOrderStatus: 'N/A',
        memberSince: 'Recently'
      };
    }

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (parseFloat(order.total as any) || 0), 0);
    const recentOrder = orders[0];
    const recentOrderStatus = recentOrder?.status || 'N/A';

    return {
      totalOrders,
      totalSpent,
      recentOrderStatus,
      memberSince: currentUser.joinDate
    };
  }, [orders, currentUser.joinDate]);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply status filter
    if (orderFilter !== "all") {
      filtered = filtered.filter(order =>
        order.status?.toLowerCase() === orderFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (orderSearch.trim()) {
      const searchLower = orderSearch.toLowerCase();
      filtered = filtered.filter(order => {
        // Search by order ID
        const orderIdMatch = order.id?.toLowerCase().includes(searchLower);

        // Search by product name
        const productMatch = order.orderItems?.some(item =>
          item.product?.name?.toLowerCase().includes(searchLower)
        );

        return orderIdMatch || productMatch;
      });
    }

    return filtered;
  }, [orders, orderFilter, orderSearch]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const response = await apiRequest('PUT', '/api/auth/profile', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address
      });

      return response.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      });
      setIsEditing(false);
      // Refresh user data queries
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = () => {
    setEditForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      profileImage: currentUser.profileImage || ""
    });
    setProfileImagePreview(currentUser.profileImage || null);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setEditForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
      profileImage: currentUser.profileImage || ""
    });
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }

      setProfileImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        setEditForm(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setEditForm(prev => ({
      ...prev,
      profileImage: ""
    }));
  };


  const { logout: contextLogout } = useAuth();

  const handleLogout = async () => {
    try {
      // Show immediate feedback
      toast({
        title: "Logging out...",
        description: "Please wait while we log you out.",
      });

      // First clear all React Query cache immediately
      queryClient.clear();

      // Force invalidate specific auth queries
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.removeQueries({ queryKey: ["/api/auth/me"] });

      // Clear the server session using API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Clear localStorage data
      localStorage.removeItem('localCart');
      localStorage.removeItem('localWishlist');

      // Force reload to ensure all components refresh
      setTimeout(() => {
        // Then clear Auth0 session and redirect
        contextLogout();
        window.location.href = "/";
      }, 100);

    } catch (error) {
      console.error('Logout error:', error);
      // If server logout fails, still clear everything
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.removeQueries({ queryKey: ["/api/auth/me"] });
      localStorage.removeItem('localCart');
      localStorage.removeItem('localWishlist');

      contextLogout();
      window.location.href = "/";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-[#3B2D25]";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewReceipt = (order: any) => {
    setSelectedOrder(order);
    setShowReceipt(true);
  };

  const handleTrackOrder = (order: any) => {
    setTrackingOrder(order);
    setShowTracking(true);
  };

  const handleCancelOrder = (order: any) => {
    setCancellationOrder(order);
    setShowCancellation(true);
  };

  const handleCancellationComplete = () => {
    // Refresh orders after cancellation
    queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
  };

  const handleViewDetails = (order: any) => {
    // Reuse the receipt modal for detailed order view
    handleViewReceipt(order);
  };

  return (
    <div className="py-20 bg-warmWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-darkBrown mb-4">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        {/* User Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <Card className="hover-lift transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <h3 className="text-3xl font-bold text-darkBrown mt-2">{userStats.totalOrders}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="hover-lift transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <h3 className="text-3xl font-bold text-darkBrown mt-2">₹{userStats.totalSpent.toFixed(2)}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Order Status */}
          <Card className="hover-lift transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Order</p>
                  <h3 className="text-xl font-bold text-darkBrown mt-2 capitalize">
                    {userStats.recentOrderStatus}
                  </h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Since */}
          <Card className="hover-lift transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <h3 className="text-xl font-bold text-darkBrown mt-2">{userStats.memberSince}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 wood-texture rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden relative">
                    {(isEditing ? profileImagePreview : currentUser.profileImage) ? (
                      <img
                        src={isEditing ? profileImagePreview! : currentUser.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}

                    {/* Profile Picture Upload Options - Only show when editing */}
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2 flex space-x-1">
                        {/* Gallery Upload */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                          />
                          <div className="w-8 h-8 bg-[#4B3A2F] hover:bg-[#3B2D25] rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        </label>

                        {/* Camera Upload */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleProfileImageUpload}
                            className="hidden"
                          />
                          <div className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors">
                            <Camera className="w-4 h-4" />
                          </div>
                        </label>

                        {/* Remove Image */}
                        {(profileImagePreview || currentUser.profileImage) && (
                          <button
                            onClick={removeProfileImage}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Upload Instructions - Only show when editing and no image */}
                  {isEditing && !profileImagePreview && !currentUser.profileImage && (
                    <p className="text-xs text-gray-500 mb-2">
                      Click gallery or camera icon to add profile picture
                    </p>
                  )}
                  <h3 className="text-xl font-display font-semibold text-darkBrown" data-testid="profile-name">
                    {currentUser.name}
                  </h3>
                  <p className="text-gray-600">Customer since {currentUser.joinDate}</p>
                  {(user as any)?.provider && (
                    <p className="text-sm text-gray-500">Signed in with {(user as any).provider.charAt(0).toUpperCase() + (user as any).provider.slice(1)}</p>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="w-full"
                        data-testid="input-edit-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="flex-1"
                          data-testid="input-edit-email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <Input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          className="flex-1"
                          data-testid="input-edit-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-3" />
                        <Textarea
                          value={editForm.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Enter your address"
                          rows={3}
                          className="flex-1 resize-none"
                          data-testid="textarea-edit-address"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600" data-testid="profile-email">{currentUser.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600" data-testid="profile-phone">{currentUser.phone || "No phone number provided"}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-gray-600" data-testid="profile-address">{currentUser.address || "No address provided"}</span>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      data-testid="button-save-profile"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={updateProfileMutation.isPending}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      data-testid="button-cancel-edit"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    data-testid="button-edit-profile"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/wishlist">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-darkBrown hover:bg-primary hover:text-white transition-all duration-200"
                    data-testid="button-view-wishlist"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    View Wishlist
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-darkBrown hover:bg-primary hover:text-white transition-all duration-200"
                    data-testid="button-view-cart"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Cart
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    const ordersSection = document.getElementById('orders-section');
                    if (ordersSection) {
                      ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  variant="ghost"
                  className="w-full justify-start text-darkBrown hover:bg-primary hover:text-white transition-all duration-200"
                  data-testid="button-view-order-history"
                >
                  <Package className="mr-2 h-4 w-4" />
                  View Order History
                </Button>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-darkBrown hover:bg-primary hover:text-white transition-all duration-200"
                    data-testid="button-contact-support"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2" id="orders-section">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Order History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filter and Search Section */}
                {orders.length > 0 && (
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search Input */}
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search by order ID or product name..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        {orderSearch && (
                          <button
                            onClick={() => setOrderSearch("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Status Filter */}
                      <div className="sm:w-48">
                        <div className="relative">
                          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          <select
                            value={orderFilter}
                            onChange={(e) => setOrderFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white cursor-pointer"
                          >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <p>
                        Showing <span className="font-semibold text-darkBrown">{filteredOrders.length}</span> of{" "}
                        <span className="font-semibold text-darkBrown">{orders.length}</span> orders
                      </p>
                      {(orderFilter !== "all" || orderSearch) && (
                        <button
                          onClick={() => {
                            setOrderFilter("all");
                            setOrderSearch("");
                          }}
                          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Clear filters
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-6 bg-gray-200 rounded w-20" />
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-24" />
                      </div>
                    ))}
                  </div>
                ) : filteredOrders.length === 0 && orders.length > 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                    <Button
                      onClick={() => {
                        setOrderFilter("all");
                        setOrderSearch("");
                      }}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Package className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                    <Link to="/products">
                      <Button className="wood-texture text-white" data-testid="button-start-shopping">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="orders-list">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="bg-beige rounded-lg p-6 hover-lift transition-all">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-darkBrown" data-testid={`order-id-${order.id}`}>
                                Order #{order.id.slice(-8).toUpperCase()}
                              </h4>
                              <Badge className={getStatusColor(order.status || 'pending')} data-testid={`order-status-${order.id}`}>
                                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                              </Badge>
                            </div>

                            <p className="text-gray-600 mb-2" data-testid={`order-items-${order.id}`}>
                              {order.orderItems?.length || 0} items - ₹{order.total}
                            </p>

                            <p className="text-sm text-gray-500" data-testid={`order-date-${order.id}`}>
                              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              }) : 'Unknown date'}
                            </p>

                            {order.orderItems && order.orderItems.length > 0 && (
                              <div className="mt-3">
                                <div className="flex flex-wrap gap-3">
                                  {order.orderItems.slice(0, 3).map((item: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200"
                                      onClick={() => {
                                        if (item.productId) {
                                          navigate(`/product/${item.productId}`);
                                        }
                                      }}
                                      data-testid={`order-product-item-${order.id}-${index}`}
                                    >
                                      {/* Product Image */}
                                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {item.product?.imageUrl ? (
                                          <img
                                            src={item.product.imageUrl}
                                            alt={item.product?.name || "Product"}
                                            className="w-full h-full object-cover"
                                            data-testid={`order-product-image-${order.id}-${index}`}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                            <span className="text-xs text-primary font-medium">IMG</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Product Details */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate hover:text-primary transition-colors" data-testid={`order-product-name-${order.id}-${index}`}>
                                          {item.product?.name || "Product"}
                                        </p>
                                        <p className="text-xs text-gray-500" data-testid={`order-product-quantity-${order.id}-${index}`}>
                                          Quantity: {item.quantity}
                                        </p>
                                      </div>

                                      {/* Click indicator */}
                                      <div className="text-gray-400 hover:text-primary transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      </div>
                                    </div>
                                  ))}
                                  {order.orderItems.length > 3 && (
                                    <div className="flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                                      <span className="text-sm text-gray-600 font-medium">
                                        +{order.orderItems.length - 3} more items
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                            <Button
                              onClick={() => handleViewReceipt(order)}
                              variant="outline"
                              size="sm"
                              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                              data-testid={`button-view-receipt-${order.id}`}
                            >
                              <Receipt className="w-4 h-4 mr-1" />
                              Receipt
                            </Button>
                            <Button
                              onClick={() => handleTrackOrder(order)}
                              variant="outline"
                              size="sm"
                              className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                              data-testid={`button-track-order-${order.id}`}
                            >
                              Track Order
                            </Button>
                            <Button
                              onClick={() => handleViewDetails(order)}
                              variant="ghost"
                              size="sm"
                              className="text-darkBrown hover:bg-primary hover:text-white transition-all duration-200"
                              data-testid={`button-view-details-${order.id}`}
                            >
                              View Details
                            </Button>
                            {(order.status === 'pending' || order.status === 'processing' || order.status === 'confirmed') && (
                              <Button
                                onClick={() => handleCancelOrder(order)}
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                                data-testid={`button-cancel-order-${order.id}`}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        orderData={selectedOrder}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={showTracking}
        onClose={() => setShowTracking(false)}
        orderData={trackingOrder}
      />

      {/* Order Cancellation Modal */}
      <OrderCancellationModal
        isOpen={showCancellation}
        onClose={() => setShowCancellation(false)}
        orderData={cancellationOrder}
        onCancellationComplete={handleCancellationComplete}
      />
    </div>
  );
}
