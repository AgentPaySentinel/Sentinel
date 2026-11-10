/**
 * Minimal classnames helper.
 *
 * Filters falsy values and joins the rest with a space. Intentionally
 * dependency-free (no clsx / tailwind-merge) to keep the bundle lean; if
 * conditional class merging becomes complex later, swap in tailwind-merge.
 *
 * @example cn("px-2", isActive && "bg-brand-600", undefined) -> "px-2 bg-brand-600"
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
