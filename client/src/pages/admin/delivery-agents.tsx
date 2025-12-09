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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Eye, Loader2, Star, Truck, Phone, MapPin, CreditCard, User, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DeliveryAgent {
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImageUrl?: string;
  isActive: boolean;
  isAvailable: boolean;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  currentAddress?: string;
  currentCity?: string;
  currentState?: string;
  currentPincode?: string;
  sameAsPermAddress?: boolean;
  aadharNumber?: string;
  panNumber?: string;
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  rating?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  createdAt: string;
}

export default function DeliveryAgentsManagement() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<DeliveryAgent | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: agents, isLoading } = useQuery<DeliveryAgent[]>({
    queryKey: ["/api/admin/delivery-agents"],
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return apiRequest("PUT", `/api/admin/delivery-agents/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery-agents"] });
      toast({ title: "Agent updated", description: "Delivery agent status has been changed" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/delivery-agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery-agents"] });
      toast({ title: "Agent deleted", description: "Delivery agent has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive",
      });
    },
  });

  const filteredAgents = agents?.filter((agent) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        agent.name?.toLowerCase().includes(searchLower) ||
        agent.email?.toLowerCase().includes(searchLower) ||
        agent.phone?.includes(search)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredAgents?.length || 0) / itemsPerPage);
  const paginatedAgents = filteredAgents?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAgent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Delivery Agents</h2>
          <p className="text-muted-foreground">Manage delivery personnel and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500"
              onClick={() => {
                setEditingAgent(null);
                setIsDialogOpen(true);
              }}
              data-testid="button-add-agent"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAgent ? "Edit Agent" : "Add New Agent"}</DialogTitle>
              <DialogDescription>
                {editingAgent ? "Update delivery agent details" : "Add a new delivery agent with complete details"}
              </DialogDescription>
            </DialogHeader>
            <AgentForm
              agent={editingAgent}
              onClose={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list" data-testid="tab-agent-list">Agent List</TabsTrigger>
          <TabsTrigger value="dashboard" data-testid="tab-agent-dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 max-w-md"
                  data-testid="input-search-agents"
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedAgents?.map((agent) => (
                    <Card key={agent.id} data-testid={`card-agent-${agent.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={agent.profileImageUrl} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {agent.name?.charAt(0) || "D"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{agent.name}</h3>
                              <p className="text-sm text-muted-foreground">{agent.email}</p>
                            </div>
                          </div>
                          <Badge variant={agent.isActive ? "default" : "secondary"}>
                            {agent.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{agent.phone}</span>
                          </div>
                          {agent.aadharNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span>Aadhar: {agent.aadharNumber.slice(0, 4)}****{agent.aadharNumber.slice(-4)}</span>
                            </div>
                          )}
                          {agent.currentCity && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{agent.currentCity}, {agent.currentState}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{agent.rating || "No rating"}</span>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Completed</p>
                            <p className="font-semibold text-green-600">{agent.completedDeliveries}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Cancelled</p>
                            <p className="font-semibold text-red-600">{agent.cancelledDeliveries}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-semibold">{agent.totalDeliveries}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={agent.isActive}
                              onCheckedChange={(checked) => {
                                toggleStatusMutation.mutate({ id: agent.id, isActive: checked });
                              }}
                              data-testid={`switch-status-${agent.id}`}
                            />
                            <span className="text-sm">{agent.isActive ? "Active" : "Inactive"}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingAgent(agent);
                                setIsDialogOpen(true);
                              }}
                              data-testid={`button-edit-${agent.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => deleteMutation.mutate(agent.id)}
                              data-testid={`button-delete-${agent.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!paginatedAgents || paginatedAgents.length === 0) && (
                    <p className="col-span-full text-center text-muted-foreground py-12">
                      No delivery agents found
                    </p>
                  )}
                </div>
              )}

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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{agents?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">{agents?.filter(a => a.isActive).length || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">
                    {agents?.reduce((sum, a) => sum + (a.completedDeliveries || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-600">
                    {agents?.length ? (agents.reduce((sum, a) => sum + parseFloat(a.rating || "0"), 0) / agents.length).toFixed(1) : "0.0"}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AgentForm({
  agent,
  onClose,
}: {
  agent: DeliveryAgent | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: agent?.name || "",
    email: agent?.email || "",
    phone: agent?.phone || "",
    password: "",
    permanentAddress: agent?.permanentAddress || "",
    permanentCity: agent?.permanentCity || "",
    permanentState: agent?.permanentState || "",
    permanentPincode: agent?.permanentPincode || "",
    currentAddress: agent?.currentAddress || "",
    currentCity: agent?.currentCity || "",
    currentState: agent?.currentState || "",
    currentPincode: agent?.currentPincode || "",
    sameAsPermAddress: agent?.sameAsPermAddress || false,
    aadharNumber: agent?.aadharNumber || "",
    panNumber: agent?.panNumber || "",
    vehicleType: agent?.vehicleType || "",
    vehicleNumber: agent?.vehicleNumber || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSameAddressChange = (checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        sameAsPermAddress: true,
        currentAddress: formData.permanentAddress,
        currentCity: formData.permanentCity,
        currentState: formData.permanentState,
        currentPincode: formData.permanentPincode,
      });
    } else {
      setFormData({
        ...formData,
        sameAsPermAddress: false,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.aadharNumber || formData.aadharNumber.length !== 12) {
      toast({
        title: "Error",
        description: "Valid 12-digit Aadhar number is required",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!agent && !formData.password) {
      toast({
        title: "Error",
        description: "Password is required for new agents",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const url = agent
        ? `/api/admin/delivery-agents/${agent.id}`
        : "/api/admin/delivery-agents";
      const method = agent ? "PUT" : "POST";

      const submitData: any = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      await apiRequest(method, url, submitData);

      queryClient.invalidateQueries({ queryKey: ["/api/admin/delivery-agents"] });
      toast({
        title: agent ? "Agent updated" : "Agent created",
        description: `Delivery agent has been ${agent ? "updated" : "created"} successfully`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${agent ? "update" : "create"} delivery agent`,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <User className="h-4 w-4" />
          Basic Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-agent-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              data-testid="input-agent-phone"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!agent}
              data-testid="input-agent-email"
            />
          </div>

          {!agent && (
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!agent}
                data-testid="input-agent-password"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Vehicle Information
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input
              id="vehicleType"
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              placeholder="e.g. Bike, Scooter, Van"
              data-testid="input-agent-vehicle-type"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleNumber">Vehicle Number</Label>
            <Input
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              placeholder="e.g. MH-12-AB-1234"
              data-testid="input-agent-vehicle-number"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Identity Documents
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aadharNumber">Aadhar Number * (12 digits)</Label>
            <Input
              id="aadharNumber"
              value={formData.aadharNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                setFormData({ ...formData, aadharNumber: value });
              }}
              placeholder="Enter 12-digit Aadhar number"
              required
              maxLength={12}
              data-testid="input-agent-aadhar"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number (Optional)</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
              placeholder="Enter PAN number"
              maxLength={10}
              data-testid="input-agent-pan"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Permanent Address
        </h4>

        <div className="space-y-2">
          <Label htmlFor="permanentAddress">Address</Label>
          <Textarea
            id="permanentAddress"
            value={formData.permanentAddress}
            onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
            placeholder="Enter complete address"
            data-testid="input-perm-address"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="permanentCity">City</Label>
            <Input
              id="permanentCity"
              value={formData.permanentCity}
              onChange={(e) => setFormData({ ...formData, permanentCity: e.target.value })}
              data-testid="input-perm-city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanentState">State</Label>
            <Input
              id="permanentState"
              value={formData.permanentState}
              onChange={(e) => setFormData({ ...formData, permanentState: e.target.value })}
              data-testid="input-perm-state"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanentPincode">Pincode</Label>
            <Input
              id="permanentPincode"
              value={formData.permanentPincode}
              onChange={(e) => setFormData({ ...formData, permanentPincode: e.target.value })}
              data-testid="input-perm-pincode"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Current Address
          </h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsPermAddress"
              checked={formData.sameAsPermAddress}
              onCheckedChange={handleSameAddressChange}
            />
            <Label htmlFor="sameAsPermAddress" className="text-sm">
              Same as permanent address
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentAddress">Address</Label>
          <Textarea
            id="currentAddress"
            value={formData.currentAddress}
            onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
            placeholder="Enter complete address"
            disabled={formData.sameAsPermAddress}
            data-testid="input-curr-address"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentCity">City</Label>
            <Input
              id="currentCity"
              value={formData.currentCity}
              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
              disabled={formData.sameAsPermAddress}
              data-testid="input-curr-city"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentState">State</Label>
            <Input
              id="currentState"
              value={formData.currentState}
              onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
              disabled={formData.sameAsPermAddress}
              data-testid="input-curr-state"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentPincode">Pincode</Label>
            <Input
              id="currentPincode"
              value={formData.currentPincode}
              onChange={(e) => setFormData({ ...formData, currentPincode: e.target.value })}
              disabled={formData.sameAsPermAddress}
              data-testid="input-curr-pincode"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500"
          disabled={isSubmitting}
          data-testid="button-save-agent"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
          ) : (
            agent ? "Update Agent" : "Create Agent"
          )}
        </Button>
      </div>
    </form>
  );
}
