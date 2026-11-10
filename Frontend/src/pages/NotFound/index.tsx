import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";

/**
 * Fallback for unknown routes. Rendered inside the layout so navigation
 * remains available.
 */
export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Page not found"
        description="The page you were looking for doesn't exist or may have moved."
      />
      <section className="surface p-10">
        <div className="flex flex-col items-center text-center">
          <p className="text-3xl font-semibold tracking-tight text-slate-200">
            404
          </p>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            If you reached this page from a link inside AgentPay Sentinel, it
            may not be implemented yet.
          </p>
          <Link to="/" className="mt-6">
            <Button
              variant="primary"
              leadingIcon={<ArrowLeft className="h-4 w-4" aria-hidden />}
            >
              Back to Overview
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
