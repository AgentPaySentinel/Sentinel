import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { findNavByPath } from "../../routes/nav";
import { SearchInput } from "./SearchInput";
import { NetworkIndicator } from "./NetworkIndicator";
import { NotificationMenu } from "./NotificationMenu";
import { UserMenu } from "./UserMenu";

export interface TopbarProps {
  onOpenMobile: () => void;
}

/**
 * Sticky top navigation bar: mobile menu button, route-derived page title,
 * search affordance, notifications, environment indicator and account menu.
 */
export function Topbar({ onOpenMobile }: TopbarProps) {
  const location = useLocation();
  const active = findNavByPath(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-ink-950/80 px-4 backdrop-blur-md lg:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onOpenMobile}
        aria-label="Open navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-ink-800 hover:text-white lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {/* Page title */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-slate-100 sm:text-base">
          {active?.label ?? "AgentPay Sentinel"}
        </h1>
        {active?.description ? (
          <p className="hidden truncate text-xs text-slate-500 md:block">
            {active.description}
          </p>
        ) : null}
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        <SearchInput />
        <NetworkIndicator />
        <div className="h-6 w-px bg-line" />
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  );
}
