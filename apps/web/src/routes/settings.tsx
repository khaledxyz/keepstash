import { SettingsView } from "@/features/settings/settings-view";

export default function SettingsPage() {
  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage account</p>
      </div>

      <SettingsView />
    </div>
  );
}
