"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JournalEntry } from "@/lib/db/schema";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalCard({
  entry,
  onClick,
  onEdit,
  onDelete,
}: JournalCardProps) {
  const typeColor =
    entry.type === "PRE_TRADE"
      ? "default"
      : entry.type === "POST_TRADE"
      ? "secondary"
      : entry.type === "ANALYSIS"
      ? "outline"
      : "secondary";

  return (
    <Card
      className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer hover:bg-muted/50"
      onClick={onClick}>
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

        {(entry.tags && entry.tags.length > 0) ||
        (entry.attachments && entry.attachments.length > 0) ? (
          <div className="flex flex-wrap gap-2 mt-auto">
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

        <div className="flex justify-end gap-2 pt-2 mt-auto border-t">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/90"
                onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  journal entry "{entry.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className={buttonVariants({ variant: "destructive" })}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
