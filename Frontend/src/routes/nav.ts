import {
  Activity,
  FileBarChart,
  FlaskConical,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Zap,
} from "lucide-react";
import type { NavItem } from "../types";

/**
 * Single source of truth for sidebar navigation + router titles.
 *
 * `path` is the absolute route (BrowserRouter matches against the full
 * location). The Overview entry uses "/" and must be rendered with the
 * `end` flag on its NavLink so it isn't always-active.
 */
export const navConfig: NavItem[] = [
  {
    path: "/",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Workflow health, recent activity and alerts at a glance.",
  },
  {
    path: "/testing",
    label: "Payment Testing",
    icon: FlaskConical,
    description: "Configure and execute simulated x402 payment workflows.",
  },
  {
    path: "/chaos-lab",
    label: "Chaos Lab",
    icon: Zap,
    description: "Inject controlled failures into payment workflows.",
  },
  {
    path: "/monitoring",
    label: "Payment Monitoring",
    icon: Activity,
    description: "Track payment events, statuses and settlement.",
  },
  {
    path: "/policies",
    label: "Spending Policies",
    icon: ShieldCheck,
    description: "Inspect spending limits and authorization rules.",
  },
  {
    path: "/reports",
    label: "Reports",
    icon: FileBarChart,
    description: "Test summaries, failure distribution and performance.",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    description: "General, API and network configuration.",
  },
];

/** Resolve the nav entry matching a pathname (for the top-bar page title). */
export function findNavByPath(pathname: string): NavItem | undefined {
  if (pathname === "/") return navConfig[0];
  return navConfig.find(
    (item) => item.path !== "/" && pathname.startsWith(item.path),
  );
}
