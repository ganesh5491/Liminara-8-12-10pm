
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import AuthRedirectHandler from "@/components/auth-redirect-handler";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import CartModal from "@/components/cart-modal";
import WishlistModal from "@/components/wishlist-modal";
import FloatingChat from "@/components/FloatingChat";
import ScrollToTop from "@/components/scroll-to-top";
import RouteScrollToTop from "@/components/route-scroll-to-top";

// Pages
import Home from "@/pages/home";
import Hero from "@/pages/hero";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Wishlist from "@/pages/wishlist";
import Profile from "@/pages/profile";
import Contact from "@/pages/contact";
import Deals from "@/pages/deals";
import Login from "@/pages/login";
import Callback from "@/pages/callback";
import NotFound from "@/pages/not-found";
import AddressPage from "@/pages/address";
import PaymentPage from "@/pages/payment";
import CODPaymentPage from "@/pages/payment-cod";
import PaymentSuccessPage from "@/pages/payment-success";
import OrderSuccessPage from "@/pages/order-success";
import OrderCancelledPage from "@/pages/order-cancelled";
import CheckoutPage from "@/pages/checkout";

// Liminara Pages
import LiminaraHome from "@/pages/liminara-home";
import PharmaProducts from "@/pages/pharma-products";
import CosmeticsProducts from "@/pages/cosmetics-products";
import ProductDetailLiminara from "@/pages/product-detail-liminara";
import AboutLiminara from "@/pages/about-liminara";
import B2BPage from "@/pages/b2b";
import CertificationsPage from "@/pages/certifications";
import ManufacturingPage from "@/pages/manufacturing";
import ContactLiminara from "@/pages/contact-liminara";

// Legal Pages
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import ProductSafety from "@/pages/product-safety";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminChangePassword from "@/pages/admin/change-password";
import AdminProducts from "@/pages/admin/products";
import AdminOrders from "@/pages/admin/orders";
import AdminCategories from "@/pages/admin/categories";
import AdminCustomers from "@/pages/admin/customers";
import AdminDeliveryAgents from "@/pages/admin/delivery-agents";
import AdminInquiries from "@/pages/admin/inquiries";
import AdminReviews from "@/pages/admin/reviews";
import AdminQuestions from "@/pages/admin/questions";
import AdminCoupons from "@/pages/admin/coupons";
import AdminUsers from "@/pages/admin/admin-users";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";

// Delivery Pages
import DeliveryLogin from "@/pages/delivery/login";
import DeliveryLayout from "@/pages/delivery/layout";
import DeliveryDashboard from "@/pages/delivery/dashboard";

function MainAppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warmWhite">
      <Navigation
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="hero" element={<Hero />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Profile />} />
          <Route path="contact" element={<Contact />} />
          <Route path="deals" element={<Deals />} />

          {/* Liminara Routes */}
          <Route path="liminara" element={<LiminaraHome />} />
          <Route path="pharma" element={<PharmaProducts />} />
          <Route path="cosmetics" element={<CosmeticsProducts />} />
          <Route path="product-liminara/:id" element={<ProductDetailLiminara />} />
          <Route path="about-liminara" element={<AboutLiminara />} />
          <Route path="b2b" element={<B2BPage />} />
          <Route path="certifications" element={<CertificationsPage />} />
          <Route path="manufacturing" element={<ManufacturingPage />} />
          <Route path="contact-liminara" element={<ContactLiminara />} />

          {/* Auth Routes */}
          <Route path="auth" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="callback" element={<Callback />} />

          {/* Checkout Flow Routes */}
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="address" element={<AddressPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="payment/cod" element={<CODPaymentPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="order-cancelled" element={<OrderCancelledPage />} />

          {/* Legal Routes */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-conditions" element={<TermsConditions />} />
          <Route path="product-safety" element={<ProductSafety />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Modals */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* Floating Chat Icon */}
      <FloatingChat />

      {/* Helpers */}
      <ScrollToTop />
      <RouteScrollToTop />
      <AuthRedirectHandler />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDeliveryRoute = location.pathname.startsWith("/delivery");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/change-password" element={<AdminChangePassword />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="delivery-agents" element={<AdminDeliveryAgents />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="questions" element={<AdminQuestions />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  if (isDeliveryRoute) {
    return (
      <Routes>
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route path="dashboard" element={<DeliveryDashboard />} />
        </Route>
      </Routes>
    );
  }

  return <MainAppContent />;
}

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <AdminProvider>
              <AppContent />
              <Toaster />
            </AdminProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
