import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "danger" | "outline" | "ghost" | "subtle";
type Size = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Optional leading icon. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon. */
  trailingIcon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 disabled:bg-brand-700/50",
  danger:
    "bg-danger-600 text-white hover:bg-danger-500 active:bg-danger-700 disabled:bg-danger-700/50",
  outline:
    "border border-line-strong bg-transparent text-slate-200 hover:bg-ink-800 hover:text-white",
  ghost:
    "bg-transparent text-slate-300 hover:bg-ink-800 hover:text-white",
  subtle:
    "bg-ink-800 text-slate-200 hover:bg-ink-750 hover:text-white border border-line",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
};

/**
 * Reusable button. Semantic variants only:
 *   - primary  → blue, for primary actions
 *   - danger   → red, for destructive / critical actions
 *   - outline  → bordered, secondary
 *   - ghost    → borderless, low-emphasis
 *   - subtle   → filled neutral, secondary
 */
export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-950",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
    </button>
  );
}
