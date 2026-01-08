"use client";

import { usePathname } from "next/navigation";
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
  const isHome = pathname === "/";

  const pageTitle = pageTitles[pathname] || "Hodlr";

  // Hide MobileHeader on Asset Detail pages as they have their own header
  if (pathname.startsWith("/assets/") && pathname !== "/assets") {
    return null;
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        {isHome ? (
          // Home: Show logo
          <div className="flex items-center gap-2">
            <img
              src="/icons/icon-192x192.png"
              alt="Hodlr"
              className="size-8 rounded-lg"
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Hodlr</span>
              <span className="truncate text-xs">Portfolio Manager</span>
            </div>
          </div>
        ) : (
          // Other pages: page title
          <>
            <span className="font-semibold">{pageTitle}</span>
          </>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
