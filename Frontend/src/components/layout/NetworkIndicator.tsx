import { useState } from "react";
import { Check, ChevronDown, Server } from "lucide-react";
import { useEnvironment } from "../../context/EnvironmentContext";
import { cn } from "../../utils/cn";
import type { Environment } from "../../types";

/**
 * Network indicator + switcher for the top bar. Selecting an environment is
 * a frontend preference that changes the displayed badge only — it does not
 * route requests or perform any on-chain action. Enforcement stays backend-side.
 */
export function NetworkIndicator() {
  const { environment, info, setEnvironment, environments } = useEnvironment();
  const [open, setOpen] = useState(false);

  const order: Environment[] = ["development", "testnet", "production"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Network environment: ${info.label}`}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-ink-850 px-2.5 text-xs font-medium transition-colors hover:border-line-strong",
          info.badgeClass,
        )}
      >
        <Server className="h-3.5 w-3.5 opacity-80" aria-hidden />
        <span className={cn("h-2 w-2 rounded-full", info.dotClass)} />
        <span className="hidden sm:inline">{info.label}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </button>

      {open ? (
        <>
          {/* Click-away backdrop */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="listbox"
            aria-label="Select network environment"
            className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-line-strong bg-ink-900 p-1.5 shadow-2xl shadow-black/40"
          >
            <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Environment
            </div>
            {order.map((id) => {
              const env = environments[id];
              const selected = id === environment;
              return (
                <button
                  key={id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setEnvironment(id);
                    setOpen(false);
                  }}
                  className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-ink-800"
                >
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      env.dotClass,
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">
                        {env.label}
                      </span>
                      {selected ? (
                        <Check
                          className="h-4 w-4 text-brand-400"
                          aria-hidden
                        />
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {env.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
