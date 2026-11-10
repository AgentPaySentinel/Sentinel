import type { ReactNode } from "react";
import type { BadgeTone } from "../../types";
import { cn } from "../../utils/cn";

const TONE_CLASSES: Record<BadgeTone, { pill: string; dot: string }> = {
  neutral: {
    pill: "text-slate-300 bg-ink-800 ring-1 ring-line-strong",
    dot: "bg-slate-400",
  },
  brand: {
    pill: "text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/30",
    dot: "bg-brand-400",
  },
  success: {
    pill: "text-success-400 bg-success-500/10 ring-1 ring-success-500/30",
    dot: "bg-success-500",
  },
  warning: {
    pill: "text-warning-400 bg-warning-500/10 ring-1 ring-warning-500/30",
    dot: "bg-warning-500",
  },
  danger: {
    pill: "text-danger-400 bg-danger-500/10 ring-1 ring-danger-500/30",
    dot: "bg-danger-500",
  },
  info: {
    pill: "text-sky-300 bg-sky-500/10 ring-1 ring-sky-500/30",
    dot: "bg-sky-400",
  },
};

export interface StatusBadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Show a leading status dot. */
  dot?: boolean;
  className?: string;
}

/**
 * Reusable status pill. Tones map to semantic meaning, not arbitrary colours:
 * success = ok, warning = delayed/attention, danger = failed/critical,
 * brand = primary/active, neutral = idle, info = contextual.
 */
export function StatusBadge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: StatusBadgeProps) {
  const classes = TONE_CLASSES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        classes.pill,
        className,
      )}
    >
      {dot ? (
        <span className={cn("h-1.5 w-1.5 rounded-full", classes.dot)} />
      ) : null}
      {children}
    </span>
  );
}
