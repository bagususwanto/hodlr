"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JournalList } from "@/components/journal/journal-list";
import { JournalForm } from "@/components/journal/journal-form";
import { useJournalEntries } from "@/hooks/use-journal";
import { JournalEntry } from "@/lib/db/schema";

export default function JournalPage() {
  const { entries, isLoading } = useJournalEntries();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(
    undefined
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredEntries = entries?.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType = typeFilter === "ALL" || entry.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedEntry(undefined);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col gap-4 p-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Journal</h1>
            <p className="text-muted-foreground">
              Document your trading journey and analysis.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedEntry(undefined)}>
                <Plus className="mr-2 h-4 w-4" /> New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedEntry ? "Edit Entry" : "New Entry"}
                </DialogTitle>
                <DialogDescription>
                  {selectedEntry
                    ? "Update your journal entry."
                    : "Create a new journal entry."}
                </DialogDescription>
              </DialogHeader>
              <JournalForm
                key={selectedEntry?.id || "new"}
                entry={selectedEntry}
                onSuccess={handleClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, content, or tags..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="PRE_TRADE">Pre-Trade</option>
            <option value="POST_TRADE">Post-Trade</option>
            <option value="ANALYSIS">Analysis</option>
            <option value="NOTE">Note</option>
          </select>
        </div>
      </div>

      <div className="flex-1 rounded-xl bg-muted/10 p-4">
        <JournalList
          entries={filteredEntries || []}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
