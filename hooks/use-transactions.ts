import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Transaction } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export function useTransactions(assetId?: string) {
  const transactions = useLiveQuery(() => {
    if (assetId) {
      return db.transactions
        .where("assetId")
        .equals(assetId)
        .reverse()
        .sortBy("date");
    }
    return db.transactions.orderBy("date").reverse().toArray();
  }, [assetId]);

  return { transactions, isLoading: !transactions };
}

export function useTransaction(id: string) {
  const transaction = useLiveQuery(() => db.transactions.get(id), [id]);
  return { transaction, isLoading: transaction === undefined };
}

export function useCreateTransaction() {
  const createTransaction = async (
    data: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => {
    const id = uuidv4();
    const now = new Date();
    await db.transactions.add({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  };
  return { createTransaction };
}

export function useUpdateTransaction() {
  const updateTransaction = async (
    id: string,
    data: Partial<Omit<Transaction, "id" | "createdAt" | "updatedAt">>
  ) => {
    await db.transactions.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  };
  return { updateTransaction };
}

export function useDeleteTransaction() {
  const deleteTransaction = async (id: string) => {
    await db.transactions.delete(id);
  };
  return { deleteTransaction };
}
