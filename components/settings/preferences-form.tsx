"use client";

import { usePreferences } from "@/hooks/use-preferences";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { InstallPWA } from "@/components/pwa/install-prompt";

export function PreferencesForm() {
  const { currency, setCurrency, dateFormat, setDateFormat } = usePreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance & Preferences</CardTitle>
        <CardDescription>
          Customize how Hodlr looks and behaves.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Theme</Label>
            <p className="text-sm text-muted-foreground">
              Select your preferred theme (Light/Dark/System).
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <Label>Currency</Label>
          <Select
            value={currency}
            onValueChange={(val) => setCurrency(val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="IDR">IDR (Rp)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="JPY">JPY (¥)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[0.8rem] text-muted-foreground">
            This will be used as the default currency for all values.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/MM/yyyy">
                dd/MM/yyyy (31/12/2024)
              </SelectItem>
              <SelectItem value="MM/dd/yyyy">
                MM/dd/yyyy (12/31/2024)
              </SelectItem>
              <SelectItem value="yyyy-MM-dd">
                yyyy-MM-dd (2024-12-31)
              </SelectItem>
              <SelectItem value="d MMM yyyy">
                d MMM yyyy (31 Dec 2024)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <InstallPWA />
        </div>
      </CardContent>
    </Card>
  );
}
