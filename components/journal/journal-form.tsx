"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import MDEditor from "@uiw/react-md-editor";
import {
  useCreateJournalEntry,
  useUpdateJournalEntry,
} from "@/hooks/use-journal";
import { useStrategies } from "@/hooks/use-strategies";
import { useTransactions } from "@/hooks/use-transactions";
import { JournalEntry } from "@/lib/db/schema";
import { toast } from "sonner";
import { useState } from "react";

const journalFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  date: z.date(),
  type: z.enum(["PRE_TRADE", "POST_TRADE", "ANALYSIS", "NOTE"]),
  content: z.string().min(10, "Content must be at least 10 characters"),
  strategyId: z.string().optional(),
  transactionId: z.string().optional(),
  tags: z.string().optional(),
  attachments: z.any().optional(),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

interface JournalFormProps {
  entry?: JournalEntry;
  onSuccess: () => void;
}

export function JournalForm({ entry, onSuccess }: JournalFormProps) {
  const { createEntry } = useCreateJournalEntry();
  const { updateEntry } = useUpdateJournalEntry();
  const { strategies } = useStrategies();
  const { transactions } = useTransactions();

  const [content, setContent] = useState<string>(entry?.content || "");
  const [attachments, setAttachments] = useState<string[]>(
    entry?.attachments || []
  );

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      title: entry?.title || "",
      date: entry?.date ? new Date(entry.date) : new Date(),
      type: entry?.type || "NOTE",
      content: entry?.content || "**Hello world!!!**",
      strategyId: entry?.strategyId || undefined,
      transactionId: entry?.transactionId || undefined,
      tags: entry?.tags?.join(", ") || "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await convertToBase64(file);
        newAttachments.push(base64 as string);
      }
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = async (data: JournalFormValues) => {
    try {
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t)
        : [];

      const payload = {
        ...data,
        content: content,
        tags: tagsArray,
        attachments: attachments,
      };

      // Create a copy without attachments for the payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { attachments: _, ...safePayload } = payload;

      if (entry) {
        await updateEntry(entry.id, {
          ...safePayload,
          tags: tagsArray,
        } as unknown as Partial<JournalEntry>); // Clean cast
        toast.success("Entry updated");
      } else {
        await createEntry({
          ...safePayload,
          tags: tagsArray,
          attachments: attachments,
        } as unknown as Omit<JournalEntry, "id" | "createdAt" | "updatedAt">);
        toast.success("Entry created");
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Market Analysis - BTC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PRE_TRADE">Pre-Trade</SelectItem>
                    <SelectItem value="POST_TRADE">Post-Trade</SelectItem>
                    <SelectItem value="ANALYSIS">Analysis</SelectItem>
                    <SelectItem value="NOTE">Note</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="strategyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Strategy (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {strategies?.map((strategy) => (
                      <SelectItem key={strategy.id} value={strategy.id}>
                        {strategy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Transaction (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transaction" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {transactions?.map((tx) => (
                      <SelectItem key={tx.id} value={tx.id}>
                        {tx.type} - {format(new Date(tx.date), "dd/MM")} (
                        {tx.totalValue})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => {
                      setContent(val || "");
                      field.onChange(val || "");
                    }}
                    height={400}
                    preview="edit"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="#btc, #swing, #analysis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Attachments</FormLabel>
          <div className="flex flex-wrap gap-4">
            {attachments.map((src, index) => (
              <div key={index} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Attachment ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  &times;
                </button>
              </div>
            ))}
            <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 relative">
              <span className="text-2xl text-muted-foreground">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Entry
        </Button>
      </form>
    </Form>
  );
}
