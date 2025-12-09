import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  mustChangePassword?: boolean;
  role?: {
    name: string;
    displayName: string;
  };
  permissions: Record<string, boolean>;
}

interface DeliveryAgent {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImageUrl?: string;
  totalDeliveries?: number;
  completedDeliveries?: number;
  cancelledDeliveries?: number;
  rating?: string;
  earnings?: string;
  mustChangePassword?: boolean;
  vehicleType?: string;
  vehicleNumber?: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  deliveryAgent: DeliveryAgent | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDeliveryAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean }>;
  deliveryLogin: (email: string, password: string) => Promise<{ success: boolean; mustChangePassword?: boolean }>;
  logout: () => Promise<void>;
  deliveryLogout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  changeDeliveryPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [deliveryAgent, setDeliveryAgent] = useState<DeliveryAgent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/admin/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const user = await response.json();
        setAdminUser(user);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      setAdminUser(null);
    }
  };

  const refreshDeliveryAgent = async () => {
    try {
      const response = await fetch("/api/delivery/auth/me", {
        credentials: "include",
      });
      if (response.ok) {
        const agent = await response.json();
        setDeliveryAgent(agent);
      } else {
        setDeliveryAgent(null);
      }
    } catch (error) {
      setDeliveryAgent(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      await Promise.all([refreshUser(), refreshDeliveryAgent()]);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return { success: false };
      }

      await refreshUser();
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });

      return { success: true, mustChangePassword: data.user?.mustChangePassword };
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deliveryLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/delivery/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return { success: false };
      }

      await refreshDeliveryAgent();
      toast({
        title: "Login Successful",
        description: "Welcome to the delivery dashboard",
      });

      return { success: true, mustChangePassword: data.agent?.mustChangePassword };
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAdminUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const deliveryLogout = async () => {
    try {
      await fetch("/api/delivery/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setDeliveryAgent(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password",
          variant: "destructive",
        });
        return false;
      }

      await refreshUser();
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing password",
        variant: "destructive",
      });
      return false;
    }
  };

  const changeDeliveryPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch("/api/delivery/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        toast({
          title: "Password Change Failed",
          description: data.message || "Failed to change password",
          variant: "destructive",
        });
        return false;
      }

      await refreshDeliveryAgent();
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while changing password",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkPermission = (permission: string) => {
    if (!adminUser) return false;
    return adminUser.permissions[permission] === true;
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        deliveryAgent,
        isLoading,
        isAuthenticated: !!adminUser,
        isDeliveryAuthenticated: !!deliveryAgent,
        login,
        deliveryLogin,
        logout,
        deliveryLogout,
        changePassword,
        changeDeliveryPassword,
        checkPermission,
        refreshUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
