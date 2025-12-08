import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminSettings() {
    const { adminUser } = useAdmin();
    const [isUpdating, setIsUpdating] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: adminUser?.name || "",
            email: adminUser?.email || "",
        },
        values: {
            name: adminUser?.name || "",
            email: adminUser?.email || "",
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            setIsUpdating(true);
            // We'll need an endpoint to update current admin profile
            // Currently using a placeholder or we can implement the endpoint
            // Assuming endpoint PATCH /api/admin/me exists or using Users endpoint

            // For now, let's simulate or try to hit an endpoint
            // Since /api/admin/admin-users/:id exists, we can use that if we enable self-update

            if (!adminUser?.id) return;

            await apiRequest("PATCH", `/api/admin/admin-users/${adminUser.id}`, {
                name: data.name,
                email: data.email
            });

            // Invalidate admin-user query
            queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Update failed",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and system preferences.
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Update your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your email" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is the email you use to login.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>
                            View system status and version.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Version</span>
                            <span className="text-muted-foreground">1.0.0</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-medium">Environment</span>
                            <span className="text-muted-foreground">{process.env.NODE_ENV || 'development'}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium">Storage Mode</span>
                            <span className="text-muted-foreground">JSON Storage (Active)</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
