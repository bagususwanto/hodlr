import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Asset } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export function useAssets() {
  const assets = useLiveQuery(() => db.assets.toArray());
  return { assets, isLoading: !assets };
}

export function useAsset(id: string) {
  const asset = useLiveQuery(() => db.assets.get(id), [id]);
  return { asset, isLoading: asset === undefined };
}

export function useCreateAsset() {
  const createAsset = async (
    data: Omit<Asset, "id" | "createdAt" | "updatedAt">
  ) => {
    const id = uuidv4();
    const now = new Date();
    await db.assets.add({
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  };
  return { createAsset };
}

export function useUpdateAsset() {
  const updateAsset = async (
    id: string,
    data: Partial<Omit<Asset, "id" | "createdAt" | "updatedAt">>
  ) => {
    await db.assets.update(id, {
      ...data,
      updatedAt: new Date(),
    });
  };
  return { updateAsset };
}

export function useDeleteAsset() {
  const deleteAsset = async (id: string) => {
    await db.assets.delete(id);
  };
  return { deleteAsset };
}
