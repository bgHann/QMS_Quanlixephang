import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgot/ForgotPassword";

import MainLayout from "./layouts/MainLayout";

import RoleListPage from "./pages/settings/roles/RoleListPage";
import RoleDetailPage from "./pages/settings/roles/RoleDetailPage";
import RoleFormPage from "./pages/settings/roles/RoleFormPage";
import AccountListPage from "./pages/settings/accounts/AccountListPage";
import LogoPage from "./pages/settings/logo/LogoPage";

// Module Cấp số
import TicketListPage from "./pages/tickets/TicketListPage";
import TicketRulePage from "./pages/tickets/TicketRulePage";

// Module Thiết bị
import DeviceListPage from "./pages/devices/DeviceListPage";
import DeviceDetailPage from "./pages/devices/DeviceDetailPage";

// Dashboard
import DashboardPage from "./pages/dashboard/DashboardPage";

import { ROUTES } from "./constants/routes";

function ProtectedRoutes() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

            {/* Cài đặt hệ thống */}
            <Route path={ROUTES.ROLES} element={<RoleListPage />} />
            <Route path={ROUTES.ROLE_CREATE} element={<RoleFormPage />} />
            <Route path={ROUTES.ROLE_DETAIL} element={<RoleDetailPage />} />
            <Route path={ROUTES.ACCOUNTS} element={<AccountListPage />} />
            <Route path={ROUTES.LOGO} element={<LogoPage />} />

            {/* Thiết bị */}
            <Route path={ROUTES.DEVICES} element={<DeviceListPage />} />
            <Route path={ROUTES.DEVICE_DETAIL} element={<DeviceDetailPage />} />

            {/* Cấp số */}
            <Route path={ROUTES.TICKETS} element={<TicketListPage />} />
            <Route path={ROUTES.TICKET_RULES} element={<TicketRulePage />} />

            {/* Luôn để cuối cùng */}
            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;