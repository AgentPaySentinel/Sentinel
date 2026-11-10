import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings as SettingsIcon, UserCircle } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Top-bar user menu. Profile and Settings navigate to real routes; "Sign out"
 * is a no-op placeholder because no auth/session backend exists yet. It is
 * labelled as such rather than pretending to sign the user out.
 */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-ink-850 py-1 pl-1 pr-2 transition-colors hover:border-line-strong"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-xs font-semibold text-white">
          DV
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-medium leading-tight text-slate-200">
            Dev Operator
          </span>
          <span className="block text-[11px] leading-tight text-slate-500">
            operator@agentpay
          </span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            aria-label="Account"
            className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-line-strong bg-ink-900 p-1.5 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3 px-2.5 py-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-sm font-semibold text-white">
                DV
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  Dev Operator
                </p>
                <p className="truncate text-xs text-slate-500">
                  operator@agentpay
                </p>
              </div>
            </div>
            <div className="my-1.5 h-px bg-line" />
            <MenuItem
              icon={UserCircle}
              label="Profile"
              onSelect={() => {
                setOpen(false);
                navigate("/settings");
              }}
            />
            <MenuItem
              icon={SettingsIcon}
              label="Settings"
              onSelect={() => {
                setOpen(false);
                navigate("/settings");
              }}
            />
            <div className="my-1.5 h-px bg-line" />
            <MenuItem
              icon={LogOut}
              label="Sign out"
              tone="danger"
              onSelect={() => setOpen(false)}
            />
            <p className="px-2.5 pt-1.5 text-[11px] leading-snug text-slate-600">
              Sign out is inactive until authentication is connected.
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  onSelect: () => void;
  tone?: "default" | "danger";
}

function MenuItem({ icon: Icon, label, onSelect, tone = "default" }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-ink-800",
        tone === "danger" ? "text-danger-400" : "text-slate-300",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
