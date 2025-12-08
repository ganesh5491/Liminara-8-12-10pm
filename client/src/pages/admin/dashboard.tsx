import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  todayOrders: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  recentOrders: any[];
  topProducts: any[];
  pendingOrders: number;
  pendingReviews: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalSales) : "-",
      icon: DollarSign,
      description: "Lifetime sales",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: "All time orders",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Customers",
      value: stats?.totalUsers || 0,
      icon: Users,
      description: "Registered users",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      description: "Active products",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const periodStats = [
    {
      title: "Today's Sales",
      value: stats ? formatCurrency(stats.todaySales) : "-",
      orders: stats?.todayOrders || 0,
      icon: TrendingUp,
    },
    {
      title: "Weekly Sales",
      value: stats ? formatCurrency(stats.weeklySales) : "-",
      icon: TrendingUp,
    },
    {
      title: "Monthly Sales",
      value: stats ? formatCurrency(stats.monthlySales) : "-",
      icon: TrendingUp,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {periodStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{stat.value}</div>
              {stat.orders !== undefined && (
                <p className="text-xs text-muted-foreground">{stat.orders} orders today</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Pending Actions</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </div>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending Orders</span>
                </div>
                <Badge variant="secondary" data-testid="badge-pending-orders">
                  {stats?.pendingOrders || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Pending Reviews</span>
                </div>
                <Badge variant="secondary" data-testid="badge-pending-reviews">
                  {stats?.pendingReviews || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                <div key={product.productId || index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5">
                      #{index + 1}
                    </span>
                    <span className="text-sm truncate">{product.productName || "Unknown"}</span>
                  </div>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {product.totalSold || 0} sold
                  </Badge>
                </div>
              ))}
              {(!stats?.topProducts || stats.topProducts.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sales data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="border-b last:border-0" data-testid={`row-order-${order.id}`}>
                    <td className="py-3 px-2 text-sm font-mono">
                      {order.orderNumber || order.id?.slice(0, 8)}
                    </td>
                    <td className="py-3 px-2 text-sm">{order.customerName}</td>
                    <td className="py-3 px-2 text-sm font-medium">
                      {formatCurrency(parseFloat(order.total || 0))}
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
