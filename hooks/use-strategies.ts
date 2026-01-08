import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Strategy } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export function useStrategies() {
  const strategies = useLiveQuery(() => db.strategies.toArray());
  return { strategies, isLoading: !strategies };
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
