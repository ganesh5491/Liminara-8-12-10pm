import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Truck, Loader2, Package, MapPin, Phone, Mail, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, TrendingUp, Plus } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  deliveryAgentId?: string;
  deliveryStatus?: string;
  createdAt: string;
}

interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
}

const orderStatuses = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const deliveryStatuses = [
  "assigned",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
];

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";

export default function OrdersManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders", { status: statusFilter !== "all" ? statusFilter : undefined, search }],
  });

  const { data: deliveryAgents, isLoading: isLoadingAgents, error: agentsError } = useQuery<DeliveryAgent[]>({
    queryKey: ["/api/admin/delivery-agents/available"],
    retry: 3,
    staleTime: 30000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      return apiRequest("PUT", `/api/admin/orders/${id}/status`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Order updated", description: "Order status has been changed" });
    },
  });

  const assignDeliveryMutation = useMutation({
    mutationFn: async ({ orderId, deliveryAgentId }: { orderId: string; deliveryAgentId: string }) => {
      return apiRequest("PUT", `/api/admin/orders/${orderId}/assign-delivery`, { deliveryAgentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Delivery assigned", description: "Delivery agent has been assigned to the order" });
      setIsAssignOpen(false);
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "confirmed":
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipped":
      case "packed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "out_for_delivery":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const filteredOrders = orders?.filter((order) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.customerEmail?.toLowerCase().includes(searchLower) ||
        order.id?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total || "0"), 0) || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0;
  const cancelledOrders = orders?.filter((o) => o.status === "cancelled").length || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusCounts = orders?.reduce((acc, order) => {
    const status = order.status || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" data-testid="tab-order-list">Order List</TabsTrigger>
          <TabsTrigger value="dashboard" data-testid="tab-order-dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatuses.map((status) => {
                    const count = statusCounts[status] || 0;
                    const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(status)}>
                            {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                  {totalOrders === 0 && (
                    <p className="text-center text-muted-foreground py-4">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders
                    ?.slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-full">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">#{order.orderNumber || order.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(order.total)}</p>
                          <Badge className={getStatusColor(order.status)} variant="outline">
                            {order.status?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  {(!orders || orders.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{deliveredOrders}</p>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cancelledOrders}</p>
                    <p className="text-sm text-muted-foreground">Cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {orders?.filter((o) => o.deliveryAgentId).length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Assigned to Delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by ID, customer name, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-orders"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Order</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Payment</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Delivery</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders?.map((order) => (
                        <tr key={order.id} className="border-b last:border-0" data-testid={`row-order-${order.id}`}>
                          <td className="py-3 px-2">
                            <p className="font-mono text-sm">{order.orderNumber || order.id.slice(0, 8)}</p>
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-sm font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                          </td>
                          <td className="py-3 px-2 text-sm font-medium">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">
                              {order.paymentStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status?.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            {order.deliveryAgentId ? (
                              <Badge variant="outline" className="text-xs">
                                {order.deliveryStatus || "assigned"}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not assigned</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsDetailOpen(true);
                                }}
                                data-testid={`button-view-${order.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!order.deliveryAgentId && order.status !== "cancelled" && order.status !== "delivered" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsAssignOpen(true);
                                  }}
                                  data-testid={`button-assign-${order.id}`}
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(!paginatedOrders || paginatedOrders.length === 0) && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-muted-foreground">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {totalPages > 1 && (
                    <div className="py-4">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          <PaginationItem>
                            <span className="px-4 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber || selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onStatusChange={(status, notes) => {
                updateStatusMutation.mutate({ id: selectedOrder.id, status, notes });
              }}
              isUpdating={updateStatusMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Delivery Agent</DialogTitle>
            <DialogDescription>
              Select a delivery agent for order #{selectedOrder?.orderNumber || selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          <AssignDeliveryForm
            order={selectedOrder}
            agents={deliveryAgents || []}
            onAssign={(agentId) => {
              if (selectedOrder) {
                assignDeliveryMutation.mutate({ orderId: selectedOrder.id, deliveryAgentId: agentId });
              }
            }}
            isAssigning={assignDeliveryMutation.isPending}
            onCreateNewAgent={() => {
              setIsAssignOpen(false);
              navigate("/admin/delivery-agents");
            }}
            isLoadingAgents={isLoadingAgents}
            agentsError={agentsError}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderDetails({
  order,
  onStatusChange,
  isUpdating,
}: {
  order: Order;
  onStatusChange: (status: string, notes?: string) => void;
  isUpdating: boolean;
}) {
  const [newStatus, setNewStatus] = useState(order.status);
  const [notes, setNotes] = useState("");

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h4>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p>{order.shippingAddress}</p>
                <p>{order.city}, {order.state} - {order.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Order Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{order.paymentMethod || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant="outline">{order.paymentStatus}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-4">Update Order Status</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger data-testid="select-new-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {orderStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
              data-testid="input-status-notes"
            />
          </div>
          <Button
            onClick={() => onStatusChange(newStatus, notes)}
            disabled={isUpdating || newStatus === order.status}
            className="bg-gradient-to-r from-pink-500 to-purple-500"
            data-testid="button-update-status"
          >
            {isUpdating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
            ) : (
              "Update Status"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignDeliveryForm({
  order,
  agents,
  onAssign,
  isAssigning,
  onCreateNewAgent,
  isLoadingAgents,
  agentsError,
}: {
  order: Order | null;
  agents: DeliveryAgent[];
  onAssign: (agentId: string) => void;
  isAssigning: boolean;
  onCreateNewAgent: () => void;
  isLoadingAgents: boolean;
  agentsError: Error | null;
}) {
  const [selectedAgent, setSelectedAgent] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label>Select Delivery Agent</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateNewAgent}
            className="text-xs h-auto py-1 px-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
            title="Create new delivery agent"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Agent
          </Button>
        </div>
        {isLoadingAgents ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
          </div>
        ) : agentsError ? (
          <div className="py-3 px-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            <p className="font-medium">Failed to load delivery agents</p>
            <p className="text-xs text-red-600 mt-1">{agentsError.message}</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="py-4 px-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 font-medium">No delivery agents available</p>
            <p className="text-xs text-yellow-700 mt-1">
              Create a new delivery agent to assign orders
            </p>
          </div>
        ) : (
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger data-testid="select-delivery-agent">
              <SelectValue placeholder="Choose an agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name} ({agent.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!isLoadingAgents && agents.length > 0 && (
        <Button
          onClick={() => onAssign(selectedAgent)}
          disabled={!selectedAgent || isAssigning}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
          data-testid="button-confirm-assign"
        >
          {isAssigning ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Assigning...</>
          ) : (
            "Assign Agent"
          )}
        </Button>
      )}
    </div>
  );
}
