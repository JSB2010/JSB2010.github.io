'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/auth-context'; // Assuming this path is correct
import { ProtectedRoute } from '@/components/admin/protected-route'; // Assuming this path is correct
import { Submission, getSubmissions, updateSubmission } from '@/lib/firebase/submissionsService'; // Updated import
import { Timestamp } from 'firebase/firestore';

// Status badge colors (assuming these remain relevant)
const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  read: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
};

// Priority badge colors
const priorityColors: Record<number, string> = {
  1: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  2: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  4: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  5: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
};

// Priority labels
const priorityLabels: Record<number, string> = {
  1: 'Highest',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Lowest'
};

// Note: The Submission interface is now imported from submissionsService.
// It should look like this (or similar) in submissionsService.ts:
// export interface Submission {
//   id: string; // Firestore document ID
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
//   timestamp: Timestamp; // Firestore Timestamp
//   status: 'new' | 'read' | 'replied' | 'archived';
//   priority?: number;
//   tags?: string[];
//   // userAgent, ipAddress, source if you still collect them
// }


export default function AdminSubmissionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAdminAuth(); // Get auth loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Pagination state
  const [itemsPerPage] = useState(10); // Renamed from limit for clarity
  const [currentPage, setCurrentPage] = useState(1); // Renamed from page

  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>(''); // 'new', 'read', etc.
  const [priorityFilter, setPriorityFilter] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState(''); // Will be handled by service if implemented

  // Sorting state
  const [sortField, setSortField] = useState('timestamp'); // Default sort field
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc'); // Default sort direction

  const fetchSubmissionsCallback = useCallback(async () => {
    if (authLoading) return; // Don't fetch if auth is still loading
    if (!user) { // If not authenticated, redirect or show message
        setIsLoading(false);
        // Optionally redirect to login if not handled by ProtectedRoute
        // router.push('/admin/login'); 
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const filters: { status?: string; priority?: number } = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const sortOptions = { field: sortField, direction: sortDirection };
      
      // Pass searchQuery to getSubmissions if your service implements it
      const result = await getSubmissions(itemsPerPage, currentPage, filters, sortOptions, searchQuery);

      setSubmissions(result.submissions);
      setTotalSubmissions(result.total);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError('An error occurred while fetching submissions.');
      console.error('Fetch error:', err);
      if (err.code === 'permission-denied' || err.message?.includes("Missing or insufficient permissions")) {
         setError('Permission denied. Ensure Firestore rules are set up correctly.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading, itemsPerPage, currentPage, statusFilter, priorityFilter, sortField, sortDirection, searchQuery]);

  useEffect(() => {
    fetchSubmissionsCallback();
  }, [fetchSubmissionsCallback]);


  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Handle view submission (can remain similar, just uses Firestore ID)
  const handleViewSubmission = (id: string) => {
    router.push(`/admin/submissions/${id}`); // Assuming this route exists for viewing details
  };
  
  // Handle status change (example of an update operation)
  const handleStatusChange = async (id: string, newStatus: Submission['status']) => {
    try {
        await updateSubmission(id, { status: newStatus });
        // Refresh data or update local state
        fetchSubmissionsCallback(); 
        // Or, for a more responsive UI without refetching everything:
        // setSubmissions(prev => prev.map(s => s.id === id ? {...s, status: newStatus} : s));
    } catch (updateError) {
        console.error("Error updating status:", updateError);
        setError("Failed to update submission status.");
    }
  };


  // Format date from Firestore Timestamp
  const formatDate = (timestamp: Timestamp | string | undefined): string => {
    if (!timestamp) return 'N/A';
    if (typeof timestamp === 'string') { // Handle cases where it might still be a string
        try {
            return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
        } catch {
            return 'Invalid Date';
        }
    }
    // Check if it's a Firestore Timestamp object
    if (timestamp && typeof timestamp.toDate === 'function') {
      const date = timestamp.toDate();
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    return 'Invalid Date';
  };

  // Render status badge (can remain similar)
  const renderStatusBadge = (status: string) => {
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Render priority badge (can remain similar)
  const renderPriorityBadge = (priority?: number) => {
    if (priority === undefined) return <Badge>N/A</Badge>;
    const colorClass = priorityColors[priority] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={colorClass}>
        {priorityLabels[priority] || priority}
      </Badge>
    );
  };
  
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle actual search submission (e.g., on button click or after debounce)
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchSubmissionsCallback();
  };


  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Contact Form Submissions (Firestore)</CardTitle>
                <CardDescription>
                  Manage and respond to contact form submissions from Firestore.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSubmissionsCallback}
                disabled={isLoading || authLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${(isLoading || authLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by name or email (if service supports)"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="h-9"
              />
               <Button onClick={handleSearch} size="sm" className="h-9" disabled={isLoading || authLoading}>
                 <Search className="h-4 w-4 mr-2" /> Search
               </Button>
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                disabled={isLoading || authLoading}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter?.toString() || ''}
                onValueChange={(value) => { setPriorityFilter(value ? parseInt(value) : undefined); setCurrentPage(1);}}
                disabled={isLoading || authLoading}
              >
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="1">Highest</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                  <SelectItem value="5">Lowest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] cursor-pointer hover:bg-muted/20" onClick={() => { setSortField('timestamp'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); setCurrentPage(1); }}>Date {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/20" onClick={() => { setSortField('name'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); setCurrentPage(1); }}>Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[100px] cursor-pointer hover:bg-muted/20" onClick={() => { setSortField('status'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); setCurrentPage(1); }}>Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                  <TableHead className="w-[100px] cursor-pointer hover:bg-muted/20" onClick={() => { setSortField('priority'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); setCurrentPage(1); }}>Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading || authLoading) ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <span className="mt-2 text-sm text-muted-foreground">Loading submissions...</span>
                    </TableCell>
                  </TableRow>
                ) : submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <span className="text-sm text-muted-foreground">No submissions found</span>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(submission.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{submission.name}</div>
                        <div className="text-xs text-muted-foreground">{submission.email}</div>
                      </TableCell>
                      <TableCell>
                        {submission.subject}
                      </TableCell>
                      <TableCell>
                        {/* Example: Dropdown to change status */}
                        <Select value={submission.status} onValueChange={(newStatus) => handleStatusChange(submission.id, newStatus as Submission['status'])}>
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">{renderStatusBadge('new')}</SelectItem>
                                <SelectItem value="read">{renderStatusBadge('read')}</SelectItem>
                                <SelectItem value="replied">{renderStatusBadge('replied')}</SelectItem>
                                <SelectItem value="archived">{renderStatusBadge('archived')}</SelectItem>
                            </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {renderPriorityBadge(submission.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSubmission(submission.id)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/submissions/${submission.id}/edit`)} // Assuming an edit page
                            title="Edit submission"
                          >
                            <Edit className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {isLoading || authLoading || submissions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalSubmissions)} of {totalSubmissions} submissions
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading || authLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading || authLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
}