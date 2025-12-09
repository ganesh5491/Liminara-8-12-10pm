import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Phone, Truck, Star, Package } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

export default function DeliveryProfile() {
  const { deliveryAgent } = useAdmin();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: deliveryAgent?.name || "",
    phone: deliveryAgent?.phone || "",
    vehicleType: deliveryAgent?.vehicleType || "",
    vehicleNumber: deliveryAgent?.vehicleNumber || "",
  });
  const [isAvailable, setIsAvailable] = useState(deliveryAgent?.isAvailable ?? true);

  const { data: stats, isLoading } = useQuery<{
    totalDeliveries: number;
    completedDeliveries: number;
    cancelledDeliveries: number;
    rating: string;
    pendingCount: number;
    activeCount: number;
  }>({
    queryKey: ["/api/delivery/stats"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("PUT", "/api/delivery/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/auth/me"] });
      toast({ title: "Profile updated", description: "Your profile has been updated successfully" });
      setIsEditing(false);
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (available: boolean) => {
      return apiRequest("PUT", "/api/delivery/availability", { isAvailable: available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery/auth/me"] });
      toast({
        title: isAvailable ? "You are now offline" : "You are now online",
        description: isAvailable
          ? "You won't receive new delivery assignments"
          : "You can now receive new delivery assignments",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Manage your profile and availability</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={deliveryAgent?.profileImageUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  {deliveryAgent?.name?.charAt(0) || "D"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{deliveryAgent?.name}</h3>
                <p className="text-sm text-muted-foreground">{deliveryAgent?.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Input
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    placeholder="Bike, Scooter, etc."
                    data-testid="input-vehicle-type"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    placeholder="MH01AB1234"
                    data-testid="input-vehicle-number"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                    data-testid="button-save"
                  >
                    {updateProfileMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{deliveryAgent?.phone || "Not set"}</span>
                </div>
                {deliveryAgent?.vehicleNumber && (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {deliveryAgent?.vehicleType} - {deliveryAgent?.vehicleNumber}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: deliveryAgent?.name || "",
                      phone: deliveryAgent?.phone || "",
                      vehicleType: deliveryAgent?.vehicleType || "",
                      vehicleNumber: deliveryAgent?.vehicleNumber || "",
                    });
                    setIsEditing(true);
                  }}
                  data-testid="button-edit"
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Rating</span>
                  </div>
                  <span className="text-lg font-bold">{stats?.rating || "No rating"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.completedDeliveries || 0}
                    </p>
                    <p className="text-sm text-green-700">Completed</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {stats?.cancelledDeliveries || 0}
                    </p>
                    <p className="text-sm text-red-700">Cancelled</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.totalDeliveries || 0}
                  </p>
                  <p className="text-sm text-blue-700">Total Deliveries</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Online Status</h4>
              <p className="text-sm text-muted-foreground">
                Toggle your availability to receive new delivery assignments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={isAvailable ? "default" : "secondary"}>
                {isAvailable ? "Online" : "Offline"}
              </Badge>
              <Switch
                checked={isAvailable}
                onCheckedChange={(checked) => {
                  setIsAvailable(checked);
                  toggleAvailabilityMutation.mutate(checked);
                }}
                disabled={toggleAvailabilityMutation.isPending}
                data-testid="switch-availability"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
