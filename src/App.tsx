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
import RoleListPage from "./pages/auth/settings/roles/RoleListPage";
import RoleDetailPage from "./pages/auth/settings/roles/RoleDetailPage";
import RoleFormPage from "./pages/auth/settings/roles/RoleFormPage";
import { ROUTES } from "./constants/routes";
import DeviceListPage from "./pages/devices/DeviceListPage";

function ProtectedRoutes() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}

function DashboardPage() {
  return <div>Chào mừng bạn đến với hệ thống QMS</div>;
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
            <Route path={ROUTES.ROLES} element={<RoleListPage />} />
            <Route path={ROUTES.ROLE_CREATE} element={<RoleFormPage />} />
            <Route path={ROUTES.ROLE_DETAIL} element={<RoleDetailPage />} />
            <Route path={ROUTES.DEVICES} element={<DeviceListPage />} />
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
