import { useState } from "react";
import { JournalEntry } from "@/lib/db/schema";
// JournalCard import removed
import { Skeleton } from "@/components/ui/skeleton";
import { JournalTable } from "./list/journal-table";
import { JournalMobileList } from "./list/journal-mobile-list";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface JournalListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onViewDetails: (entry: JournalEntry) => void;
}

export function JournalList({
  entries,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}: JournalListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 12; // Use simplified number for grid (3 columns)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
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

  // Pagination Logic
  const totalCount = entries.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = page > totalPages && totalPages > 0 ? totalPages : page;

  const paginatedEntries = entries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <JournalMobileList
          entries={paginatedEntries}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <div className="hidden md:block">
        <JournalTable
          entries={paginatedEntries}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
