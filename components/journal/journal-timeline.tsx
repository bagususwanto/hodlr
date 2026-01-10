"use client";

import { JournalEntry } from "@/lib/db/schema";
import { format } from "date-fns";
import { JournalCard } from "./journal-card";
// Imports removed
import { Skeleton } from "@/components/ui/skeleton";

interface JournalTimelineProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onViewDetails: (entry: JournalEntry) => void;
}

import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";

export function JournalTimeline({
  entries,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}: JournalTimelineProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-full w-2 bg-muted/20" />
            <div className="flex-1 space-y-4 pb-12">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No entries</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven't created any journal entries yet.
          </p>
        </div>
      </div>
    );
  }

  // Sort entries by date (descending)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Pagination Logic
  const totalCount = sortedEntries.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = page > totalPages && totalPages > 0 ? totalPages : page;

  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-3xl mx-auto pl-4">
      {paginatedEntries.map((entry, index) => {
        const isLast = index === paginatedEntries.length - 1;
        return (
          <div key={entry.id} className="relative flex gap-6 pb-12 last:pb-0">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-border" />
            )}

            {/* Timeline dot */}
            <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-[10px] font-medium text-muted-foreground shadow-sm mt-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {format(new Date(entry.date), "PPP")}
                </span>
                <span className="text-xs text-muted-foreground/50">•</span>
                <span className="text-xs text-muted-foreground/50">
                  {format(new Date(entry.date), "h:mm a")}
                </span>
              </div>
              <JournalCard
                entry={entry}
                onClick={() => onViewDetails(entry)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </div>
        );
      })}

      <div className="mt-8">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
