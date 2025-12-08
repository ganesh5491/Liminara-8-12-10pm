import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Truck,
  Tag,
  BarChart3,
  Shield,
  FolderOpen,
  HelpCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", permission: null },
  { title: "Products", icon: Package, path: "/admin/products", permission: "products" },
  { title: "Categories", icon: FolderOpen, path: "/admin/categories", permission: "products" },
  { title: "Orders", icon: ShoppingCart, path: "/admin/orders", permission: "orders" },
  { title: "Customers", icon: Users, path: "/admin/customers", permission: "users" },
  { title: "Delivery Agents", icon: Truck, path: "/admin/delivery-agents", permission: "manageDelivery" },
  { title: "Inquiries", icon: MessageSquare, path: "/admin/inquiries", permission: "inquiries" },
  { title: "Reviews", icon: Star, path: "/admin/reviews", permission: "reviews" },
  { title: "Q&A", icon: HelpCircle, path: "/admin/questions", permission: "questions" },
  { title: "Coupons", icon: Tag, path: "/admin/coupons", permission: "products" },
  { title: "Reports", icon: BarChart3, path: "/admin/reports", permission: "salesDashboard" },
  { title: "Admin Users", icon: Shield, path: "/admin/admin-users", permission: "manageAdmins" },
  { title: "Settings", icon: Settings, path: "/admin/settings", permission: "settings" },
];

export default function AdminLayout() {
  const { adminUser, isLoading, isAuthenticated, logout, checkPermission } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && adminUser?.mustChangePassword && location.pathname !== "/admin/change-password") {
      navigate("/admin/change-password");
    }
  }, [isAuthenticated, adminUser, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredMenuItems = menuItems.filter(
    (item) => item.permission === null || checkPermission(item.permission)
  );

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Liminara Admin
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredMenuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.path}
                      >
                        <Link to={item.path} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={adminUser?.profileImageUrl} />
                <AvatarFallback className="bg-pink-100 text-pink-600">
                  {adminUser?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{adminUser?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {adminUser?.role?.displayName || "Admin"}
                </p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-4 border-b bg-white px-4 h-14">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-lg font-semibold">
                {menuItems.find((item) => item.path === location.pathname)?.title || "Admin Panel"}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={adminUser?.profileImageUrl} />
                    <AvatarFallback className="bg-pink-100 text-pink-600">
                      {adminUser?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{adminUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{adminUser?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/profile" data-testid="link-admin-profile">
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/change-password" data-testid="link-change-password">
                    <Settings className="mr-2 h-4 w-4" />
                    Change Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600" data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
