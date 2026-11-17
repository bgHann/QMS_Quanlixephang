import { Avatar, Dropdown, Select, Space, message } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styles from './HeaderUser.module.css';

export default function HeaderUser() {
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            localStorage.removeItem('accessToken');
        } catch {
            // Trình duyệt chặn localStorage thì bỏ qua
        }
        message.success('Đã đăng xuất');
        navigate(ROUTES.LOGIN, { replace: true });
    };

    const handleUserMenu: MenuProps['onClick'] = ({ key }) => {
        if (key === 'profile') navigate(ROUTES.PROFILE);
        if (key === 'logout') handleLogout();
    };

    return (
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
    );
}