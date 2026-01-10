import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface JournalTableProps {
  entries: JournalEntry[];
  onViewDetails: (entry: JournalEntry) => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalTable({
  entries,
  onViewDetails,
  onEdit,
  onDelete,
}: JournalTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={entry.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onViewDetails(entry)}>
              <TableCell>{format(new Date(entry.date), "PPP")}</TableCell>
              <TableCell className="font-medium">{entry.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    entry.type === "PRE_TRADE"
                      ? "default"
                      : entry.type === "POST_TRADE"
                      ? "secondary"
                      : entry.type === "ANALYSIS"
                      ? "outline"
                      : "secondary"
                  }>
                  {entry.type.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {entry.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {entry.tags && entry.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{entry.tags.length - 3}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the journal entry "{entry.title}".
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
                          className={buttonVariants({
                            variant: "destructive",
                          })}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
