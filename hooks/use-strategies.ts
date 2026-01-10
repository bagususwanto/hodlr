import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Strategy } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

interface UseStrategiesOptions {
  page?: number;
  pageSize?: number;
}

export function useStrategies(options?: UseStrategiesOptions) {
  const { page, pageSize } = options || {};

  const strategies = useLiveQuery(async () => {
    const count = await db.strategies.count();

    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const data = await db.strategies.offset(offset).limit(pageSize).toArray();
      return { data, total: count };
    }

    // Default (All)
    const data = await db.strategies.toArray();
    return { data, total: count };
  }, [page, pageSize]);

  const data = strategies?.data || [];
  const totalCount = strategies?.total || 0;

  return { strategies: data, totalCount, isLoading: !strategies };
}

export function useStrategy(id: string) {
  const strategy = useLiveQuery(() => db.strategies.get(id), [id]);
  return { strategy, isLoading: strategy === undefined };
}

export function useCreateStrategy() {
  const createStrategy = async (
    data: Omit<Strategy, "id" | "createdAt" | "updatedAt">
  ) => {
    const id = uuidv4();
    const now = new Date();
    await db.strategies.add({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  };
  return { createStrategy };
}

export function useUpdateStrategy() {
  const updateStrategy = async (
    id: string,
    data: Partial<Omit<Strategy, "id" | "createdAt" | "updatedAt">>
  ) => {
    await db.strategies.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  };
  return { updateStrategy };
}

export function useDeleteStrategy() {
  const deleteStrategy = async (id: string) => {
    await db.strategies.delete(id);
  };
  return { deleteStrategy };
}
