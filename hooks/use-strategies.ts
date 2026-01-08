import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";

export function useStrategies() {
  const strategies = useLiveQuery(() => db.strategies.toArray());
  return { strategies, isLoading: !strategies };
}
