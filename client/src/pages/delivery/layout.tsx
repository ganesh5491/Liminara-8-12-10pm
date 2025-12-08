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
  Clock,
  CheckCircle,
  Settings,
  LogOut,
  Truck,
  User,
  XCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/delivery/dashboard" },
  { title: "Pending Deliveries", icon: Clock, path: "/delivery/pending" },
  { title: "Active Delivery", icon: Truck, path: "/delivery/active" },
  { title: "Completed", icon: CheckCircle, path: "/delivery/completed" },
  { title: "Cancelled", icon: XCircle, path: "/delivery/cancelled" },
  { title: "Profile", icon: User, path: "/delivery/profile" },
];

export default function DeliveryLayout() {
  const { deliveryAgent, isLoading, isDeliveryAuthenticated, deliveryLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isDeliveryAuthenticated) {
      navigate("/delivery/login");
    }
  }, [isLoading, isDeliveryAuthenticated, navigate]);

  useEffect(() => {
    if (isDeliveryAuthenticated && deliveryAgent?.mustChangePassword && location.pathname !== "/delivery/change-password") {
      navigate("/delivery/change-password");
    }
  }, [isDeliveryAuthenticated, deliveryAgent, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isDeliveryAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await deliveryLogout();
    navigate("/delivery/login");
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
            <Link to="/delivery/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Delivery Portal
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
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
                <AvatarImage src={deliveryAgent?.profileImageUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {deliveryAgent?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{deliveryAgent?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Delivery Agent
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
                {menuItems.find((item) => item.path === location.pathname)?.title || "Delivery Dashboard"}
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={deliveryAgent?.profileImageUrl} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {deliveryAgent?.name?.charAt(0) || "D"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{deliveryAgent?.name}</p>
                    <p className="text-xs text-muted-foreground">{deliveryAgent?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/delivery/profile" data-testid="link-delivery-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/delivery/change-password" data-testid="link-change-password">
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
