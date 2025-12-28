import { ApiKeysSection } from "./api-keys-section";
import { DangerZoneSection } from "./danger-zone-section";
import { DataExportSection } from "./data-export-section";
import { EmailSection } from "./email-section";
import { PasswordSection } from "./password-section";

export const SettingsView = () => {
  return (
    <div className="space-y-5">
      <EmailSection />
      <PasswordSection />
      <ApiKeysSection />
      <DataExportSection />
      <DangerZoneSection />
    </div>
  );
};
