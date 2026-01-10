"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeftRightIcon, WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function QuickActions() {
  // In a real app, these might open dialogs.
  // For now, we'll navigate or log, since lifting state from here to root layout/page might be complex without a global UI store.
  // However, since we are in `app/(dashboard)/page.tsx`, we can control dialogs there if we want, OR we can navigate to pages.
  // Reusing the Add Asset Dialog requires rendering it.

  // For "Add Transaction", it's usually tied to an asset.
  // Let's assume these buttons navigate to the main lists where the user can then add items.
  // "Add Asset" -> /assets (open dialog logic can be there or here)
  // Actually, let's keep it simple: Just navigation for now or trigger props if used in parent.
  // But this component doesn't take props yet.
  // I'll make it take `onAction` props for flexibility.

  const router = useRouter();

  return (
    <Card className="md:col-span-4 lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/assets")} // Or trigger an "Add Asset" dialog
        >
          <WalletIcon className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/assets")} // Ideally open transaction dialog.
        >
          <ArrowLeftRightIcon className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/strategies")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Strategy
        </Button>
      </CardContent>
    </Card>
  );
}
