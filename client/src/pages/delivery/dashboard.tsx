import { useQuery } from "@tanstack/react-query";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
} from "lucide-react";

interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  cancelledDeliveries: number;
  todayDeliveries: number;
  rating: string;
  earnings: string;
  activeOrders: any[];
}

export default function DeliveryDashboard() {
  const { deliveryAgent } = useAdmin();

  const { data: stats, isLoading } = useQuery<DeliveryStats>({
    queryKey: ["/api/delivery/stats"],
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const statCards = [
    {
      title: "Total Deliveries",
      value: stats?.totalDeliveries || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completed",
      value: stats?.completedDeliveries || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending",
      value: stats?.pendingDeliveries || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Cancelled",
      value: stats?.cancelledDeliveries || 0,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-indigo-100 text-indigo-800";
      case "failed":
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
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {deliveryAgent?.name?.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground">Here's your delivery overview</p>
        </div>
      </div>

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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.todayDeliveries || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.rating || "N/A"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {stats?.earnings ? formatCurrency(stats.earnings) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Active Orders</CardTitle>
            <CardDescription>Orders assigned to you</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" data-testid="button-view-all">
            <Link to="/delivery/pending">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.activeOrders?.slice(0, 5).map((order: any) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
                data-testid={`card-order-${order.id}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </span>
                    <Badge className={getStatusColor(order.deliveryStatus)}>
                      {order.deliveryStatus?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {order.city}, {order.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  data-testid={`button-view-order-${order.id}`}
                >
                  <Link to={`/delivery/order/${order.id}`}>View</Link>
                </Button>
              </div>
            ))}
            {(!stats?.activeOrders || stats.activeOrders.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No active orders at the moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
