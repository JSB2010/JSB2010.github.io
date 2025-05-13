'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Search, Filter, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';

// Status badge colors
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

// Submission type
interface Submission {
  $id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: number;
  tags?: string[];
  statusLog?: Array<{
    previousStatus?: string;
    newStatus: string;
    timestamp: string;
    updatedBy: string;
  }>;
  lastUpdated?: string;
  $createdAt: string;
  $updatedAt: string;
}

export default function AdminSubmissionsPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  // Pagination state
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  // Filtering state
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Sorting state
  const [orderBy, setOrderBy] = useState('$createdAt');
  const [orderType, setOrderType] = useState('desc');

  // Check if authenticated
  useEffect(() => {
    const storedApiKey = localStorage.getItem('adminApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // Redirect to login page if not authenticated
      router.push('/admin');
    }
  }, [router]);

  // Fetch submissions when filters, pagination, or sorting changes
  useEffect(() => {
    if (apiKey) {
      fetchSubmissions();
    }
  }, [apiKey, fetchSubmissions]);

  // Fetch submissions from the API
  const fetchSubmissions = useCallback(async () => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        orderBy,
        orderType
      });

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      if (priorityFilter) {
        params.append('priority', priorityFilter);
      }

      // Fetch submissions
      const response = await fetch(`/api/admin/submissions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login page
          localStorage.removeItem('adminApiKey');
          router.push('/admin');
          return;
        }

        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmissions(data.submissions);
        setTotalSubmissions(data.total);
      } else {
        setError(data.error || 'Failed to fetch submissions');
      }
    } catch (error) {
      setError('An error occurred while fetching submissions');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, limit, offset, statusFilter, priorityFilter, orderBy, orderType, router]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalSubmissions / limit);
    if (newPage < 1 || newPage > totalPages) return;

    setPage(newPage);
    setOffset((newPage - 1) * limit);
  };

  // Handle view submission
  const handleViewSubmission = (id: string) => {
    router.push(`/admin/submissions/${id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Render priority badge
  const renderPriorityBadge = (priority: number) => {
    const colorClass = priorityColors[priority] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={colorClass}>
        {priorityLabels[priority] || priority}
      </Badge>
    );
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>
                Manage and respond to contact form submissions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
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
                value={priorityFilter}
                onValueChange={setPriorityFilter}
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

          {/* Error message */}
          {error && (
            <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Submissions table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Priority</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
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
                    <TableRow key={submission.$id}>
                      <TableCell className="font-mono text-xs">
                        {formatDate(submission.$createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{submission.name}</div>
                        <div className="text-xs text-muted-foreground">{submission.email}</div>
                      </TableCell>
                      <TableCell>
                        {submission.subject}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(submission.status)}
                      </TableCell>
                      <TableCell>
                        {renderPriorityBadge(submission.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSubmission(submission.$id)}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewSubmission(submission.$id)}
                            title="Edit submission"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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
              Showing {offset + 1}-{Math.min(offset + limit, totalSubmissions)} of {totalSubmissions} submissions
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Page {page} of {Math.max(1, Math.ceil(totalSubmissions / limit))}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(totalSubmissions / limit) || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}