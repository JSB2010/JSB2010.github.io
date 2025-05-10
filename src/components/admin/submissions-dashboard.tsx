"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Search,
  RefreshCw,
  Eye,
  Calendar,
  Mail,
  User,
  MessageSquare,
  AlertCircle,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Download
} from "lucide-react";
import { submissionsService, ContactSubmission } from "@/lib/appwrite/submissions";
import { Query } from "appwrite";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export function SubmissionsDashboard() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<ContactSubmission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState<string>("$createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState<number>(10);

  // Use pageSize state instead of fixed limit

  // Fetch all submissions for statistics on mount
  useEffect(() => {
    fetchAllSubmissionsForStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch paginated submissions on mount and when page, search, sort, or page size changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchSubmissions();
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, sortField, sortDirection, pageSize]);

  // Fetch all submissions for statistics
  const fetchAllSubmissionsForStats = async () => {
    setStatsLoading(true);

    try {
      // Fetch all submissions with a large limit
      const response = await submissionsService.getSubmissions(1000, 0, [
        Query.orderDesc('$createdAt')
      ]);

      setAllSubmissions(response.submissions);
    } catch (err: unknown) {
      console.error("Error fetching statistics:", err);
      // Don't show error for stats loading
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch submissions from Appwrite
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const offset = (currentPage - 1) * pageSize;
      let response;

      // Create sort query based on current sort field and direction
      const sortQuery = sortDirection === "asc"
        ? Query.orderAsc(sortField)
        : Query.orderDesc(sortField);

      if (searchQuery) {
        response = await submissionsService.searchSubmissions(
          searchQuery,
          pageSize,
          offset,
          [sortQuery]
        );
      } else {
        response = await submissionsService.getSubmissions(
          pageSize,
          offset,
          [sortQuery]
        );
      }

      setSubmissions(response.submissions);
      setTotalSubmissions(response.total);
    } catch (err: unknown) {
      console.error("Error fetching submissions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchSubmissions();
  };

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size

    // Show toast notification
    toast({
      title: "Page size updated",
      description: `Now showing ${newSize} submissions per page.`,
      variant: "default",
    });
  };

  // Handle view submission
  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  // Removed handleMarkAsRead function

  // Handle delete submission
  const handleDeleteSubmission = async (submission: ContactSubmission) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      await submissionsService.deleteSubmission(submission.$id);

      // Close dialog if the deleted submission is currently selected
      if (selectedSubmission && selectedSubmission.$id === submission.$id) {
        setIsDialogOpen(false);
        setSelectedSubmission(null);
      }

      // Show success toast
      toast({
        title: "Submission deleted",
        description: "The submission has been successfully deleted.",
        variant: "success",
      });

      // Refresh submissions
      fetchSubmissions();
      // Also refresh statistics
      fetchAllSubmissionsForStats();
    } catch (err: unknown) {
      console.error("Error deleting submission:", err);
      setError(err instanceof Error ? err.message : "Failed to delete submission");

      // Show error toast
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete submission",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalSubmissions / pageSize);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (_) {
      return dateString;
    }
  };

  // Export submissions to CSV
  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ["Name", "Email", "Subject", "Message", "Date", "Source", "IP Address"];
      const csvRows = [headers];

      // Add data rows
      submissions.forEach(submission => {
        const row = [
          submission.name,
          submission.email,
          submission.subject,
          submission.message.replace(/"/g, '""'), // Escape quotes
          new Date(submission.timestamp || submission.$createdAt).toISOString(),
          submission.source || "",
          submission.ipAddress || ""
        ];
        csvRows.push(row.map(cell => `"${cell}"`)); // Wrap in quotes to handle commas
      });

      // Create CSV content
      const csvContent = csvRows.map(row => row.join(",")).join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success toast
      toast({
        title: "Export successful",
        description: `${submissions.length} submissions exported to CSV.`,
        variant: "success",
      });
    } catch (err) {
      console.error("Error exporting to CSV:", err);

      // Show error toast
      toast({
        title: "Export failed",
        description: "There was an error exporting submissions to CSV.",
        variant: "destructive",
      });
    }
  };

  // Calculate statistics using all submissions
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todaySubmissions = allSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp || s.$createdAt);
    return submissionDate >= todayStart;
  }).length;

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisWeekSubmissions = allSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp || s.$createdAt);
    return submissionDate >= thisWeekStart;
  }).length;

  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthSubmissions = allSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp || s.$createdAt);
    return submissionDate >= thisMonthStart;
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="relative">
        <div className="absolute right-0 top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAllSubmissionsForStats}
            disabled={statsLoading}
            className="h-8 w-8"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh statistics</span>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center h-10">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{allSubmissions.length}</div>
                <p className="text-xs text-muted-foreground">
                  All time submissions
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center h-10">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{todaySubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Submissions today
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center h-10">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{thisWeekSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Submissions this week
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="flex items-center justify-center h-10">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{thisMonthSubmissions}</div>
                <p className="text-xs text-muted-foreground">
                  Submissions this month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>
                Manage and view submissions from your contact form
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={loading || submissions.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubmissions}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and filter */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search submissions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading}>Search</Button>
            </form>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {/* Submissions table */}
          {loading ? (
            <div className="py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No submissions found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortField === "name" && (
                          sortDirection === "asc" ?
                            <ArrowUp className="h-4 w-4" /> :
                            <ArrowDown className="h-4 w-4" />
                        )}
                        {sortField !== "name" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("subject")}
                    >
                      <div className="flex items-center gap-1">
                        Subject
                        {sortField === "subject" && (
                          sortDirection === "asc" ?
                            <ArrowUp className="h-4 w-4" /> :
                            <ArrowDown className="h-4 w-4" />
                        )}
                        {sortField !== "subject" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </div>
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("$createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === "$createdAt" && (
                          sortDirection === "asc" ?
                            <ArrowUp className="h-4 w-4" /> :
                            <ArrowDown className="h-4 w-4" />
                        )}
                        {sortField !== "$createdAt" && <ArrowUpDown className="h-4 w-4 opacity-50" />}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.$id}>
                      {/* Status cell removed */}
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(submission.timestamp || submission.$createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          {/* Mark as read button removed */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubmission(submission)}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Page size selector and pagination */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                  className="hidden sm:flex items-center gap-1 px-2.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:hidden"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => {
                      // Add ellipsis
                      if (index > 0 && page > array[index - 1] + 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className="h-8 w-8 mx-0.5"
                        >
                          {page}
                        </Button>
                      );
                    })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="hidden sm:flex items-center gap-1 px-2.5"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:hidden"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </nav>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {submissions.length} of {totalSubmissions} submissions
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </CardFooter>
      </Card>

      {/* Submission details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubmission.subject}</DialogTitle>
                <DialogDescription>
                  Submission from {selectedSubmission.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    Name:
                  </div>
                  <div className="font-medium">{selectedSubmission.name}</div>

                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    Email:
                  </div>
                  <div>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date:
                  </div>
                  <div>{formatDate(selectedSubmission.timestamp || selectedSubmission.$createdAt)}</div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Message:</h4>
                  <div className="p-3 rounded-md bg-muted/50 whitespace-pre-wrap text-sm">
                    {selectedSubmission.message}
                  </div>
                </div>

                {(selectedSubmission.userAgent || selectedSubmission.source || selectedSubmission.ipAddress) && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">Additional Information:</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {selectedSubmission.source && (
                        <p>Source: {selectedSubmission.source}</p>
                      )}
                      {selectedSubmission.ipAddress && (
                        <p>IP Address: {selectedSubmission.ipAddress}</p>
                      )}
                      {selectedSubmission.userAgent && (
                        <p>User Agent: {selectedSubmission.userAgent}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex sm:justify-between gap-2">
                <div className="hidden sm:flex">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSubmission(selectedSubmission)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Mark as read button removed */}

                  <Button
                    size="sm"
                    className="flex-1 sm:flex-initial"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
