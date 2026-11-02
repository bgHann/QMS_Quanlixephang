import { useCallback, useEffect, useState } from 'react';
import type { Key, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Modal, Select, Spin, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { roleService } from '../../../../api/services/roleService';
import { accountService } from '../../../../api/services/accountService';
import PaginationBar from '../../../../components/common/PaginationBar';
import PermissionSummary from '../../../../components/settings/roles/PermissionSummary';
import { ACCOUNT_STATUS, ACCOUNT_STATUS_LABEL } from '../../../../constants/enums';
import type { AccountStatus } from '../../../../constants/enums';
import { ROUTES } from '../../../../constants/routes';
import type { Account } from '../../../../types/account';
import type { PermissionGroup, Role } from '../../../../types/role';
import styles from './RoleDetailPage.module.css';

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <b>{label}:</b> {children}
    </div>
  );
}

export default function RoleDetailPage() {
  const { roleId = '' } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role | null>(null);
  const [groups, setGroups] = useState<PermissionGroup[]>([]);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AccountStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  // Tải thông tin vai trò + danh sách nhóm quyền
  useEffect(() => {
    Promise.all([roleService.getById(roleId), roleService.getPermissionGroups()])
      .then(([r, g]) => {
        setRole(r);
        setGroups(g);
      })
      .catch((error) => {
        message.error(error instanceof Error ? error.message : 'Không tải được vai trò');
        navigate(ROUTES.ROLES, { replace: true });
      });
  }, [roleId, navigate]);

  // Chờ 400ms sau khi ngừng gõ mới tìm
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchText);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountService.getListByRole({
        roleId,
        page,
        pageSize,
        keyword,
        status: status === 'ALL' ? undefined : status,
      });
      setAccounts(res.items);
      setTotal(res.total);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  }, [roleId, page, pageSize, keyword, status]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const handleUpdateRole = () => {
    // TODO: mở màn cập nhật vai trò (ACC-22)
    message.info('Mở màn cập nhật vai trò');
  };

  const handleEditAccount = (account: Account) => {
    // TODO: mở màn sửa tài khoản
    message.info(`Sửa tài khoản: ${account.username}`);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ${selectedKeys.length} tài khoản đã chọn?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await accountService.remove(selectedKeys as string[]);
          message.success('Đã xóa tài khoản');
          setSelectedKeys([]);
          await fetchAccounts();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Xóa thất bại');
        }
      },
    });
  };

  const columns: TableColumnsType<Account> = [
    { title: 'Tên đăng nhập', dataIndex: 'username', ellipsis: true },
    { title: 'Họ tên', dataIndex: 'fullName', ellipsis: true },
    { title: 'Số điện thoại', dataIndex: 'phone', ellipsis: true },
    { title: 'Email', dataIndex: 'email', ellipsis: true },
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
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          aria-label={`Sửa ${record.username}`}
          icon={<EditOutlined />}
          className={styles.editButton}
          onClick={() => handleEditAccount(record)}
        />
      ),
    },
  ];

  if (!role) {
    return (
      <div className={styles.loadingWrap}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ===== Cột trái: thông tin vai trò ===== */}
      <div className={styles.leftColumn}>
        <div className={styles.leftContent}>
          <div className={styles.sectionTitle}>Thông tin vai trò</div>
          <InfoRow label="Tên vai trò">{role.roleName}</InfoRow>
          <InfoRow label="Mô tả">{role.description || '—'}</InfoRow>

          <div className={styles.permissionTitle}>Phân quyền chức năng:</div>
          <PermissionSummary groups={groups} permissions={role.permissions} />
        </div>

        <Button block icon={<EditOutlined />} className={styles.updateButton} onClick={handleUpdateRole}>
          Cập nhật
        </Button>
      </div>

      {/* ===== Cột phải: người dùng của vai trò ===== */}
      <div className={styles.rightColumn}>
        <div className={styles.sectionTitle}>Người dùng của vai trò</div>

        <div className={styles.filters}>
          <div>
            <div className={styles.fieldLabel}>Tìm kiếm</div>
            <Input
              prefix={<SearchOutlined className={styles.searchIcon} />}
              placeholder="Tìm kiếm"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
              className={styles.statusSelect}
              options={[
                { value: 'ALL', label: 'Tất cả' },
                { value: ACCOUNT_STATUS.ACTIVE, label: ACCOUNT_STATUS_LABEL.ACTIVE },
                { value: ACCOUNT_STATUS.SUSPENDED, label: ACCOUNT_STATUS_LABEL.SUSPENDED },
              ]}
            />
          </div>
        </div>

        <div className={styles.tableWrap}>
          <Table<Account>
            rowKey="accountId"
            size="small"
            tableLayout="fixed"
            loading={loading}
            columns={columns}
            dataSource={accounts}
            pagination={false}
            rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
          />
        </div>

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
      </div>

      {/* Nút xóa nổi bên phải */}
      <div className={styles.floatingDelete}>
        <Button
          type="text"
          aria-label="Xóa tài khoản đã chọn"
          icon={<DeleteOutlined className={styles.deleteIcon} />}
          disabled={selectedKeys.length === 0}
          onClick={handleDelete}
          className={styles.deleteButton}
        />
      </div>
    </div>
  );
}