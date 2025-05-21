"use client";

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { Submission } from "@/lib/firebase/submissionsService"; // Updated import
import { Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from "date-fns";

interface SubmissionRowProps {
  submission: Submission; // Use the new Submission type
  onView: (submission: Submission) => void;
  onDelete: (submission: Submission) => void;
  isDeleting: boolean;
  formatDate: (timestamp: Timestamp | string | undefined) => string; // Accept Timestamp or string
}

/**
 * Memoized component for rendering a submission row in the admin dashboard
 */
function SubmissionRowComponent({
  submission,
  onView,
  onDelete,
  isDeleting,
  formatDate, // Receive formatter from parent
}: SubmissionRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{submission.name}</TableCell>
      <TableCell>{submission.subject}</TableCell>
      <TableCell className="hidden md:table-cell">
        {/* Use the passed formatDate prop, which can handle Firestore Timestamps */}
        {formatDate(submission.timestamp)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(submission)}
            title="View submission"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(submission)}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            title="Delete submission"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SubmissionRow = memo(SubmissionRowComponent);
