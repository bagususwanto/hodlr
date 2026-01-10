"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { importData } from "@/lib/data-management";
import { toast } from "sonner"; // Assuming sonner is used for toasts
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await importData(file);
      toast.success("Data imported successfully");
      // Redirect to dashboard, the route guard or standard flow will handle it
      // but since we are client side, a router.push("/") should work
      // or window.location.reload() to ensure fresh state if needed,
      // but router.push("/") is cleaner spa navigation.
      // Force reload might be safer for Dexie + hooks to sync up.
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to import data");
      console.error(error);
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Hodlr
        </h1>
        <p className="text-muted-foreground md:text-xl">
          Track Your Investment Journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-2xl">
        <Card className="relative overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start tracking your portfolio from scratch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full group">
              <Link href="/onboarding/add-asset">
                Create Portfolio
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Import your data with backup file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Import Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
