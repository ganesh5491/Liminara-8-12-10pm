import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2,
    Package,
    MapPin,
    Phone,
    CheckCircle,
    Clock,
    ArrowLeft,
    Calendar,
    CreditCard,
    Truck
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
    productName: string;
    quantity: number;
    price: string;
    productImage?: string;
}

interface DeliveryOrder {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryAddress: string;
    city: string;
    state: string;
    pincode: string;
    totalAmount: string;
    paymentMethod: string;
    paymentStatus: string;
    deliveryStatus: string;
    assignedAt: string;
    items: OrderItem[];
    deliveryNotes?: string;
}

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [notes, setNotes] = useState("");

    const { data: order, isLoading, error } = useQuery<DeliveryOrder>({
        queryKey: [`/api/delivery/orders/${id}`],
        queryFn: async () => {
            const res = await fetch(`/api/delivery/orders/${id}`, {
                credentials: "include",
            });
            if (!res.ok) {
                if (res.status === 404) throw new Error("Order not found");
                if (res.status === 403) throw new Error("Access denied");
                throw new Error("Failed to fetch order");
            }
            return res.json();
        },
        enabled: !!id,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({
            status,
            notes,
        }: {
            status: string;
            notes?: string;
        }) => {
            return apiRequest("PUT", `/api/delivery/orders/${id}/status`, {
                status,
                notes,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/delivery/orders/${id}`] });
            queryClient.invalidateQueries({ queryKey: ["/api/delivery/stats"] });
            toast({ title: "Order updated", description: "Delivery status has been updated" });
            setIsUpdateOpen(false);
        },
        onError: (err: any) => {
            toast({
                title: "Error",
                description: err.message || "Failed to update status",
                variant: "destructive"
            });
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h2 className="text-xl font-semibold text-destructive">
                    {(error as Error)?.message || "Order not found"}
                </h2>
                <Button variant="outline" onClick={() => navigate("/delivery/dashboard")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "delivered": return "bg-green-100 text-green-800";
            case "pending": case "assigned": return "bg-yellow-100 text-yellow-800";
            case "in_transit": case "picked_up": return "bg-blue-100 text-blue-800";
            case "out_for_delivery": return "bg-purple-100 text-purple-800";
            case "cancelled": case "failed": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus?.toLowerCase()) {
            case "assigned": return { status: "picked_up", label: "Mark as Picked Up" };
            case "picked_up": return { status: "out_for_delivery", label: "Out for Delivery" };
            case "out_for_delivery": return { status: "delivered", label: "Mark as Delivered" };
            default: return null;
        }
    };

    const nextAction = getNextStatus(order.deliveryStatus);
    const formatCurrency = (amount: string) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(parseFloat(amount));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Order #{order.orderNumber}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Assigned: {new Date(order.assignedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Badge className={`ml-auto capitalize ${getStatusColor(order.deliveryStatus)}`}>
                    {order.deliveryStatus.replace(/_/g, " ")}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Customer & Address */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Delivery Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-1">
                                <h3 className="font-semibold">{order.customerName}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
                                </div>
                            </div>
                            <div className="p-4 bg-muted rounded-lg text-sm">
                                <p className="font-medium mb-1">Shipping Address:</p>
                                <p>{order.deliveryAddress}</p>
                                <p>{order.city}, {order.state} - {order.pincode}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button className="w-full" asChild variant="outline">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.deliveryAddress}, ${order.city}`)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Open in Maps
                                    </a>
                                </Button>
                                <Button className="w-full" asChild>
                                    <a href={`tel:${order.customerPhone}`}>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Call Customer
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price)}</p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span>{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions & Status */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" />
                                Status & Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-sm font-medium mb-2">Payment Status</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}>
                                        {order.paymentStatus.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground capitalize">
                                        via {order.paymentMethod}
                                    </span>
                                </div>
                            </div>

                            {nextAction ? (
                                <div className="space-y-4 pt-4 border-t">
                                    <p className="text-sm font-medium">Next Step</p>
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
                                        onClick={() => setIsUpdateOpen(true)}
                                    >
                                        {nextAction.label}
                                    </Button>
                                </div>
                            ) : (
                                order.deliveryStatus === 'delivered' && (
                                    <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">Order Completed</span>
                                    </div>
                                )
                            )}
                        </CardContent>
                    </Card>

                    {order.deliveryNotes && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Delivery Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{order.deliveryNotes}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Status</DialogTitle>
                        <DialogDescription>
                            Mark order as {nextAction?.label}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Left at front door"
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => updateStatusMutation.mutate({ status: nextAction!.status, notes })}
                                disabled={updateStatusMutation.isPending}
                            >
                                {updateStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Update
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
