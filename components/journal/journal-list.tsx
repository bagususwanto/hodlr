"use client";

import { JournalEntry } from "@/lib/db/schema";
import { JournalCard } from "./journal-card";
import { useDeleteJournalEntry } from "@/hooks/use-journal";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface JournalListProps {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
}

export function JournalList({ entries, isLoading, onEdit }: JournalListProps) {
  const { deleteEntry } = useDeleteJournalEntry();

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      toast.success("Journal entry deleted");
    } catch {
      toast.error("Failed to delete entry");
    }
  };

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
            You haven&apos;t created any journal entries yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
