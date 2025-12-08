import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Loader2, Mail, Phone, MessageSquare, Clock, CheckCircle } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: string;
  status: string;
  adminResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

const statusOptions = ["pending", "in_progress", "resolved", "closed"];
const typeOptions = ["general", "product", "order", "complaint", "feedback", "other"];

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function InquiriesManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: inquiries, isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries", { status: statusFilter !== "all" ? statusFilter : undefined }],
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: string; status: string; adminResponse?: string }) => {
      return apiRequest("PUT", `/api/admin/inquiries/${id}`, { status, adminResponse });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      toast({ title: "Inquiry updated", description: "Inquiry has been updated successfully" });
      setIsDetailOpen(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInquiries = inquiries?.filter((inquiry) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        inquiry.name?.toLowerCase().includes(searchLower) ||
        inquiry.email?.toLowerCase().includes(searchLower) ||
        inquiry.subject?.toLowerCase().includes(searchLower) ||
        inquiry.message?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredInquiries?.length || 0) / itemsPerPage);
  const paginatedInquiries = filteredInquiries?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inquiries</h2>
          <p className="text-muted-foreground">Manage customer inquiries and messages</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-inquiries"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((status) => (
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
            <div className="space-y-4">
              {paginatedInquiries?.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover-elevate cursor-pointer"
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    setIsDetailOpen(true);
                  }}
                  data-testid={`card-inquiry-${inquiry.id}`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{inquiry.name}</h3>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status?.replace(/_/g, " ")}
                      </Badge>
                      <Badge variant="outline">{inquiry.type}</Badge>
                    </div>
                    <p className="text-sm font-medium">{inquiry.subject || "No Subject"}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{inquiry.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" data-testid={`button-view-${inquiry.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!paginatedInquiries || paginatedInquiries.length === 0) && (
                <p className="text-center text-muted-foreground py-12">
                  No inquiries found
                </p>
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
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>View and respond to the inquiry</DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <InquiryDetails
              inquiry={selectedInquiry}
              onUpdate={(status, response) => {
                updateInquiryMutation.mutate({
                  id: selectedInquiry.id,
                  status,
                  adminResponse: response,
                });
              }}
              isUpdating={updateInquiryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InquiryDetails({
  inquiry,
  onUpdate,
  isUpdating,
}: {
  inquiry: Inquiry;
  onUpdate: (status: string, response?: string) => void;
  isUpdating: boolean;
}) {
  const [status, setStatus] = useState(inquiry.status);
  const [response, setResponse] = useState(inquiry.adminResponse || "");

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-semibold">{inquiry.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{inquiry.email}</span>
              {inquiry.phone && (
                <>
                  <span>|</span>
                  <Phone className="h-3 w-3" />
                  <span>{inquiry.phone}</span>
                </>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(inquiry.status)}>
            {inquiry.status?.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{inquiry.subject || "No Subject"}</span>
            <Badge variant="outline" className="text-xs">{inquiry.type}</Badge>
          </div>
          <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Received: {new Date(inquiry.createdAt).toLocaleString()}
          </p>
        </div>

        {inquiry.adminResponse && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Admin Response</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{inquiry.adminResponse}</p>
            {inquiry.respondedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Responded: {new Date(inquiry.respondedAt).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Update Inquiry</h4>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="select-new-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Response</Label>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Enter your response to the customer..."
            rows={4}
            data-testid="input-response"
          />
        </div>

        <Button
          onClick={() => onUpdate(status, response)}
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
          data-testid="button-update-inquiry"
        >
          {isUpdating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
          ) : (
            "Update Inquiry"
          )}
        </Button>
      </div>
    </div>
  );
}
