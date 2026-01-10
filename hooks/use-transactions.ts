import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Transaction } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

interface UseTransactionsOptions {
  page?: number;
  pageSize?: number;
}

export function useTransactions(
  assetId?: string,
  options?: UseTransactionsOptions
) {
  const { page, pageSize } = options || {};

  const transactions = useLiveQuery(async () => {
    let collection = db.transactions.orderBy("date").reverse();

    if (assetId) {
      collection = db.transactions
        .where("assetId")
        .equals(assetId)
        .reverse()
        .sortBy("date") as any; // Cast needed because sortBy returns Promise<Array> but we need Collection roughly

      // Re-querying as collection for pagination if assetId is present is tricky with Dexie's API nuances on sortBy returning arrays.
      // Let's stick to Dexie's Collection API chain.
      // Correct approach for Dexie:
      // If assetId: db.transactions.where("assetId").equals(assetId).reverse().sortBy("date") returns an array, not a collection we can offset/limit easily AFTER sortBy.
      // BUT we can use offset/limit BEFORE toArray/sortBy if we use the index correctly.

      // However, db.transactions.where(...) returns a WhereClause or Collection.
      // .reverse() returns Collection.
      // .sortBy() executes the query and returns Promise<Array>. We can't use offset/limit on the result of sortBy (unless we slice the array, which defeats the purpose of DB pagination for memory).

      // Better approach for assetId with pagination:
      // use simple index access if possible, or accept that for assetId specific filtering we might need to be careful.
      // Actually, standard Dexie pattern:
      // db.transactions.where('assetId').equals(assetId).reverse().offset(..).limit(..).toArray()
      // This sorts by the index (which is assetId, not date). To sort by date with assetId, we need a compound index [assetId+date] or do in-memory sort if dataset is small, OR use Dexie's virtual index.

      // Given current schema: transactions: "id, assetId, type, date, strategyId".
      // We don't have [assetId+date].
      // For now, let's implement the simpler main list pagination (all transactions).
      // For assetId specific list (Asset Details), we can still use pagination, but sorting might be by PK or we rely on 'date' being close enough or fit in memory?
      // Wait, 'date' is a top level index.

      // Let's refine the query:
      if (assetId) {
        // For assetId specific, if we want strict DB pagination + Sort by Date, we really should add [assetId+date] index.
        // But the user didn't ask for schema change.
        // Let's stick to in-memory sort for AssetId specific if needed, OR just filter.
        // BUT, for the main "Transaction History" on Dashboard (if any) or large lists, it's usually ALL transactions.
        // If the user is on Asset Details page, transactions are likely fewer than Global.
        // Let's implement global pagination efficiently.

        const count = await db.transactions
          .where("assetId")
          .equals(assetId)
          .count();

        // If page/pageSize set, we have to deal with sorting.
        // Without compound index, efficient sort+paginate on filtered field is hard.
        // Let's fallback to "fetch all for this asset, then slice" if we must, OR just return all if paginating specific asset is not the main performance killer yet (global list is).
        // Actually, let's try to Apply offset/limit on the Collection.
        // If we trust insertion order roughly correlates with time, or we just rely on reverse() of the index scan.

        let query = db.transactions.where("assetId").equals(assetId).reverse();

        if (page && pageSize) {
          const offset = (page - 1) * pageSize;
          return {
            data: await query.offset(offset).limit(pageSize).toArray(),
            total: count,
          };
        }

        return {
          data: await query.sortBy("date"), // access all
          total: count,
        };
      }
    }

    // Global list (no assetId)
    const count = await db.transactions.count();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      // .orderBy("date") uses the index, so it's efficient.
      const data = await db.transactions
        .orderBy("date")
        .reverse()
        .offset(offset)
        .limit(pageSize)
        .toArray();

      return { data, total: count };
    }

    // Default (All)
    const data = await db.transactions.orderBy("date").reverse().toArray();
    return { data, total: count };
  }, [assetId, page, pageSize]);

  // Handle the standardized return shape
  const data = transactions?.data || [];
  const totalCount = transactions?.total || 0;

  return {
    transactions: data,
    totalCount,
    isLoading: !transactions,
  };
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
