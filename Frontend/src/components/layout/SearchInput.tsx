import { useState } from "react";
import { Search } from "lucide-react";

/**
 * Top-bar search affordance. In Phase 1 this is a styled, keyboard-focusable
 * input that does not yet query any data source; result wiring lands in a
 * later phase. It is intentionally not presented as live search.
 */
export function SearchInput() {
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(event) => event.preventDefault()}
      className="relative hidden sm:block"
    >
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
        aria-hidden
      />
      <label htmlFor="topbar-search" className="sr-only">
        Search
      </label>
      <input
        id="topbar-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search payments, tests, reports…"
        aria-label="Search payments, tests, reports"
        className="h-9 w-56 rounded-lg border border-line bg-ink-850 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-600 transition-colors hover:border-line-strong focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 lg:w-72"
      />
    </form>
  );
}
