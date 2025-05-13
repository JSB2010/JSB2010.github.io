"use client";

import React, { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}

/**
 * Memoized page size selector component for the admin dashboard
 */
function PageSizeSelectorComponent({
  pageSize,
  onPageSizeChange
}: PageSizeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows per page:</span>
      <Select
        value={pageSize.toString()}
        onValueChange={onPageSizeChange}
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
  );
}

// Memoize the component to prevent unnecessary re-renders
export const PageSizeSelector = memo(PageSizeSelectorComponent);
