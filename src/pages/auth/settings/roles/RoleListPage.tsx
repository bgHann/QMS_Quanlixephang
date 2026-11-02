import { useCallback, useEffect, useState } from 'react';
import type { Key } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal, Table, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import { roleService } from '../../../../api/services/roleService';
import PaginationBar from '../../../../components/common/PaginationBar';
import { buildRoleDetailPath, ROUTES } from '../../../../constants/routes';
import type { Role } from '../../../../types/role';
import styles from './RoleListPage.module.css';

export default function RoleListPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  const handleAdd = () => navigate(ROUTES.ROLE_CREATE);
  const handleEdit = (role: Role) => navigate(buildRoleDetailPath(role.roleId));

  // Chờ 400ms sau khi ngừng gõ mới tìm
  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchText);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Lấy danh sách vai trò
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await roleService.getList({ page, pageSize, keyword });
      setItems(res.items);
      setTotal(res.total);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, keyword]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Xóa vai trò đã chọn
  const handleDelete = () => {
    if (selectedKeys.length === 0) {
      message.warning('Vui lòng chọn vai trò cần xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ${selectedKeys.length} vai trò đã chọn?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },

      onOk: async () => {
        try {
          await roleService.remove(selectedKeys as string[]);
          message.success('Đã xóa vai trò');
          setSelectedKeys([]);
          await fetchData();
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Xóa thất bại');
        }
      },
    });
  };

  // Cấu hình cột
  const columns: TableColumnsType<Role> = [
    { title: 'Tên vai trò', dataIndex: 'roleName', width: '25%' },
    { title: 'Số người dùng', dataIndex: 'userCount', width: '25%' },
    { title: 'Mô tả', dataIndex: 'description', width: '40%', ellipsis: true },
    {
      title: 'Hành động',
      align: 'right',
      width: '10%',
      render: (_, record) => (
        <Button
          type="text"
          aria-label={`Sửa ${record.roleName}`}
          icon={<EditOutlined />}
          className={styles.editButton}
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      {/* Khu vực tìm kiếm */}
      <div className={styles.searchArea}>
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

      {/* Bảng */}
      <div className={styles.tableWrap}>
        <Table<Role>
          tableLayout="fixed"
          rowKey="roleId"
          loading={loading}
          columns={columns}
          dataSource={items}
          pagination={false}
          size="small"
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        />
      </div>

      {/* Phân trang cố định phía dưới */}
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
          aria-label="Thêm vai trò"
          icon={<UserAddOutlined className={styles.addIcon} />}
          onClick={handleAdd}
          className={styles.addButton}
        />
        <Button
          type="text"
          aria-label="Xóa vai trò đã chọn"
          icon={<DeleteOutlined className={styles.deleteIcon} />}
          disabled={selectedKeys.length === 0}
          onClick={handleDelete}
          className={styles.deleteButton}
        />
      </div>
    </div>
  );
}