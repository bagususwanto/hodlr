import { JournalEntry } from "@/lib/db/schema";
import { JournalCard } from "../journal-card";

interface JournalMobileListProps {
  entries: JournalEntry[];
  onViewDetails: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalMobileList({
  entries,
  onViewDetails,
  onEdit,
  onDelete,
}: JournalMobileListProps) {
  return (
    <div className="grid gap-4 grid-cols-1">
      {entries.map((entry) => (
        <JournalCard
          key={entry.id}
          entry={entry}
          onClick={() => onViewDetails(entry)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
