import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query. SSR-safe (treats absent window as false).
 *
 * @param query CSS media query string, e.g. "(min-width: 1024px)"
 * @returns whether the query currently matches.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Sync in case the query changed between init and effect.
    setMatches(mql.matches);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
