"use client";

import { useState, useEffect, useRef } from "react";
import {
  exportData,
  importData,
  clearData,
  getStorageUsage,
} from "@/lib/data-management";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Download, Upload, Trash2, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function DataManagement() {
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ usage: 0, quota: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsage = async () => {
    const data = await getStorageUsage();
    setUsage(data);
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleExport = async () => {
    try {
      setLoading(true);
      const blob = await exportData();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hodlr-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Backup exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await importData(file);
      toast.success("Data imported successfully");
      fetchUsage();
      // Optional: reload page to refresh data in other components
      // window.location.reload();
    } catch (error) {
      toast.error("Failed to import data");
      console.error(error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClearData = async () => {
    try {
      setLoading(true);
      await clearData();
      fetchUsage();
      toast.success("All data cleared successfully");
    } catch (error) {
      toast.error("Failed to clear data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Convert bytes to MB
  const usageMB = (usage.usage / (1024 * 1024)).toFixed(2);
  const quotaMB = (usage.quota / (1024 * 1024)).toFixed(2);
  const usagePercent = usage.quota > 0 ? (usage.usage / usage.quota) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Manage your application data, create backups, or reset everything.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Usage</span>
            <span className="text-muted-foreground">
              {usageMB} MB / {quotaMB} MB
            </span>
          </div>
          <Progress value={usagePercent} className="h-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExport}
            disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export Backup
          </Button>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Import Backup
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Clear All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  transactions, assets, strategies, and settings from your local
                  database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
