import { FlaskConical } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/** Payment Testing — configure and execute simulated payment workflows. */
/**
 * Payment Testing — configure and execute simulated payment workflows.
 */
export default function PaymentTestingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Testing"
        title="Payment Testing"
        description="Configure and execute simulated x402 payment workflows with clear success, failure and warning states."
      />
      <PagePlaceholder
        icon={FlaskConical}
        description="A form to configure a payment simulation and a history of test executions with result states."
        sections={[
          "Test name",
          "Payment amount and currency",
          "Network selection",
          "Recipient or resource identifier",
          "Authorization status",
          "Test scenario selection",
          "Run test execution",
          "Test execution history",
        ]}
      />
    </div>
  );
}
