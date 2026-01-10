import { DataManagement } from "@/components/settings/data-management";
import { PreferencesForm } from "@/components/settings/preferences-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-8">
        <PreferencesForm />
        <DataManagement />
      </div>
    </div>
  );
}
