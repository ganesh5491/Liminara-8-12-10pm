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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Shield, UserCog, Mail, Eye, EyeOff } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminUser {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImageUrl?: string;
    roleId?: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    permissions?: Record<string, boolean>;
}

const PERMISSION_OPTIONS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "customers", label: "Customers" },
    { key: "inquiries", label: "Inquiries" },
    { key: "reviews", label: "Reviews/Questions" },
    { key: "reports", label: "Sales Dashboard" },
    { key: "manageDelivery", label: "Delivery Dashboard" },
    { key: "manageAdmins", label: "Admin Management" },
    { key: "settings", label: "Settings" },
    { key: "coupons", label: "Coupons" },
];

export default function AdminUsersManagement() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const { toast } = useToast();

    const { data: adminUsers, isLoading } = useQuery<AdminUser[]>({
        queryKey: ["/api/admin/users/admins"],
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil((adminUsers?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = adminUsers?.slice(startIndex, startIndex + itemsPerPage);

    const { data: roles } = useQuery<Role[]>({
        queryKey: ["/api/admin/roles"],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("DELETE", `/api/admin/users/admins/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users/admins"] });
            toast({ title: "Admin deleted", description: "The admin user has been removed" });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete admin",
                variant: "destructive",
            });
        },
    });

    const getRoleName = (roleId?: string) => {
        if (!roleId) return "No Role";
        const role = roles?.find(r => r.id === roleId);
        return role?.displayName || "Unknown";
    };

    const handleCloseDialog = () => {
        setIsCreateOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Users</h2>
                    <p className="text-muted-foreground">Manage admin accounts and permissions</p>
                </div>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                    data-testid="button-add-admin"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Admin Accounts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Admin</th>
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Email</th>
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Role</th>
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Last Login</th>
                                    <th className="py-3 px-2 text-left text-sm font-medium text-muted-foreground">Created</th>
                                    <th className="py-3 px-2 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers?.map((user) => (
                                    <tr key={user.id} className="border-b last:border-0">
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.profileImageUrl} />
                                                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                                        {user.name?.charAt(0) || "A"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm">{user.name}</span>
                                            </div>
                                        </td>

                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Mail className="h-3 w-3 text-muted-foreground" />
                                                {user.email}
                                            </div>
                                        </td>

                                        <td className="py-3 px-2">
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <UserCog className="h-3 w-3" />
                                                {getRoleName(user.roleId)}
                                            </Badge>
                                        </td>

                                        <td className="py-3 px-2">
                                            <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>

                                        <td className="py-3 px-2 text-sm text-muted-foreground">
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                                        </td>

                                        <td className="py-3 px-2 text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="py-3 px-2">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setIsCreateOpen(true);
                                                    }}
                                                    data-testid={`button-edit-admin-${user.id}`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600"
                                                    onClick={() => deleteMutation.mutate(user.id)}
                                                    data-testid={`button-delete-admin-${user.id}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {(!adminUsers || adminUsers.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-muted-foreground">
                                            No admin users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    <PaginationItem>
                                        <span className="px-4 text-sm text-muted-foreground">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isCreateOpen} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit Admin User" : "Add New Admin"}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? "Update admin user details and permissions" : "Create a new admin user account with role-based permissions"}
                        </DialogDescription>
                    </DialogHeader>

                    <AdminForm
                        admin={editingUser}
                        roles={roles || []}
                        onClose={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function AdminForm({
    admin,
    roles,
    onClose,
}: {
    admin: AdminUser | null;
    roles: Role[];
    onClose: () => void;
}) {
    const [formData, setFormData] = useState({
        name: admin?.name || "",
        firstName: admin?.firstName || "",
        lastName: admin?.lastName || "",
        email: admin?.email || "",
        phone: admin?.phone || "",
        password: "",
        roleId: admin?.roleId || "",
        isActive: admin?.isActive ?? true,
        customPermissions: {} as Record<string, boolean>,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useCustomPermissions, setUseCustomPermissions] = useState(false);
    const { toast } = useToast();

    const selectedRole = roles.find(r => r.id === formData.roleId);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            if (admin) {
                return apiRequest("PUT", `/api/admin/users/admins/${admin.id}`, data);
            }
            return apiRequest("POST", "/api/admin/users/admins", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/users/admins"] });
            toast({
                title: admin ? "Admin updated" : "Admin created",
                description: admin ? "Admin user has been updated successfully" : "New admin user has been created successfully",
            });
            onClose();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || `Failed to ${admin ? "update" : "create"} admin`,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!admin && !formData.password) {
            toast({
                title: "Error",
                description: "Password is required for new admin users",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        if (!formData.email || !formData.name) {
            toast({
                title: "Error",
                description: "Name and email are required",
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }

        const submitData: any = {
            name: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            roleId: formData.roleId || null,
            isActive: formData.isActive,
        };

        if (formData.password) {
            submitData.password = formData.password;
        }

        createMutation.mutate(submitData);
        setIsSubmitting(false);
    };

    const handlePermissionChange = (key: string, checked: boolean) => {
        setFormData({
            ...formData,
            customPermissions: {
                ...formData.customPermissions,
                [key]: checked,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="First name"
                        data-testid="input-admin-firstname"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Last name"
                        data-testid="input-admin-lastname"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Display name"
                    required
                    data-testid="input-admin-name"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@example.com"
                        required
                        disabled={!!admin}
                        data-testid="input-admin-email"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Phone number"
                        data-testid="input-admin-phone"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">{admin ? "New Password (leave blank to keep current)" : "Password *"}</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder={admin ? "Leave blank to keep current password" : "Enter password"}
                        required={!admin}
                        data-testid="input-admin-password"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="roleId">Role *</Label>
                <Select
                    value={formData.roleId}
                    onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                >
                    <SelectTrigger data-testid="select-admin-role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                                {role.displayName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {selectedRole && (
                    <p className="text-xs text-muted-foreground">
                        Role permissions: {selectedRole.permissions ? Object.keys(selectedRole.permissions).filter(k => selectedRole.permissions![k]).join(", ") || "None" : "All permissions"}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="useCustomPermissions"
                        checked={useCustomPermissions}
                        onCheckedChange={(checked) => setUseCustomPermissions(!!checked)}
                    />
                    <Label htmlFor="useCustomPermissions" className="text-sm font-medium">
                        Override role permissions with custom permissions
                    </Label>
                </div>

                {useCustomPermissions && (
                    <div className="border rounded-lg p-4 space-y-3">
                        <Label className="text-sm font-medium">Custom Permissions</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {PERMISSION_OPTIONS.map((perm) => (
                                <div key={perm.key} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`perm-${perm.key}`}
                                        checked={formData.customPermissions[perm.key] || false}
                                        onCheckedChange={(checked) => handlePermissionChange(perm.key, !!checked)}
                                    />
                                    <Label htmlFor={`perm-${perm.key}`} className="text-sm">
                                        {perm.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-medium">
                    Account is active
                </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-500"
                    disabled={isSubmitting || createMutation.isPending}
                    data-testid="button-submit-admin"
                >
                    {(isSubmitting || createMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {admin ? "Update Admin" : "Create Admin"}
                </Button>
            </div>
        </form>
    );
}
