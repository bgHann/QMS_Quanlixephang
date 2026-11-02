import { useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, Select, Space, message } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BankOutlined, BellOutlined, CommentOutlined, DashboardOutlined, DesktopOutlined,
  DownOutlined, FileTextOutlined, LeftOutlined, MessageOutlined, RightOutlined, SettingOutlined,
} from '@ant-design/icons';
import { findPageTitle, ROUTES } from '../constants/routes';
import logo from '../assets/images/Logo.png';
import styles from './MainLayout.module.css';

const { Sider, Header, Content } = Layout;

const menuItems: MenuProps['items'] = [
  { key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: ROUTES.DEVICES, icon: <DesktopOutlined />, label: 'Thiết bị' },
  { key: ROUTES.SERVICES, icon: <MessageOutlined />, label: 'Dịch vụ' },
  { key: ROUTES.COUNTERS, icon: <BankOutlined />, label: 'Quầy dịch vụ' },
  { key: ROUTES.TICKETS, icon: <FileTextOutlined />, label: 'Cấp số' },
  { key: ROUTES.RATINGS, icon: <CommentOutlined />, label: 'Đánh giá' },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Cài đặt hệ thống',
    children: [
      { key: ROUTES.ROLES, label: 'Quản lý vai trò' },
      { key: ROUTES.ACCOUNTS, label: 'Quản lý tài khoản' },
    ],
  },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = findPageTitle(pathname);

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
    } catch {
      // trình duyệt chặn localStorage thì bỏ qua
    }
    message.success('Đã đăng xuất');
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleUserMenu: MenuProps['onClick'] = ({ key }) => {
    if (key === 'profile') navigate(ROUTES.PROFILE);
    if (key === 'logout') handleLogout();
  };

  return (
    <Layout className={styles.layout}>
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
          selectedKeys={[pathname.startsWith(ROUTES.ROLES) ? ROUTES.ROLES : pathname]}
          defaultOpenKeys={pathname.startsWith('/settings') ? ['settings'] : []}
          onClick={({ key }) => navigate(key)}
          className={styles.menu}
        />
      </Sider>

      <Layout className={styles.inner}>
        <Header className={styles.header}>
          <div>
            <div className={styles.pageParent}>{page?.parent}</div>
            <div className={styles.pageTitle}>{page?.title}</div>
          </div>

          <Space size={20}>
            <Select
              defaultValue="vi"
              variant="borderless"
              options={[
                { value: 'vi', label: '🇻🇳 VIE' },
                { value: 'en', label: '🇬🇧 ENG' },
              ]}
            />
            <BellOutlined className={styles.bellIcon} />
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                items: [
                  { key: 'profile', label: 'Xem Hồ Sơ' },
                  { key: 'logout', label: 'Đăng Xuất', danger: true },
                ],
                onClick: handleUserMenu,
              }}
            >
              <Space className={styles.userCard}>
                <Avatar>H</Avatar>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>Nguyễn Lê Bảo Hoàng Hà</div>
                  <div className={styles.userRole}>Admin</div>
                </div>
                <DownOutlined className={styles.userArrow} />
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}