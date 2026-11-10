import { QueryClient } from "@tanstack/react-query";

/**
 * Shared TanStack Query client. Conservative defaults appropriate for a
 * developer dashboard: limited retries, short stale window, no background
 * refetch on window focus (avoids noisy requests while wiring real data in
 * Phase 4). Per-query overrides remain possible.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
