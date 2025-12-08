import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  assignedAt: string;
  scheduledDeliveryDate?: string;
  items: { productName: string; quantity: number; price: string }[];
}

interface DeliveryOrdersPageProps {
  status: "pending" | "active" | "completed" | "cancelled";
}

export default function DeliveryOrdersPage({ status }: DeliveryOrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const statusMap: Record<string, string> = {
    pending: "assigned",
    active: "picked_up",
    completed: "delivered",
    cancelled: "cancelled",
  };

  const { data: orders, isLoading } = useQuery<DeliveryOrder[]>({
    queryKey: ["/api/delivery/orders", { status: statusMap[status] }],
    queryFn: async () => {
      const res = await fetch(`/api/delivery/orders?status=${statusMap[status]}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
      notes,
    }: {
      orderId: string;
      newStatus: string;
      notes?: string;
    }) => {
      return apiRequest("PUT", `/api/delivery/orders/${orderId}/status`, {
        status: newStatus,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/stats"] });
      toast({ title: "Order updated", description: "Order status has been changed" });
      setIsUpdateOpen(false);
      setSelectedOrder(null);
    },
  });

  const getStatusBadgeClass = (deliveryStatus: string) => {
    switch (deliveryStatus?.toLowerCase()) {
      case "assigned":
        return "bg-yellow-100 text-yellow-800";
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus?.toLowerCase()) {
      case "assigned":
        return { status: "picked_up", label: "Mark as Picked Up" };
      case "picked_up":
        return { status: "out_for_delivery", label: "Out for Delivery" };
      case "out_for_delivery":
        return { status: "delivered", label: "Mark as Delivered" };
      default:
        return null;
    }
  };

  const getTitleByStatus = () => {
    switch (status) {
      case "pending":
        return { title: "Pending Deliveries", desc: "Orders assigned to you awaiting pickup" };
      case "active":
        return { title: "Active Deliveries", desc: "Orders currently in progress" };
      case "completed":
        return { title: "Completed Deliveries", desc: "Successfully delivered orders" };
      case "cancelled":
        return { title: "Cancelled Deliveries", desc: "Orders that were cancelled" };
    }
  };

  const titleInfo = getTitleByStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{titleInfo.title}</h2>
        <p className="text-muted-foreground">{titleInfo.desc}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order.id} data-testid={`card-order-${order.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeClass(order.deliveryStatus)}>
                    {order.deliveryStatus?.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="flex-1">
                      {order.deliveryAddress}, {order.city}, {order.state} - {order.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Total</p>
                    <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailOpen(true);
                      }}
                      data-testid={`button-view-${order.id}`}
                    >
                      View Details
                    </Button>
                    {getNextStatus(order.deliveryStatus) && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsUpdateOpen(true);
                        }}
                        data-testid={`button-update-${order.id}`}
                      >
                        {getNextStatus(order.deliveryStatus)?.label}
                      </Button>
                    )}
                    {status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this order?")) {
                            updateStatusMutation.mutate({
                              orderId: order.id,
                              newStatus: "cancelled",
                            });
                          }
                        }}
                        data-testid={`button-cancel-${order.id}`}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!orders || orders.length === 0) && (
            <p className="text-center text-muted-foreground py-12">
              No {status} deliveries found
            </p>
          )}
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Customer</h4>
                <p className="text-sm">{selectedOrder.customerName}</p>
                <p className="text-sm">{selectedOrder.customerPhone}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Delivery Address</h4>
                <p className="text-sm">
                  {selectedOrder.deliveryAddress}, {selectedOrder.city},{" "}
                  {selectedOrder.state} - {selectedOrder.pincode}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Items</h4>
                <div className="space-y-1">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x {item.quantity}
                      </span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex gap-2 pt-4">
                <Badge variant="outline">{selectedOrder.paymentMethod}</Badge>
                <Badge
                  variant={
                    selectedOrder.paymentStatus === "paid" ? "default" : "secondary"
                  }
                >
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Update the delivery status for {selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <p className="text-sm">
                Change status from{" "}
                <Badge className={getStatusBadgeClass(selectedOrder.deliveryStatus)}>
                  {selectedOrder.deliveryStatus?.replace(/_/g, " ")}
                </Badge>{" "}
                to{" "}
                <Badge className="bg-green-100 text-green-800">
                  {getNextStatus(selectedOrder.deliveryStatus)?.status.replace(/_/g, " ")}
                </Badge>
              </p>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this update..."
                  data-testid="input-notes"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel-update"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                  onClick={() => {
                    const next = getNextStatus(selectedOrder.deliveryStatus);
                    if (next) {
                      updateStatusMutation.mutate({
                        orderId: selectedOrder.id,
                        newStatus: next.status,
                        notes,
                      });
                    }
                  }}
                  disabled={updateStatusMutation.isPending}
                  data-testid="button-confirm-update"
                >
                  {updateStatusMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PendingOrders() {
  return <DeliveryOrdersPage status="pending" />;
}

export function ActiveOrders() {
  return <DeliveryOrdersPage status="active" />;
}

export function CompletedOrders() {
  return <DeliveryOrdersPage status="completed" />;
}

export function CancelledOrders() {
  return <DeliveryOrdersPage status="cancelled" />;
}
