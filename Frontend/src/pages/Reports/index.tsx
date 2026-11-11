import { FileBarChart } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";

/** Reports — test summaries, failure distribution and performance. */
export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Reports"
        description="Summarise test outcomes, failure distribution and settlement performance with date filters and detail views."
      />
      <PagePlaceholder
        icon={FileBarChart}
        description="Structured reports across test history, with date filters and drill-down detail views."
        sections={[
          "Payment test summaries",
          "Failure distribution",
          "Duplicate attempt reports",
          "Settlement performance",
          "Policy violations",
          "Historical test results",
          "Date filters and report detail view",
        ]}
      />
    </div>
  );
}
