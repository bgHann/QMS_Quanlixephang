
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

import logo from "../assets/images/Logo.png";
import HeaderUser from "../components/common/HeaderUser";
import styles from "./MainLayout.module.css";

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps["items"] = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: ROUTES.DEVICES,
    icon: <DesktopOutlined />,
    label: "Thiết bị",
  },
  {
    key: ROUTES.SERVICES,
    icon: <MessageOutlined />,
    label: "Dịch vụ",
  },
  {
    key: ROUTES.COUNTERS,
    icon: <BankOutlined />,
    label: "Quầy dịch vụ",
  },
  {
    key: ROUTES.TICKETS,
    icon: <FileTextOutlined />,
    label: "Cấp số",
  },
  {
    key: ROUTES.RATINGS,
    icon: <CommentOutlined />,
    label: "Đánh giá",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
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
    pathname === ROUTES.TICKETS ||
    pathname.startsWith(`${ROUTES.TICKETS}/`);

  // Xác định trang cài đặt quy tắc cấp số
  const isTicketRulesPage =
    pathname === ROUTES.TICKET_RULES ||
    pathname.startsWith(`${ROUTES.TICKET_RULES}/`);

  // Xác định trang đánh giá
  const isRatingsPage =
    pathname === ROUTES.RATINGS ||
    pathname.startsWith(`${ROUTES.RATINGS}/`);

  // Xác định tab đang hiển thị trong trang đánh giá
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
    : pathname.startsWith(ROUTES.ACCOUNTS)
      ? ROUTES.ACCOUNTS
      : pathname.startsWith(ROUTES.LOGO)
        ? ROUTES.LOGO
        : pathname.startsWith(ROUTES.TICKETS)
          ? ROUTES.TICKETS
          : pathname.startsWith(ROUTES.RATINGS)
            ? ROUTES.RATINGS
            : pathname.startsWith(ROUTES.DEVICES)
              ? ROUTES.DEVICES
              : pathname.startsWith(ROUTES.SERVICES)
                ? ROUTES.SERVICES
                : pathname.startsWith(ROUTES.COUNTERS)
                  ? ROUTES.COUNTERS
                  : pathname;

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
          selectedKeys={[selectedMenuKey]}
          defaultOpenKeys={
            pathname.startsWith("/settings")
              ? ["settings"]
              : []
          }
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
              <div className={styles.pageParent}>
                {headerParent}
              </div>
            )}

            <div className={styles.pageTitle}>
              {headerTitle}
            </div>
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
