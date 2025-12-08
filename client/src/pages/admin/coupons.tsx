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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Tag, Percent, DollarSign } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Coupon {
    id: string;
    code: string;
    description?: string;
    discountType: "percentage" | "fixed";
    discountValue: string;
    minOrderAmount?: string;
    maxDiscountAmount?: string;
    usageLimit?: number;
    usedCount: number;
    validFrom?: string;
    validUntil?: string;
    isActive: boolean;
    createdAt: string;
}

export default function CouponsManagement() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const { toast } = useToast();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data: coupons, isLoading } = useQuery<Coupon[]>({
        queryKey: ["/api/admin/coupons"],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("DELETE", `/api/admin/coupons/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
            toast({ title: "Coupon deleted", description: "The coupon has been removed" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete coupon",
                variant: "destructive",
            });
        },
    });

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(typeof amount === "string" ? parseFloat(amount) : amount);
    };

    const totalPages = Math.ceil((coupons?.length || 0) / itemsPerPage);
    const paginatedCoupons = coupons?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCoupon(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
                    <p className="text-muted-foreground">Manage discount coupons and promotions</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingCoupon(null);
                        setIsDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                    data-testid="button-add-coupon"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Coupon
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        All Coupons
                    </CardTitle>
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
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Code</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Description</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Discount</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Min Order</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Usage</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Valid Until</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCoupons?.map((coupon) => (
                                        <tr key={coupon.id} className="border-b last:border-0" data-testid={`row-coupon-${coupon.id}`}>
                                            <td className="py-3 px-2">
                                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-sm">{coupon.code}</code>
                                            </td>
                                            <td className="py-3 px-2 text-sm">{coupon.description || "-"}</td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center gap-1">
                                                    {coupon.discountType === "percentage" ? (
                                                        <>
                                                            <Percent className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">{coupon.discountValue}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DollarSign className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">{formatCurrency(coupon.discountValue)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-sm">
                                                {coupon.minOrderAmount ? formatCurrency(coupon.minOrderAmount) : "-"}
                                            </td>
                                            <td className="py-3 px-2 text-sm">
                                                {coupon.usedCount} / {coupon.usageLimit || "Unlimited"}
                                            </td>
                                            <td className="py-3 px-2">
                                                <Badge className={coupon.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                                    {coupon.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-2 text-sm text-muted-foreground">
                                                {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "No expiry"}
                                            </td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingCoupon(coupon);
                                                            setIsDialogOpen(true);
                                                        }}
                                                        data-testid={`button-edit-coupon-${coupon.id}`}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this coupon?")) {
                                                                deleteMutation.mutate(coupon.id);
                                                            }
                                                        }}
                                                        className="text-red-600"
                                                        data-testid={`button-delete-coupon-${coupon.id}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!paginatedCoupons || paginatedCoupons.length === 0) && (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center text-muted-foreground">
                                                No coupons found. Create your first coupon!
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

            <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
                        <DialogDescription>
                            {editingCoupon ? "Update coupon details" : "Create a new discount coupon"}
                        </DialogDescription>
                    </DialogHeader>
                    <CouponForm coupon={editingCoupon} onClose={handleCloseDialog} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CouponForm({ coupon, onClose }: { coupon: Coupon | null; onClose: () => void }) {
    const [formData, setFormData] = useState({
        code: coupon?.code || "",
        description: coupon?.description || "",
        discountType: coupon?.discountType || "percentage",
        discountValue: coupon?.discountValue || "",
        minOrderAmount: coupon?.minOrderAmount || "",
        maxDiscountAmount: coupon?.maxDiscountAmount || "",
        usageLimit: coupon?.usageLimit?.toString() || "",
        validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : "",
        isActive: coupon?.isActive ?? true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                code: formData.code,
                description: formData.description || undefined,
                discountType: formData.discountType,
                discountValue: parseFloat(formData.discountValue),
                minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
                validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined,
                isActive: formData.isActive
            };

            if (coupon) {
                await apiRequest("PUT", `/api/admin/coupons/${coupon.id}`, submitData);
                toast({ title: "Coupon updated", description: "Coupon has been updated successfully" });
            } else {
                await apiRequest("POST", "/api/admin/coupons", submitData);
                toast({ title: "Coupon created", description: "New coupon code added successfully" });
            }

            queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
            onClose();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || `Failed to ${coupon ? "update" : "create"} coupon`,
                variant: "destructive"
            });
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    required
                    disabled={!!coupon}
                    data-testid="input-coupon-code"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Summer sale discount"
                    data-testid="input-coupon-description"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <select
                        id="discountType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as "percentage" | "fixed" })}
                        data-testid="select-discount-type"
                    >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value *</Label>
                    <Input
                        id="discountValue"
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        placeholder={formData.discountType === "percentage" ? "25" : "500"}
                        required
                        data-testid="input-discount-value"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Min Order Amount</Label>
                    <Input
                        id="minOrderAmount"
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                        placeholder="1000"
                        data-testid="input-min-order"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxDiscountAmount">Max Discount</Label>
                    <Input
                        id="maxDiscountAmount"
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        placeholder="500"
                        data-testid="input-max-discount"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input
                        id="usageLimit"
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        placeholder="100"
                        data-testid="input-usage-limit"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                        id="validUntil"
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                        data-testid="input-valid-until"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-medium">
                    Coupon is active
                </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                    data-testid="button-save-coupon"
                >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    {coupon ? "Update Coupon" : "Create Coupon"}
                </Button>
            </div>
        </form>
    );
}
