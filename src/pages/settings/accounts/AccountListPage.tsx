import { useCallback, useEffect, useState } from 'react';
import type { Key } from 'react';
import { Button, Input, Select, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import {
    DeleteOutlined, EditOutlined, KeyOutlined, SearchOutlined, UserAddOutlined,
} from '@ant-design/icons';
import { accountService } from '../../../api/services/accountService';
import { roleService } from '../../../api/services/roleService';
import PaginationBar from '../../../components/common/PaginationBar';
import AccountFormModal from '../../../components/accounts/AccountFormModal';
import ChangePasswordModal from '../../../components/accounts/ChangePasswordModal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { ACCOUNT_STATUS, ACCOUNT_STATUS_LABEL } from '../../../constants/enums';
import type { AccountStatus } from '../../../constants/enums';
import type { Account } from '../../../types/account';
import type { Role } from '../../../types/role';
import styles from './AccountListPage.module.css';

export default function AccountListPage() {
    const [items, setItems] = useState<Account[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState<AccountStatus | 'ALL'>('ALL');
    const [roleId, setRoleId] = useState<string>('ALL');
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    const [formOpen, setFormOpen] = useState(false);
    const [passwordAccount, setPasswordAccount] = useState<Account | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Tải danh sách vai trò cho ô lọc "Vai trò"
    useEffect(() => {
        roleService
            .getList({ page: 1, pageSize: 100 })
            .then((res) => setRoles(res.items))
            .catch((error) => {
                message.error(error instanceof Error ? error.message : 'Không tải được danh sách vai trò');
            });
    }, []);

    // Chờ 400ms sau khi ngừng gõ mới tìm
    useEffect(() => {
        const timer = setTimeout(() => {
            setKeyword(searchText);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText]);

    // Lấy danh sách tài khoản
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await accountService.getList({
                page,
                pageSize,
                keyword,
                status: status === 'ALL' ? undefined : status,
                roleId: roleId === 'ALL' ? undefined : roleId,
            });
            setItems(res.items);
            setTotal(res.total);
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Không thể tải danh sách tài khoản');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, keyword, status, roleId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const handleAdd = () => setFormOpen(true);

    const handleEdit = (account: Account) => {
        // TODO: mở popup/màn sửa tài khoản (ACC-11)
        message.info(`Sửa tài khoản: ${account.username}`);
    };

    const handleChangePassword = (account: Account) => setPasswordAccount(account);

    // Bấm nút xóa thì mở popup xác nhận
    const handleDelete = () => {
        if (selectedKeys.length === 0) {
            message.warning('Vui lòng chọn tài khoản cần xóa');
            return;
        }
        setDeleteOpen(true);
    };

    // Bấm "Xác nhận" trong popup thì mới xóa thật
    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await accountService.remove(selectedKeys as string[]);
            message.success('Đã xóa tài khoản');
            setSelectedKeys([]);
            setDeleteOpen(false);
            await fetchData();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    // Cấu hình cột
    const columns: TableColumnsType<Account> = [
        { title: 'Tên đăng nhập', dataIndex: 'username', ellipsis: true },
        { title: 'Họ tên', dataIndex: 'fullName', ellipsis: true },
        { title: 'Số điện thoại', dataIndex: 'phone', ellipsis: true },
        { title: 'Email', dataIndex: 'email', ellipsis: true },
        { title: 'Vai trò', dataIndex: 'roleName', ellipsis: true },
        {
            title: 'Trạng thái hoạt động',
            dataIndex: 'status',
            render: (value: AccountStatus) => (
                <span className={value === ACCOUNT_STATUS.ACTIVE ? styles.statusActive : styles.statusSuspended}>
                    ● {ACCOUNT_STATUS_LABEL[value]}
                </span>
            ),
        },
        {
            title: 'Hành động',
            align: 'right',
            width: 110,
            render: (_, record) => (
                <div className={styles.actionCell}>
                    <Button
                        type="text"
                        aria-label={`Sửa ${record.username}`}
                        icon={<EditOutlined />}
                        className={styles.actionButton}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="text"
                        aria-label={`Đổi mật khẩu ${record.username}`}
                        icon={<KeyOutlined />}
                        className={styles.actionButton}
                        onClick={() => handleChangePassword(record)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className={styles.page}>
            {/* Bộ lọc */}
            <div className={styles.filters}>
                <div>
                    <div className={styles.fieldLabel}>Tìm kiếm</div>
                    <Input
                        prefix={<SearchOutlined className={styles.searchIcon} />}
                        placeholder="Tìm kiếm"
                        allowClear
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div>
                    <div className={styles.fieldLabel}>Trạng thái hoạt động</div>
                    <Select<AccountStatus | 'ALL'>
                        value={status}
                        onChange={(value) => {
                            setStatus(value);
                            setPage(1);
                        }}
                        className={styles.select}
                        options={[
                            { value: 'ALL', label: 'Tất cả' },
                            { value: ACCOUNT_STATUS.ACTIVE, label: ACCOUNT_STATUS_LABEL.ACTIVE },
                            { value: ACCOUNT_STATUS.SUSPENDED, label: ACCOUNT_STATUS_LABEL.SUSPENDED },
                        ]}
                    />
                </div>

                <div>
                    <div className={styles.fieldLabel}>Vai trò</div>
                    <Select<string>
                        value={roleId}
                        onChange={(value) => {
                            setRoleId(value);
                            setPage(1);
                        }}
                        className={styles.select}
                        options={[
                            { value: 'ALL', label: 'Tất cả' },
                            ...roles.map((r) => ({ value: r.roleId, label: r.roleName })),
                        ]}
                    />
                </div>
            </div>

            {/* Bảng */}
            <div className={styles.tableWrap}>
                <Table<Account>
                    tableLayout="fixed"
                    rowKey="accountId"
                    size="small"
                    loading={loading}
                    columns={columns}
                    dataSource={items}
                    pagination={false}
                    rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
                />
            </div>

            {/* Phân trang */}
            <PaginationBar
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />

            {/* Thanh chức năng bên phải */}
            <div className={styles.sideActions}>
                <Button
                    type="text"
                    aria-label="Thêm tài khoản"
                    icon={<UserAddOutlined className={styles.addIcon} />}
                    onClick={handleAdd}
                    className={styles.addButton}
                />
                <Button
                    type="text"
                    aria-label="Xóa tài khoản đã chọn"
                    icon={<DeleteOutlined className={styles.deleteIcon} />}
                    disabled={selectedKeys.length === 0}
                    onClick={handleDelete}
                    className={styles.deleteButton}
                />
            </div>

            {/* Popups */}
            <AccountFormModal
                open={formOpen}
                roles={roles}
                onClose={() => setFormOpen(false)}
                onSuccess={fetchData}
            />
            <ChangePasswordModal
                open={passwordAccount !== null}
                account={passwordAccount}
                onClose={() => setPasswordAccount(null)}
            />
            <ConfirmDialog
                open={deleteOpen}
                content={`Bạn có chắc chắn xóa ${selectedKeys.length} tài khoản đã chọn? Hành động này không thể hoàn tác.`}
                loading={deleting}
                onOk={handleConfirmDelete}
                onCancel={() => setDeleteOpen(false)}
            />
        </div>
    );
}