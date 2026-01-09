import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { JournalEntry } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export function useJournalEntries() {
  const entries = useLiveQuery(() =>
    db.journalEntries.reverse().sortBy("date")
  );
  return { entries, isLoading: !entries };
}

export function useJournalEntry(id: string) {
  const entry = useLiveQuery(() => db.journalEntries.get(id), [id]);
  return { entry, isLoading: entry === undefined };
}

export function useCreateJournalEntry() {
  const createEntry = async (
    data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) => {
    const id = uuidv4();
    const now = new Date();
    await db.journalEntries.add({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  };
  return { createEntry };
}

export function useUpdateJournalEntry() {
  const updateEntry = async (
    id: string,
    data: Partial<Omit<JournalEntry, "id" | "createdAt" | "updatedAt">>
  ) => {
    await db.journalEntries.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  };
  return { updateEntry };
}

export function useDeleteJournalEntry() {
  const deleteEntry = async (id: string) => {
    await db.journalEntries.delete(id);
  };
  return { deleteEntry };
}
