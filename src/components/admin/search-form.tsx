"use client";

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
  loading: boolean;
  lastSaved: Date | null;
  getTimeRemaining: () => { hours: number; minutes: number; seconds: number } | null;
}

/**
 * Memoized search form component for the admin dashboard
 */
function SearchFormComponent({
  searchQuery,
  onSearchChange,
  onSearch,
  onReset,
  loading,
  lastSaved,
  getTimeRemaining
}: SearchFormProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Search & Filter</h3>
        
        {/* Show last saved time if available */}
        {lastSaved && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getTimeRemaining() && `${getTimeRemaining()?.minutes}m remaining`}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search settings will be remembered for {getTimeRemaining()?.hours || 24} hours</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="searchQuery"
            placeholder="Search submissions..."
            className="pl-8"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onReset} disabled={loading}>
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const SearchForm = memo(SearchFormComponent);
