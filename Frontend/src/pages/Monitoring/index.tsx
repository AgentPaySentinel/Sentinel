import { Activity } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/** Payment Monitoring — track payment events, statuses and settlement. */
/**
 * Payment Monitoring — track payment events, statuses and settlement.
 */
export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoring"
        title="Payment Monitoring"
        description="Track payment events, statuses and settlement across networks with search and filtering."
      />
      <PagePlaceholder
        icon={Activity}
        description="A transaction table with clear status indicators and a detail view for each payment."
        sections={[
          "Payment transaction table",
          "Transaction identifier",
          "Amount and currency",
          "Network",
          "Payment status: pending, successful, failed, delayed, duplicate detected",
          "Timestamp",
          "Settlement status",
          "Search and filtering",
          "Transaction detail view",
        ]}
      />
    </div>
  );
}
