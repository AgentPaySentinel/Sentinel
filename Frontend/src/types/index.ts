import type { LucideIcon } from "lucide-react";

/**
 * Selected execution environment shown in the top-bar network indicator.
 * Switching it is a frontend preference only; it does not change backend
 * routing or claim any on-chain effect. Enforcement stays on the backend.
 */
export type Environment = "development" | "testnet" | "production";

/** Visual metadata for each environment badge. */
export interface EnvironmentInfo {
  id: Environment;
  label: string;
  description: string;
  /** Tailwind dot/badge classes for the indicator. */
  dotClass: string;
  badgeClass: string;
}

/** Single sidebar / router entry. Shared source of truth in routes/navConfig. */
export interface NavItem {
  /** Route path relative to the layout (e.g. "chaos-lab"). */
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/** Reusable badge tones mapped to semantic meaning across the app. */
export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";
