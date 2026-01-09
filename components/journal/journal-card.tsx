"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JournalEntry } from "@/lib/db/schema";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalCard({ entry, onEdit, onDelete }: JournalCardProps) {
  // Truncate content for preview
  const preview =
    entry.content.length > 150
      ? entry.content.substring(0, 150) + "..."
      : entry.content;

  const typeColor =
    entry.type === "PRE_TRADE"
      ? "default" // or specific color
      : entry.type === "POST_TRADE"
      ? "secondary"
      : entry.type === "ANALYSIS"
      ? "outline"
      : "secondary"; // NOTE

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className="text-sm font-medium line-clamp-1"
          title={entry.title}>
          {entry.title}
        </CardTitle>
        <Badge variant={typeColor}>{entry.type.replace("_", " ")}</Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="text-xs text-muted-foreground">
          {format(new Date(entry.date), "PPP")}
        </div>
        <div className="text-sm text-foreground/80 flex-1 line-clamp-4 whitespace-pre-wrap">
          {preview}
        </div>

        {(entry.tags && entry.tags.length > 0) ||
        (entry.attachments && entry.attachments.length > 0) ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {entry.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-1.5 h-5">
                {tag}
              </Badge>
            ))}
            {entry.attachments && entry.attachments.length > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                📷 {entry.attachments.length}
              </Badge>
            )}
          </div>
        ) : null}

        <div className="flex justify-end gap-2 pt-4 mt-auto border-t">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(entry)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive/90"
            onClick={() => onDelete(entry.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
