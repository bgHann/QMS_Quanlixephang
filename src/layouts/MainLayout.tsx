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

import logo from "../assets/images/Logo.png";
import HeaderUser from "../components/common/HeaderUser";
import styles from "./MainLayout.module.css";

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: ROUTES.DASHBOARD,
    icon: <LayoutDashboard size={18} strokeWidth={1.8} />,
    label: "Dashboard",
  },
  {
    key: ROUTES.DEVICES,
    icon: <Monitor size={18} strokeWidth={1.8} />,
    label: "Thiết bị",
  },
  {
    key: ROUTES.SERVICES,
    icon: <MessagesSquare size={18} strokeWidth={1.8} />,
    label: "Dịch vụ",
  },
  {
    key: ROUTES.COUNTERS,
    icon: <Hospital size={18} strokeWidth={1.8} />,
    label: "Quầy dịch vụ",
  },
  {
    key: ROUTES.TICKETS,
    icon: <FileText size={18} strokeWidth={1.8} />,
    label: "Cấp số",
  },
  {
    key: ROUTES.RATINGS,
    icon: <MessageSquare size={18} strokeWidth={1.8} />,
    label: "Đánh giá",
  },
  {
    key: "settings",
    icon: <Settings size={18} strokeWidth={1.8} />,
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

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const page = findPageTitle(pathname);

  // Xác định trang cấp số
  const isTicketPage =
    pathname === ROUTES.TICKETS || pathname.startsWith(`${ROUTES.TICKETS}/`);

  // Xác định trang cài đặt quy tắc
  const isTicketRulesPage =
    pathname === ROUTES.TICKET_RULES ||
    pathname.startsWith(`${ROUTES.TICKET_RULES}/`);

  // Tiêu đề phía dưới
  const headerTitle = isTicketRulesPage
    ? "Quy tắc cấp số"
    : isTicketPage
      ? "Danh sách cấp số"
      : page?.title;

  // Tiêu đề phía trên
  const headerParent = isTicketPage ? "Cấp số" : page?.parent;

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
              <div className={styles.pageParent}>{headerParent}</div>
            )}
            <div className={styles.pageTitle}>{headerTitle}</div>
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
