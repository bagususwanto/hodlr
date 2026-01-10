"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Check if there are any assets
  const assetCount = useLiveQuery(() => db.assets.count());

  useEffect(() => {
    // Wait for the query to resolve (assetCount will be undefined initially)
    if (assetCount === undefined) return;

    const isOnboarding = pathname?.startsWith("/onboarding");
    const hasData = assetCount > 0;

    if (!hasData && !isOnboarding) {
      // If no data and not on onboarding, redirect to welcome
      router.replace("/onboarding/welcome");
    } else if (hasData && isOnboarding) {
      // If has data and on onboarding, redirect to dashboard
      // redirect to dashboard
      router.replace("/");
    }

    setIsChecking(false);
  }, [assetCount, pathname, router]);

  // Show nothing or a loading spinner while checking
  // We can also just render children and let the effect redirect,
  // but that might cause a flash of content.
  // For better UX, we might want to show a loading screen if we are redirecting.
  // However, useLiveQuery is fast.
  if (isChecking && assetCount === undefined) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
