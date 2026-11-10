import { useNavigate } from "react-router-dom";
import { FlaskConical, LayoutDashboard, Zap } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { PagePlaceholder } from "../../components/ui/PagePlaceholder";
import { Button } from "../../components/ui/Button";

/**
 * Overview — overall health of payment workflows.
 * Phase 1 renders the shell only; dashboard widgets and sample data land later.
 */
export default function OverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="Overall health of your x402 payment workflows: attempts, success rate, duplicates and recent alerts."
        actions={
          <>
            <Button
              variant="primary"
              size="sm"
              leadingIcon={<FlaskConical className="h-4 w-4" aria-hidden />}
              onClick={() => navigate("/testing")}
            >
              Run a test
            </Button>
            <Button
              variant="outline"
              size="sm"
              leadingIcon={<Zap className="h-4 w-4" aria-hidden />}
              onClick={() => navigate("/chaos-lab")}
            >
              Open Chaos Lab
            </Button>
          </>
        }
      />
      <PagePlaceholder
        icon={LayoutDashboard}
        description="A consolidated view of payment attempts, settlement success, duplicates and recent alerts — with clearly labelled sample data."
        sections={[
          "Total payment attempts",
          "Successful payments",
          "Failed payments",
          "Duplicate payment attempts",
          "Settlement success rate",
          "Recent payment activity",
          "Payment success / failure chart",
          "Recent alerts",
        ]}
      />
    </div>
  );
}
