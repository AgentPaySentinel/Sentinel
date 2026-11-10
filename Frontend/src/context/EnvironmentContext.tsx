import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Environment, EnvironmentInfo } from "../types";

/**
 * EnvironmentContext exposes the currently selected execution environment
 * (Development / Testnet / Production) shown in the top-bar network indicator.
 *
 * This is a frontend display preference only. It does not perform any backend
 * routing, key switching, or on-chain action. Policy and payment enforcement
 * always belong to the backend and supported on-chain components.
 */

const ENVIRONMENTS: Record<Environment, EnvironmentInfo> = {
  development: {
    id: "development",
    label: "Development",
    description: "Local sandbox — simulated payments, no real funds at risk.",
    dotClass: "bg-success-500",
    badgeClass:
      "text-success-400 bg-success-500/10 ring-1 ring-success-500/30",
  },
  testnet: {
    id: "testnet",
    label: "Testnet",
    description: "Public test network — non-value assets, shared infrastructure.",
    dotClass: "bg-warning-500",
    badgeClass: "text-warning-400 bg-warning-500/10 ring-1 ring-warning-500/30",
  },
  production: {
    id: "production",
    label: "Production",
    description: "Live network — real value payments. Proceed with caution.",
    dotClass: "bg-danger-500",
    badgeClass: "text-danger-400 bg-danger-500/10 ring-1 ring-danger-500/30",
  },
};

interface EnvironmentContextValue {
  environment: Environment;
  info: EnvironmentInfo;
  setEnvironment: (env: Environment) => void;
  /** Full map for selectors / indicators. */
  environments: Record<Environment, EnvironmentInfo>;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export function EnvironmentProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [environment, setEnvironment] = useState<Environment>("development");

  const value = useMemo<EnvironmentContextValue>(
    () => ({
      environment,
      info: ENVIRONMENTS[environment],
      setEnvironment,
      environments: ENVIRONMENTS,
    }),
    [environment],
  );

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment(): EnvironmentContextValue {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider");
  }
  return ctx;
}
