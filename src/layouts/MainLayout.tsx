<<<<<<< HEAD
import { useState } from "react";
import { Button, Layout, Menu } from "antd";

import type { MenuProps } from "antd";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import {
  LayoutDashboard,
  Monitor,
  MessagesSquare,
  MessageSquare,
  Hospital,
  FileText,
  Settings,
} from "lucide-react";

import { findPageTitle, ROUTES } from "../constants/routes";

=======

import { useState } from "react";
import { Button, Layout, Menu } from "antd";
import type { MenuProps } from "antd";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  BankOutlined,
  CommentOutlined,
  DashboardOutlined,
  DesktopOutlined,
  FileTextOutlined,
  LeftOutlined,
  MessageOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  findPageTitle,
  ROUTES,
} from "../constants/routes";

>>>>>>> feature/review
import logo from "../assets/images/Logo.png";
import HeaderUser from "../components/common/HeaderUser";
import styles from "./MainLayout.module.css";

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: ROUTES.DASHBOARD,
<<<<<<< HEAD
    icon: <LayoutDashboard size={18} strokeWidth={1.8} />,
=======
    icon: <DashboardOutlined />,
>>>>>>> feature/review
    label: "Dashboard",
  },
  {
    key: ROUTES.DEVICES,
<<<<<<< HEAD
    icon: <Monitor size={18} strokeWidth={1.8} />,
=======
    icon: <DesktopOutlined />,
>>>>>>> feature/review
    label: "Thiết bị",
  },
  {
    key: ROUTES.SERVICES,
<<<<<<< HEAD
    icon: <MessagesSquare size={18} strokeWidth={1.8} />,
=======
    icon: <MessageOutlined />,
>>>>>>> feature/review
    label: "Dịch vụ",
  },
  {
    key: ROUTES.COUNTERS,
<<<<<<< HEAD
    icon: <Hospital size={18} strokeWidth={1.8} />,
=======
    icon: <BankOutlined />,
>>>>>>> feature/review
    label: "Quầy dịch vụ",
  },
  {
    key: ROUTES.TICKETS,
<<<<<<< HEAD
    icon: <FileText size={18} strokeWidth={1.8} />,
=======
    icon: <FileTextOutlined />,
>>>>>>> feature/review
    label: "Cấp số",
  },
  {
    key: ROUTES.RATINGS,
<<<<<<< HEAD
    icon: <MessageSquare size={18} strokeWidth={1.8} />,
=======
    icon: <CommentOutlined />,
>>>>>>> feature/review
    label: "Đánh giá",
  },
  {
    key: "settings",
<<<<<<< HEAD
    icon: <Settings size={18} strokeWidth={1.8} />,
=======
    icon: <SettingOutlined />,
>>>>>>> feature/review
    label: "Cài đặt hệ thống",
    children: [
      { key: ROUTES.ROLES, label: "Quản lý vai trò" },
      { key: ROUTES.ACCOUNTS, label: "Quản lý tài khoản" },
      { key: ROUTES.LOGO, label: "Logo" },
    ],
  },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const page = findPageTitle(pathname);

  // Xác định trang cấp số
  const isTicketPage =
<<<<<<< HEAD
    pathname === ROUTES.TICKETS || pathname.startsWith(`${ROUTES.TICKETS}/`);
=======
    pathname === ROUTES.TICKETS ||
    pathname.startsWith(`${ROUTES.TICKETS}/`);
>>>>>>> feature/review

  // Xác định trang cài đặt quy tắc
  const isTicketRulesPage =
    pathname === ROUTES.TICKET_RULES ||
    pathname.startsWith(`${ROUTES.TICKET_RULES}/`);

<<<<<<< HEAD
  // Tiêu đề phía dưới
  const headerTitle = isTicketRulesPage
    ? "Quy tắc cấp số"
    : isTicketPage
      ? "Danh sách cấp số"
      : page?.title;

  // Tiêu đề phía trên
  const headerParent = isTicketPage ? "Cấp số" : page?.parent;
=======
  // Xác định trang đánh giá
  const isRatingsPage =
    pathname === ROUTES.RATINGS ||
    pathname.startsWith(`${ROUTES.RATINGS}/`);

  // Xác định tab đang chọn trong trang đánh giá
  const searchParams = new URLSearchParams(search);
  const isReviewTemplate = searchParams.get("tab") === "template";

  // Tiêu đề dòng dưới Header
  const headerTitle = isRatingsPage
    ? isReviewTemplate
      ? "Cài đặt mẫu đánh giá"
      : "Danh sách đánh giá"
    : isTicketRulesPage
      ? "Quy tắc cấp số"
      : isTicketPage
        ? "Danh sách cấp số"
        : page?.title;

  // Tiêu đề dòng trên Header
  const headerParent = isRatingsPage
    ? "Đánh giá"
    : isTicketPage
      ? "Cấp số"
      : page?.parent;

  // Xác định menu đang được chọn
  const selectedMenuKey = pathname.startsWith(ROUTES.ROLES)
    ? ROUTES.ROLES
    : pathname.startsWith(ROUTES.TICKETS)
      ? ROUTES.TICKETS
      : pathname.startsWith(ROUTES.RATINGS)
        ? ROUTES.RATINGS
        : pathname.startsWith(ROUTES.DEVICES)
          ? ROUTES.DEVICES
          : pathname;
>>>>>>> feature/review

  return (
    <Layout className={styles.layout}>
      {/* Sidebar */}
      <Sider
        width={250}
        collapsedWidth={72}
        collapsed={collapsed}
        trigger={null}
        theme="light"
        className={styles.sider}
      >
        <div className={styles.logoWrap}>
          <img
            src={logo}
            alt="QMS Logo"
            className={collapsed ? styles.logoCollapsed : styles.logo}
          />
        </div>

        <Button
          shape="circle"
          size="small"
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className={styles.toggleButton}
        />

        <Menu
          mode="inline"
          items={menuItems}
<<<<<<< HEAD
          selectedKeys={[
            pathname.startsWith(ROUTES.ROLES)
              ? ROUTES.ROLES
              : pathname.startsWith(ROUTES.TICKETS)
                ? ROUTES.TICKETS
                : pathname.startsWith(ROUTES.DEVICES)
                  ? ROUTES.DEVICES
                  : pathname,
          ]}
          defaultOpenKeys={pathname.startsWith("/settings") ? ["settings"] : []}
=======
          selectedKeys={[selectedMenuKey]}
          defaultOpenKeys={
            pathname.startsWith("/settings")
              ? ["settings"]
              : []
          }
>>>>>>> feature/review
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
        />
      </Sider>

      {/* Main content */}
      <Layout className={styles.inner}>
        {/* Header */}
        <Header className={styles.header}>
          <div className={styles.headerTitleWrap}>
            {headerParent && (
<<<<<<< HEAD
              <div className={styles.pageParent}>{headerParent}</div>
            )}
            <div className={styles.pageTitle}>{headerTitle}</div>
=======
              <div className={styles.pageParent}>
                {headerParent}
              </div>
            )}

            <div className={styles.pageTitle}>
              {headerTitle}
            </div>
>>>>>>> feature/review
          </div>

          <HeaderUser />
        </Header>

        {/* Page content */}
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
