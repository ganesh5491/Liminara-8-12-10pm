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
import { Search, Trash2, MessageSquare, Loader2, HelpCircle } from "lucide-react";

interface Question {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  isPublished: boolean;
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

export default function QuestionsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: questions, isLoading } = useQuery<Question[]>({
    queryKey: ["/api/admin/questions", { answered: statusFilter === "answered" ? "true" : statusFilter === "unanswered" ? "false" : undefined }],
  });

  const answerQuestionMutation = useMutation({
    mutationFn: async ({ id, answer, isPublished }: { id: string; answer: string; isPublished: boolean }) => {
      return apiRequest("PUT", `/api/admin/questions/${id}/answer`, { answer, isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      toast({ title: "Question updated", description: "Answer has been saved" });
      setIsDialogOpen(false);
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      toast({ title: "Question deleted", description: "Question has been removed" });
    },
  });

  const filteredQuestions = questions?.filter((question) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        question.userName?.toLowerCase().includes(searchLower) ||
        question.productName?.toLowerCase().includes(searchLower) ||
        question.question?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const totalPages = Math.ceil((filteredQuestions?.length || 0) / itemsPerPage);
  const paginatedQuestions = filteredQuestions?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Q&A</h2>
          <p className="text-muted-foreground">Manage product questions and answers</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-questions"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                <SelectValue placeholder="All Questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
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
              {paginatedQuestions?.map((question) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg space-y-3"
                  data-testid={`card-question-${question.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <HelpCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{question.userName || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">asked about</span>
                        <span className="text-sm font-medium">{question.productName || "Unknown Product"}</span>
                        <Badge variant={question.answer ? "default" : "secondary"}>
                          {question.answer ? "Answered" : "Pending"}
                        </Badge>
                        {question.isPublished && (
                          <Badge variant="outline" className="text-green-600">Published</Badge>
                        )}
                      </div>
                      <p className="text-sm">{question.question}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(question.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedQuestion(question);
                          setIsDialogOpen(true);
                        }}
                        data-testid={`button-answer-${question.id}`}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this question?")) {
                            deleteQuestionMutation.mutate(question.id);
                          }
                        }}
                        data-testid={`button-delete-${question.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {question.answer && (
                    <div className="ml-6 p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-600">Answer</span>
                      </div>
                      <p className="text-sm">{question.answer}</p>
                      {question.answeredAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Answered on {new Date(question.answeredAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {(!paginatedQuestions || paginatedQuestions.length === 0) && (
                <p className="text-center text-muted-foreground py-12">
                  No questions found
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Answer Question</DialogTitle>
            <DialogDescription>Provide an answer to the customer's question</DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <AnswerForm
              question={selectedQuestion}
              onSubmit={(answer, isPublished) => {
                answerQuestionMutation.mutate({
                  id: selectedQuestion.id,
                  answer,
                  isPublished,
                });
              }}
              isSubmitting={answerQuestionMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnswerForm({
  question,
  onSubmit,
  isSubmitting,
}: {
  question: Question;
  onSubmit: (answer: string, isPublished: boolean) => void;
  isSubmitting: boolean;
}) {
  const [answer, setAnswer] = useState(question.answer || "");
  const [isPublished, setIsPublished] = useState(question.isPublished);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted rounded-md">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Question</span>
        </div>
        <p className="text-sm">{question.question}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Asked by {question.userName || "Anonymous"} about {question.productName || "Unknown Product"}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={4}
          data-testid="input-answer"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="rounded"
          data-testid="checkbox-publish"
        />
        <Label htmlFor="isPublished">Publish this Q&A on the product page</Label>
      </div>

      <Button
        onClick={() => onSubmit(answer, isPublished)}
        disabled={!answer.trim() || isSubmitting}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
        data-testid="button-submit-answer"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
        ) : (
          "Save Answer"
        )}
      </Button>
    </div>
  );
}
