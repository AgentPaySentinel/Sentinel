import { NavLink } from "react-router-dom";
import type { NavItem as NavItemType } from "../../types";
import { cn } from "../../utils/cn";

export interface NavItemProps {
  item: NavItemType;
  /** Desktop icon-rail mode: hide the label, center the icon. */
  collapsed?: boolean;
}

/**
 * Sidebar navigation entry. Active state is driven by react-router NavLink.
 * A 2px brand accent bar marks the active item; labels are hidden in the
 * collapsed rail and surfaced via the native `title` tooltip for access.
 */
export function NavItem({ item, collapsed = false }: NavItemProps) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center rounded-lg text-sm font-medium transition-colors",
          collapsed ? "h-10 w-10 justify-center" : "h-10 gap-3 px-3",
          isActive
            ? "bg-brand-600/10 text-brand-300"
            : "text-slate-400 hover:bg-ink-800 hover:text-slate-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active accent bar (hidden in collapsed rail to stay minimal) */}
          {isActive && !collapsed ? (
            <span
              aria-hidden
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-brand-500"
            />
          ) : null}
          <Icon
            className={cn(
              "h-[18px] w-[18px] shrink-0",
              isActive ? "text-brand-400" : "text-slate-500 group-hover:text-slate-300",
            )}
            strokeWidth={2}
            aria-hidden
          />
          {!collapsed ? (
            <span className="truncate">{item.label}</span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}
