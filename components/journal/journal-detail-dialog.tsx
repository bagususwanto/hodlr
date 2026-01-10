import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { JournalEntry } from "@/lib/db/schema";
import { format } from "date-fns";
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

interface JournalDetailDialogProps {
  entry: JournalEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalDetailDialog({
  entry,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: JournalDetailDialogProps) {
  if (!entry) return null;

  const typeColor =
    entry.type === "PRE_TRADE"
      ? "default"
      : entry.type === "POST_TRADE"
      ? "secondary"
      : entry.type === "ANALYSIS"
      ? "outline"
      : "secondary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle>{entry.title}</DialogTitle>
            <Badge variant={typeColor}>{entry.type.replace("_", " ")}</Badge>
          </div>
          <DialogDescription>
            {format(new Date(entry.date), "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {entry.content}
          </div>

          {entry.tags && entry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => {
                onEdit(entry);
                onOpenChange(false);
              }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the journal entry "{entry.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onDelete(entry.id);
                      onOpenChange(false);
                    }}
                    className={buttonVariants({ variant: "destructive" })}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {entry.attachments && entry.attachments.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">
                Attachments ({entry.attachments.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {/* Placeholder for attachments viewing logic if we had real URLs */}
                {entry.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="aspect-video bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground border">
                    Attachment {i + 1}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
