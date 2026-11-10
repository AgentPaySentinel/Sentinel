import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Optional eyebrow label above the title (e.g. section context). */
  eyebrow?: string;
  /** Right-aligned action slot (buttons, filters). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Consistent page header used by every dashboard page so spacing and
 * typography stay uniform across the app.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
