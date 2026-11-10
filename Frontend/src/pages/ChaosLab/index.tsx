import { Zap } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/**
 * Chaos Lab — controlled failure injection for payment workflows.
 *
 * The UI must communicate these are controlled test scenarios, not real
 * payment failures. That framing is reflected in the page description.
 */
export default function ChaosLabPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Failure simulation"
        title="Chaos Lab"
        description="Inject controlled failures into payment workflows in a safe environment. These are test scenarios, not real payment failures."
      />
      <PagePlaceholder
        icon={Zap}
        description="Select a failure scenario, configure its parameters, launch a simulation and compare expected vs actual behaviour with recommendations."
        sections={[
          "Facilitator outage",
          "Network timeout",
          "Duplicate payment submission",
          "Expired authorization",
          "Spending limit exceeded",
          "Successful settlement with a lost HTTP response",
          "Interrupted payment response",
          "Scenario description, expected behaviour, actual result and recommendations",
        ]}
      />
    </div>
  );
}
