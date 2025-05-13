"use client";

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

/**
 * Memoized pagination component for the admin dashboard
 */
function PaginationComponent({
  currentPage,
  totalPages,
  loading,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => onPageChange(page)}
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
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || loading}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const Pagination = memo(PaginationComponent);
