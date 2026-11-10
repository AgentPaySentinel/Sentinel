import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

/**
 * Top-bar notifications. Phase 1 shows an honest "all caught up" empty state
 * rather than fabricated alerts. Real alert data is wired in a later phase
 * from the backend monitoring stream.
 */
export function NotificationMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-ink-800 hover:text-slate-200"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden />
        {/* Unread dot — present only when there are unread alerts (none yet). */}
        <span className="sr-only">No unread notifications</span>
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
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-line-strong bg-ink-900 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-sm font-semibold text-slate-200">
                Notifications
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
                onClick={() => setOpen(false)}
              >
                <CheckCheck className="h-3.5 w-3.5" aria-hidden />
                Mark all read
              </button>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <Bell
                className="h-7 w-7 text-slate-700"
                aria-hidden
                strokeWidth={1.5}
              />
              <p className="text-sm text-slate-400">You're all caught up</p>
              <p className="text-xs text-slate-600">
                Payment alerts and policy violations will appear here.
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
