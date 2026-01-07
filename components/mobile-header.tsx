"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/assets": "Assets",
  "/journal": "Journal",
  "/strategies": "Strategies",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const pageTitle = pageTitles[pathname] || "Hodlr";

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        {isHome ? (
          // Home: Show logo
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
              <span className="font-bold">H</span>
            </div>
            <span className="font-semibold">Hodlr</span>
          </div>
        ) : (
          // Other pages: Show back button + page title
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => router.back()}>
              <ArrowLeft className="size-5" />
            </Button>
            <span className="font-semibold">{pageTitle}</span>
          </>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
