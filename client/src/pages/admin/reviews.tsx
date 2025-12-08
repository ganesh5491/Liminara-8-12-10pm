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
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Trash2, Check, X, Loader2, Star } from "lucide-react";

interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  content: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  userName?: string;
  productName?: string;
  createdAt: string;
}

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ReviewsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/admin/reviews", { isApproved: statusFilter !== "all" ? statusFilter : undefined }],
  });

  const approveReviewMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      return apiRequest("PUT", `/api/admin/reviews/${id}/approve`, { isApproved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review updated", description: "Review status has been changed" });
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review deleted", description: "Review has been removed" });
    },
  });

  const filteredReviews = reviews?.filter((review) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        review.userName?.toLowerCase().includes(searchLower) ||
        review.productName?.toLowerCase().includes(searchLower) ||
        review.content?.toLowerCase().includes(searchLower) ||
        review.title?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredReviews?.length || 0) / itemsPerPage);
  const paginatedReviews = filteredReviews?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Manage product reviews and ratings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-reviews"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="All Reviews" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="true">Approved</SelectItem>
                <SelectItem value="false">Pending</SelectItem>
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
              {paginatedReviews?.map((review) => (
                <div
                  key={review.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                  data-testid={`card-review-${review.id}`}
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {renderStars(review.rating)}
                      <Badge variant={review.isApproved ? "default" : "secondary"}>
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                      {review.isVerifiedPurchase && (
                        <Badge variant="outline" className="text-green-600">Verified Purchase</Badge>
                      )}
                    </div>
                    <p className="font-medium">{review.title || "No Title"}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By: {review.userName || "Anonymous"}</span>
                      <span>Product: {review.productName || "Unknown"}</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!review.isApproved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600"
                        onClick={() => approveReviewMutation.mutate({ id: review.id, isApproved: true })}
                        data-testid={`button-approve-${review.id}`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {review.isApproved && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-yellow-600"
                        onClick={() => approveReviewMutation.mutate({ id: review.id, isApproved: false })}
                        data-testid={`button-unapprove-${review.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsDetailOpen(true);
                      }}
                      data-testid={`button-view-${review.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this review?")) {
                          deleteReviewMutation.mutate(review.id);
                        }
                      }}
                      data-testid={`button-delete-${review.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {(!paginatedReviews || paginatedReviews.length === 0) && (
                <p className="text-center text-muted-foreground py-12">
                  No reviews found
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>Full review content</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {renderStars(selectedReview.rating)}
                <Badge variant={selectedReview.isApproved ? "default" : "secondary"}>
                  {selectedReview.isApproved ? "Approved" : "Pending"}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium mb-1">{selectedReview.title || "No Title"}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedReview.content}
                </p>
              </div>

              <div className="text-sm space-y-1">
                <p><strong>Reviewer:</strong> {selectedReview.userName || "Anonymous"}</p>
                <p><strong>Product:</strong> {selectedReview.productName || "Unknown"}</p>
                <p><strong>Date:</strong> {new Date(selectedReview.createdAt).toLocaleString()}</p>
                <p><strong>Helpful votes:</strong> {selectedReview.helpfulCount}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
