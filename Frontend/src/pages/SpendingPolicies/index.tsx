import { ShieldCheck } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/**
 * Spending Policies — inspect spending limits and authorization rules.
 *
 * Policy enforcement belongs to the backend and on-chain components; the
 * dashboard only configures and displays policy state.
 */
export default function SpendingPoliciesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Policies"
        title="Spending Policies"
        description="Inspect spending limits and authorization rules. Policy enforcement is handled by the backend and on-chain components — the dashboard only configures and displays policy state."
      />
      <PagePlaceholder
        icon={ShieldCheck}
        description="Create, edit and inspect spending policies with clear status indicators."
        sections={[
          "Maximum payment amount",
          "Daily spending limit",
          "Allowed currencies",
          "Allowed networks",
          "Authorization requirements",
          "Restricted payment conditions",
          "Policy creation, editing and status indicators",
        ]}
      />
    </div>
  );
}
