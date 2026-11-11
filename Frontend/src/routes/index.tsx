import { Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import OverviewPage from "../pages/Overview";
import PaymentTestingPage from "../pages/PaymentTesting";
import ChaosLabPage from "../pages/ChaosLab";
import MonitoringPage from "../pages/Monitoring";
import SpendingPoliciesPage from "../pages/SpendingPolicies";
import ReportsPage from "../pages/Reports";
import SettingsPage from "../pages/Settings";
import NotFoundPage from "../pages/NotFound";

/**
 * Route table. {@link AppShell} is the layout route element, so every page
 * renders inside the sidebar + top bar shell. Paths are relative to the
 * layout root and mirror the absolute paths used in `navConfig`.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="testing" element={<PaymentTestingPage />} />
        <Route path="chaos-lab" element={<ChaosLabPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="policies" element={<SpendingPoliciesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
