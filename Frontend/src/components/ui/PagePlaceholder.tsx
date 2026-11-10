import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export interface PagePlaceholderProps {
  /** Page-specific icon shown in a brand-tinted tile. */
  icon: LucideIcon;
  /** One-line summary of what the page will provide. */
  description: string;
  /** Intended sections / features for this page. */
  sections: string[];
  /** Which milestone will deliver the page content. */
  phase?: string;
  className?: string;
}

/**
 * Honest scaffold marker for pages whose content is implemented in a later
 * phase. Shows what the page *will* contain rather than faking live data.
 */
export function PagePlaceholder({
  icon: Icon,
  description,
  sections,
  phase = "Phase 2–3",
  className,
}: PagePlaceholderProps) {
  return (
    <section className={cn("surface p-8", className)}>
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600/10 text-brand-400 ring-1 ring-brand-500/20">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-4 text-base font-semibold text-slate-200">
          Page content coming soon
        </h3>
        <p className="mt-1.5 text-sm text-slate-400">{description}</p>

        <ul className="mt-6 w-full space-y-2 text-left">
          {sections.map((section) => (
            <li
              key={section}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-ink-850 px-3 py-2 text-sm text-slate-300"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
              />
              {section}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-slate-600">
          {phase} · This shell is wired and navigable; live data and interactions
          arrive in a later milestone.
        </p>
      </div>
    </section>
  );
}
