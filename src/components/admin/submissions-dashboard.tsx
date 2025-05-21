"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { formatDistanceToNow, startOfToday, startOfWeek, startOfMonth } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
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
import { LoadingSpinner } from "@/components/ui/loading-spinner"; // Assuming this component exists
import {
  RefreshCw,
  Calendar,
  MessageSquare,
  AlertCircle,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  User,
  Mail
} from "lucide-react";
import {
  Submission, // Using the Submission type from our new service
  getSubmissions,
  getAllSubmissions,
  deleteSubmission as deleteSubmissionService, // aliasing to avoid name conflict
  getSubmissionsCount
} from "@/lib/firebase/submissionsService";
import { Timestamp } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast"; // Assuming this path
import { useFormPersistence } from "@/hooks/use-form-persistence"; // Assuming this path
import { SubmissionRow } from "./submission-row"; // Assuming this component is adapted or generic enough
import { StatsCard } from "./stats-card"; // Assuming this component exists
import { Pagination } from "./pagination"; // Assuming this component exists
import { PageSizeSelector } from "./page-size-selector"; // Assuming this component exists
import { SearchForm } from "./search-form"; // Assuming this component exists

// Define ContactSubmission if it's specifically needed, otherwise rely on Submission
// For this refactor, we'll assume Submission from submissionsService is sufficient.
// export type ContactSubmission = Submission;


