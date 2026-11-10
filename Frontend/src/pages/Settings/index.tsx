import { Settings } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/**
 * Settings — general, API and network configuration.
 *
 * Private keys, secrets and signing credentials are never exposed in the
 * frontend; only non-sensitive configuration is managed here.
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="General, API and network configuration. Private keys and signing credentials are never exposed in the frontend."
      />
      <PagePlaceholder
        icon={Settings}
        description="Manage non-sensitive configuration across general, API, network and account preferences."
        sections={[
          "General settings",
          "API configuration",
          "Network configuration",
          "Environment selection",
          "Account preferences",
        ]}
        phase="Phase 3"
      />
    </div>
  );
}
