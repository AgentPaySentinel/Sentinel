import { Link } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { navConfig } from "../../routes/nav";
import { cn } from "../../utils/cn";

export interface SidebarProps {
  /** Desktop icon-rail mode. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Mobile drawer open state. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

/**
 * Application sidebar. Renders twice:
 *   1. A static desktop aside (hidden below lg) that collapses to an icon rail.
 *   2. A mobile drawer (hidden at lg+) with a backdrop, expanded with labels.
 * Both share {@link SidebarContent}. The collapse toggle lives in the footer
 * so the header stays a clean logo + wordmark.
 */
export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "relative z-30 hidden shrink-0 flex-col border-r border-line bg-ink-900 lg:flex",
          "transition-[width] duration-200 ease-out",
          collapsed ? "w-[68px]" : "w-60",
        )}
      >
        <SidebarContent
          variant="desktop"
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
        />
      </aside>

      {/* Mobile drawer + backdrop */}
      {mobileOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-line bg-ink-900 shadow-2xl shadow-black/50"
            role="dialog"
            aria-label="Primary navigation"
          >
            <SidebarContent
              variant="mobile"
              collapsed={false}
              onCloseMobile={onCloseMobile}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}

interface SidebarContentProps {
  variant: "desktop" | "mobile";
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onCloseMobile?: () => void;
}

function SidebarContent({
  variant,
  collapsed,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-line",
          collapsed && variant === "desktop" ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 text-slate-100"
          aria-label="AgentPay Sentinel home"
        >
          <Logo className="h-7 w-7 shrink-0" />
          {!(collapsed && variant === "desktop") ? (
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                AgentPay Sentinel
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Test · Monitor · Secure
              </span>
            </span>
          ) : null}
        </Link>

        {variant === "mobile" ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-ink-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        ) : null}
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2.5 py-3">
        <ul className="flex flex-col gap-1">
          {navConfig.map((item) => (
            <li key={item.path}>
              <NavItem
                item={item}
                collapsed={collapsed && variant === "desktop"}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: collapse toggle (desktop) + version */}
      <div className="border-t border-line p-3">
        {variant === "desktop" ? (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-ink-800 hover:text-slate-200",
              collapsed ? "w-10 justify-center" : "w-full",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden />
            )}
            {!collapsed ? <span>Collapse</span> : null}
          </button>
        ) : null}
        {!collapsed || variant === "mobile" ? (
          <p className="mt-2 px-2 text-[11px] leading-relaxed text-slate-600">
            v0.1.0 · Open-source developer infrastructure
          </p>
        ) : null}
      </div>
    </div>
  );
}
