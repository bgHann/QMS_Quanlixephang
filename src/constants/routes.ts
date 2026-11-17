import { matchPath } from "react-router-dom";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  DEVICES: "/devices",
  DEVICE_DETAIL: "/devices/:deviceId",
  SERVICES: "/services",
  SERVICE_CREATE: "/services/create",
  SERVICE_DETAIL: "/services/:serviceId",
  SERVICE_EDIT: "/services/:serviceId/edit",
  COUNTERS: "/counters",
  TICKETS: "/tickets",
  TICKET_RULES: "/tickets/rules",
  RATINGS: "/ratings",
  ROLE_CREATE: "/settings/roles/create",
  ACCOUNTS: "/settings/accounts",
  LOGIN: "/login",
  PROFILE: "/profile",
  ROLES: "/settings/roles",
  ROLE_DETAIL: "/settings/roles/:roleId",
  LOGO: "/settings/logo",
  COUNTER_WORK: "/counters/:counterId/work",
} as const;

type PageTitle = {
  path: string;
  parent: string;
  title: string;
};

// Tiêu đề hiển thị ở Header
export const PAGE_TITLES: PageTitle[] = [
  {
    path: ROUTES.DASHBOARD,
    parent: "",
    title: "Dashboard",
  },
  {
    path: ROUTES.ROLES,
    parent: "Cài đặt hệ thống",
    title: "Quản lý vai trò",
  },
  {
    path: ROUTES.LOGO,
    parent: "Cài đặt hệ thống",
    title: "Thiết lập giao diện",
  },
  {
    path: ROUTES.ROLE_CREATE,
    parent: "Cài đặt hệ thống / Quản lý vai trò",
    title: "Thêm vai trò",
  },
  {
    path: ROUTES.ROLE_DETAIL,
    parent: "Cài đặt hệ thống / Quản lý vai trò",
    title: "Chi tiết vai trò",
  },
  {
    path: ROUTES.ACCOUNTS,
    parent: "Cài đặt hệ thống",
    title: "Quản lý tài khoản",
  },
  {
    path: ROUTES.DEVICES,
    parent: "Thiết bị",
    title: "Danh sách thiết bị", // chỉnh theo Figma của bạn nhóm
  },
  {
    path: ROUTES.DEVICE_DETAIL,
    parent: "Thiết bị / Danh sách thiết bị",
    title: "Chi tiết thiết bị", // chỉnh theo Figma của bạn nhóm
  },
  {
    path: ROUTES.TICKETS,
    parent: "Cấp số",
    title: "Danh sách cấp số",
  },
  {
    path: ROUTES.TICKET_RULES,
    parent: "Cấp số",
    title: "Quy tắc cấp số", // chỉnh theo Figma của nhóm
  },
  {
    path: ROUTES.PROFILE,
    parent: "",
    title: "Hồ sơ cá nhân",
  },
  {
    path: ROUTES.DEVICES,
    parent: "Cài đặt hệ thống",
    title: "Danh sách thiết bị",
  },
  {
    path: ROUTES.DEVICE_DETAIL,
    parent: "Cài đặt hệ thống / Danh sách thiết bị",
    title: "Chi tiết",
  },
  {
    path: ROUTES.SERVICES,
    parent: "Dịch vụ",
    title: "Danh sách dịch vụ",
  },
  {
    path: ROUTES.SERVICE_CREATE,
    parent: "Dịch vụ / Danh sách dịch vụ",
    title: "Thêm dịch vụ",
  },
  {
    path: ROUTES.SERVICE_DETAIL,
    parent: "Dịch vụ / Danh sách dịch vụ",
    title: "Chi tiết",
  },
  {
    path: ROUTES.SERVICE_EDIT,
    parent: "Dịch vụ / Danh sách dịch vụ",
    title: "Cập nhật dịch vụ",
  },
  {
    path: ROUTES.COUNTERS,
    parent: "Quầy dịch vụ",
    title: "Chọn quầy dịch vụ",
  },
];

// Tạo đường dẫn chi tiết theo ID vai trò
export const buildRoleDetailPath = (roleId: string) =>
  `/settings/roles/${encodeURIComponent(roleId)}`;

export const buildServiceDetailPath = (serviceId: string) =>
  `/services/${encodeURIComponent(serviceId)}`;

// Tìm tiêu đề phù hợp với URL hiện tại
export const findPageTitle = (pathname: string) =>
  PAGE_TITLES.find((p) => matchPath({ path: p.path, end: true }, pathname));

export const buildServiceEditPath = (serviceId: string) =>
  `/services/${encodeURIComponent(serviceId)}/edit`;
export const buildCounterWorkPath = (counterId: string) =>
  `/counters/${encodeURIComponent(counterId)}/work`;