export function SubmissionsDashboard() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [allSubmissionsForStats, setAllSubmissionsForStats] = useState<Submission[]>([]); // For stats calculation
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialValues = {
    searchQuery: "",
    currentPage: 1,
    sortField: "timestamp", // Firestore field name
    sortDirection: "desc" as "asc" | "desc",
    pageSize: 10
  };

  const {
    formData,
    updateFormData,
    resetFormData,
  } = useFormPersistence(
    'admin-submissions-dashboard-settings', // Unique key for this instance
    initialValues,
    { expiryMinutes: 60 * 24, saveOnUnload: true }
  );

  const { searchQuery, currentPage, sortField, sortDirection, pageSize } = formData;

  const fetchSubmissionsCallback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: { status?: string; priority?: number } = {}; // Add filters if implemented
      const sortOptions = { field: sortField, direction: sortDirection };
      
      // Pass searchQuery if your getSubmissions service supports it
      const result = await getSubmissions(pageSize, currentPage, filters, sortOptions, searchQuery);
      setSubmissions(result.submissions);
      setTotalSubmissions(result.total);
      setTotalPages(result.totalPages);
    } catch (err: unknown) {
      console.error("Error fetching submissions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortField, sortDirection, searchQuery]);
  
  const fetchAllSubmissionsForStatsCallback = useCallback(async () => {
    setStatsLoading(true);
    try {
      // Fetch all submissions (or a large enough set for accurate stats)
      // Consider if getAllSubmissions is too heavy; getSubmissionsCount might be better for some stats.
      const allSubs = await getAllSubmissions({ field: "timestamp", direction: "desc" });
      setAllSubmissionsForStats(allSubs);
    } catch (err: unknown) {
      console.error("Error fetching all submissions for stats:", err);
      // Not critical to show error for stats usually
    } finally {
      setStatsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchSubmissionsCallback();
    fetchAllSubmissionsForStatsCallback();
  }, [fetchSubmissionsCallback, fetchAllSubmissionsForStatsCallback]);

  const handleSort = useCallback((field: string) => {
    const newDirection = (sortField === field && sortDirection === "desc") ? "asc" : "desc";
    updateFormData({ sortField: field, sortDirection: newDirection, currentPage: 1 });
  }, [sortField, sortDirection, updateFormData]);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFormData({ currentPage: 1 });
    // fetchSubmissionsCallback will be called due to dependency change on formData
    toast({ title: "Search updated", description: "Displaying matching submissions."});
  }, [updateFormData, toast]);
  
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ searchQuery: e.target.value });
  }, [updateFormData]);

  const handlePageSizeChange = useCallback((value: string) => {
    updateFormData({ pageSize: parseInt(value, 10), currentPage: 1 });
    toast({ title: "Page size updated", description: `Now showing ${value} submissions per page.` });
  }, [updateFormData, toast]);

  const handleResetSearch = useCallback(() => {
    resetFormData(); // This will trigger a re-fetch due to formData dependency in useEffect
    toast({ title: "Search reset", description: "Search settings have been reset." });
  }, [resetFormData, toast]);


  const handleViewSubmission = useCallback((submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteSubmission = useCallback(async (submission: Submission) => {
    if (!confirm("Are you sure you want to delete this submission? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteSubmissionService(submission.id);
      if (selectedSubmission && selectedSubmission.id === submission.id) {
        setIsDialogOpen(false);
        setSelectedSubmission(null);
      }
      toast({ title: "Submission deleted", variant: "success" });
      fetchSubmissionsCallback(); // Refresh list
      fetchAllSubmissionsForStatsCallback(); // Refresh stats
    } catch (err: unknown) {
      console.error("Error deleting submission:", err);
      const message = err instanceof Error ? err.message : "Failed to delete submission";
      setError(message);
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  }, [toast, selectedSubmission, fetchSubmissionsCallback, fetchAllSubmissionsForStatsCallback]);

  const formatDateDisplay = useCallback((timestamp: Timestamp | string | undefined): string => {
    if (!timestamp) return 'N/A';
    let date: Date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else {
      try {
        date = new Date(timestamp);
      } catch {
        return 'Invalid Date';
      }
    }
    return formatDistanceToNow(date, { addSuffix: true });
  }, []);

  const handleExportCSV = useCallback(() => {
    try {
      const headers = ["ID", "Name", "Email", "Subject", "Message", "Date", "Status", "Priority", "Source", "IP Address", "User Agent"];
      const csvRows = [headers.join(",")];

      allSubmissionsForStats.forEach(sub => { // Use allSubmissionsForStats for complete export
        const row = [
          sub.id,
          `"${sub.name.replace(/"/g, '""')}"`,
          `"${sub.email.replace(/"/g, '""')}"`,
          `"${sub.subject.replace(/"/g, '""')}"`,
          `"${sub.message.replace(/"/g, '""')}"`,
          sub.timestamp instanceof Timestamp ? sub.timestamp.toDate().toISOString() : (sub.timestamp || ''),
          sub.status,
          sub.priority?.toString() || '',
          `"${(sub.source || '').replace(/"/g, '""')}"`,
          `"${(sub.ipAddress || '').replace(/"/g, '""')}"`,
          `"${(sub.userAgent || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(","));
      });
      
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `contact-submissions-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Export successful", description: `${allSubmissionsForStats.length} submissions exported.`, variant: "success" });
    } catch (err) {
      console.error("Error exporting to CSV:", err);
      toast({ title: "Export failed", variant: "destructive" });
    }
  }, [allSubmissionsForStats, toast]);

  const stats = useMemo(() => {
    const today = startOfToday();
    const weekStart = startOfWeek(today);
    const monthStart = startOfMonth(today);

    return {
      todaySubmissions: allSubmissionsForStats.filter(s => s.timestamp && s.timestamp.toDate() >= today).length,
      thisWeekSubmissions: allSubmissionsForStats.filter(s => s.timestamp && s.timestamp.toDate() >= weekStart).length,
      thisMonthSubmissions: allSubmissionsForStats.filter(s => s.timestamp && s.timestamp.toDate() >= monthStart).length,
      total: allSubmissionsForStats.length
    };
  }, [allSubmissionsForStats]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute right-0 top-0 z-10">
          <Button variant="ghost" size="sm" onClick={fetchAllSubmissionsForStatsCallback} disabled={statsLoading} className="h-8 w-8" title="Refresh statistics">
            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Submissions" value={stats.total} icon={<MessageSquare className="h-4 w-4" />} loading={statsLoading} />
          <StatsCard title="Today" value={stats.todaySubmissions} icon={<Calendar className="h-4 w-4" />} loading={statsLoading} />
          <StatsCard title="This Week" value={stats.thisWeekSubmissions} icon={<Calendar className="h-4 w-4" />} loading={statsLoading} />
          <StatsCard title="This Month" value={stats.thisMonthSubmissions} icon={<Calendar className="h-4 w-4" />} loading={statsLoading} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>Manage and view submissions from your contact form (Firestore)</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={loading || allSubmissionsForStats.length === 0}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={fetchSubmissionsCallback} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <SearchForm
            searchQuery={searchQuery}
            onSearchChange={handleSearchInputChange}
            onSearch={handleSearch} // Search is triggered by useEffect on formData change
            onReset={handleResetSearch}
            loading={loading}
            // lastSaved and getTimeRemaining can be passed if useFormPersistence provides them
          />

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" /> {error}
            </div>
          )}

          {loading ? (
            <div className="py-8"><LoadingSpinner size="lg" /></div>
          ) : submissions.length === 0 ? (
            <div className="py-8 text-center"><p className="text-muted-foreground">No submissions found</p></div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">Name {sortField === "name" && (sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)} {sortField !== "name" && <ArrowUpDown className="h-4 w-4 opacity-50" />}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("subject")}>
                      <div className="flex items-center gap-1">Subject {sortField === "subject" && (sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)} {sortField !== "subject" && <ArrowUpDown className="h-4 w-4 opacity-50" />}</div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell cursor-pointer hover:bg-muted/50" onClick={() => handleSort("timestamp")}>
                      <div className="flex items-center gap-1">Date {sortField === "timestamp" && (sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)} {sortField !== "timestamp" && <ArrowUpDown className="h-4 w-4 opacity-50" />}</div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <SubmissionRow
                      key={submission.id}
                      submission={submission}
                      onView={handleViewSubmission}
                      onDelete={handleDeleteSubmission}
                      isDeleting={isDeleting}
                      formatDate={formatDateDisplay} // Pass formatter
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <PageSizeSelector pageSize={pageSize} onPageSizeChange={handlePageSizeChange} />
            <Pagination currentPage={currentPage} totalPages={totalPages} loading={loading} onPageChange={(page) => updateFormData({ currentPage: page })} />
          </div>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {submissions.length} of {totalSubmissions} submissions
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSubmission.subject}</DialogTitle>
                <DialogDescription>Submission from {selectedSubmission.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 my-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground"><User className="h-4 w-4 mr-2" />Name:</div>
                  <div className="font-medium">{selectedSubmission.name}</div>
                  <div className="flex items-center text-muted-foreground"><Mail className="h-4 w-4 mr-2" />Email:</div>
                  <div><a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">{selectedSubmission.email}</a></div>
                  <div className="flex items-center text-muted-foreground"><Calendar className="h-4 w-4 mr-2" />Date:</div>
                  <div>{formatDateDisplay(selectedSubmission.timestamp)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Message:</h4>
                  <div className="p-3 rounded-md bg-muted/50 whitespace-pre-wrap text-sm">{selectedSubmission.message}</div>
                </div>
                {(selectedSubmission.userAgent || selectedSubmission.source || selectedSubmission.ipAddress) && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">Additional Information:</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {selectedSubmission.source && (<p>Source: {selectedSubmission.source}</p>)}
                      {selectedSubmission.ipAddress && (<p>IP Address: {selectedSubmission.ipAddress}</p>)}
                      {selectedSubmission.userAgent && (<p>User Agent: {selectedSubmission.userAgent}</p>)}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex sm:justify-between gap-2">
                <Button variant="destructive" size="sm" onClick={() => handleDeleteSubmission(selectedSubmission)} disabled={isDeleting} className="sm:flex hidden"><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                <Button size="sm" className="flex-1 sm:flex-initial" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
