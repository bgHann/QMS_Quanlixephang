import { matchPath } from 'react-router-dom';
export const ROUTES = {
  DASHBOARD: '/dashboard',
  DEVICES: '/devices',
  SERVICES: '/services',
  COUNTERS: '/counters',
  TICKETS: '/tickets',
  RATINGS: '/ratings',
  ROLE_CREATE: '/settings/roles/create',
  ACCOUNTS: '/settings/accounts',
  LOGIN: '/login',
  PROFILE: '/profile',
  ROLES: '/settings/roles',
  ROLE_DETAIL: '/settings/roles/:roleId',
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
    parent: '',
    title: 'Dashboard',
  },
  {
    path: ROUTES.ROLES,
    parent: 'Cài đặt hệ thống',
    title: 'Quản lý vai trò',
  },
  {
    path: ROUTES.ROLE_CREATE,
    parent: 'Cài đặt hệ thống / Quản lý vai trò',
    title: 'Thêm vai trò',
  },
  {
    path: ROUTES.ROLE_DETAIL,
    parent: 'Cài đặt hệ thống / Quản lý vai trò',
    title: 'Chi tiết vai trò',
  },
  {
    path: ROUTES.ACCOUNTS,
    parent: 'Cài đặt hệ thống',
    title: 'Quản lý tài khoản',
  },
  {
    path: ROUTES.PROFILE,
    parent: '',
    title: 'Hồ sơ cá nhân',
  },
];

// Tạo đường dẫn chi tiết theo ID vai trò
export const buildRoleDetailPath = (roleId: string) =>
  `/settings/roles/${encodeURIComponent(roleId)}`;

// Tìm tiêu đề phù hợp với URL hiện tại
export const findPageTitle = (pathname: string) =>
  PAGE_TITLES.find((p) =>
    matchPath({ path: p.path, end: true }, pathname),
  );