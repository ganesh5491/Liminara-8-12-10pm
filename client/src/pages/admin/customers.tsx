import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Eye, Loader2, Mail, Phone, MapPin, ShoppingBag, Users, TrendingUp, DollarSign } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Customer {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImageUrl?: string;
  address?: string;
  totalOrders?: number;
  orderCount?: number;
  totalSpent?: string;
  createdAt: string;
}

export default function CustomersManagement() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers"],
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(typeof amount === "string" ? parseFloat(amount) : amount);
  };

  const filteredCustomers = customers?.filter((customer) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(search)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredCustomers?.length || 0) / itemsPerPage);
  const paginatedCustomers = filteredCustomers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalCustomers = customers?.length || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + parseFloat(c.totalSpent || "0"), 0) || 0;
  const totalOrders = customers?.reduce((sum, c) => sum + (c.orderCount || c.totalOrders || 0), 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" data-testid="tab-customer-list">Customer List</TabsTrigger>
          <TabsTrigger value="dashboard" data-testid="tab-customer-dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalCustomers}</p>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
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
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
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
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
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
                <CardTitle className="text-lg">Top Customers by Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    ?.slice()
                    .sort((a, b) => parseFloat(b.totalSpent || "0") - parseFloat(a.totalSpent || "0"))
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div key={customer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground w-4">{index + 1}</span>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.profileImageUrl} />
                            <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                              {customer.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{customer.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600">{formatCurrency(customer.totalSpent || 0)}</p>
                      </div>
                    ))}
                  {(!customers || customers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No customers yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers
                    ?.slice()
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.profileImageUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {customer.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{customer.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  {(!customers || customers.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">No customers yet</p>
                  )}
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
                    placeholder="Search by name, email, or phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-customers"
                  />
                </div>
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
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Orders</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Total Spent</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Joined</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers?.map((customer) => (
                        <tr key={customer.id} className="border-b last:border-0" data-testid={`row-customer-${customer.id}`}>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={customer.profileImageUrl} />
                                <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">
                                  {customer.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{customer.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm">{customer.email}</td>
                          <td className="py-3 px-2 text-sm">{customer.phone || "-"}</td>
                          <td className="py-3 px-2 text-sm">{customer.orderCount || customer.totalOrders || 0}</td>
                          <td className="py-3 px-2 text-sm font-medium text-green-600">
                            {formatCurrency(customer.totalSpent || 0)}
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsDetailOpen(true);
                                }}
                                data-testid={`button-view-customer-${customer.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(!paginatedCustomers || paginatedCustomers.length === 0) && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-muted-foreground">
                            No customers found
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>View customer information and history</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCustomer.profileImageUrl} />
                  <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                    {selectedCustomer.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCustomer.name || "Unknown"}</h3>
                  <p className="text-muted-foreground text-sm">Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedCustomer.orderCount || selectedCustomer.totalOrders || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedCustomer.totalSpent || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
