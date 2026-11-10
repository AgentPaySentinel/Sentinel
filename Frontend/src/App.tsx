import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppRoutes } from "./routes";
import { queryClient } from "./services/queries/queryClient";
import { EnvironmentProvider } from "./context/EnvironmentContext";

/**
 * Root application component.
 *
 * Provider order (outermost -> innermost):
 *   1. QueryClientProvider — data layer (TanStack Query)
 *   2. EnvironmentProvider — selected dev/testnet/production indicator state
 *   3. BrowserRouter        — routing
 *
 * The route tree (sidebar + top bar shell + pages) lives in `./routes`.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EnvironmentProvider>
    </QueryClientProvider>
  );
}

export default App;
