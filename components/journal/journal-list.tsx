"use client";

import { JournalEntry } from "@/lib/db/schema";
// JournalCard import removed
import { Skeleton } from "@/components/ui/skeleton";
import { JournalTable } from "./list/journal-table";
import { JournalMobileList } from "./list/journal-mobile-list";

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

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        <JournalMobileList
          entries={entries}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
      <div className="hidden md:block">
        <JournalTable
          entries={entries}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
