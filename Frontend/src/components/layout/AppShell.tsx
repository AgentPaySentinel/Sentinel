import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const COLLAPSE_KEY = "sentinel.sidebar.collapsed";

/**
 * Root application layout, rendered as a layout route element.
 *
 * Composes the sidebar + top bar around the active route's <Outlet/>.
 * Owns two independent pieces of UI state:
 *   - desktop sidebar collapse (persisted to localStorage)
 *   - mobile drawer open/close (auto-closes on navigation)
 */
export function AppShell() {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(COLLAPSE_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Persist desktop collapse preference.
  useEffect(() => {
    window.localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Never show the drawer while on desktop.
  useEffect(() => {
    if (isDesktop) setMobileOpen(false);
  }, [isDesktop]);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-950">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

