import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Form, Input, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { roleService } from '../../../../api/services/roleService';
import { ROUTES } from '../../../../constants/routes';
import type { PermissionGroup, RoleForm } from '../../../../types/role';
import PermissionSelector from '../../../../components/settings/roles/PermissionSelector';
import styles from './RoleFormPage.module.css';

// Đặt dấu * đỏ SAU nhãn như Figma
const renderRequiredMark = (label: ReactNode, { required }: { required: boolean }) => (
  <>
    {label}
    {required && <span className={styles.asterisk}> *</span>}
  </>
);

export default function RoleFormPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<RoleForm>();
  const [groups, setGroups] = useState<PermissionGroup[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    roleService.getPermissionGroups().then(setGroups);
  }, []);

  const onFinish = async (values: RoleForm) => {
    setSubmitting(true);
    try {
      await roleService.create({
        roleName: values.roleName.trim(),
        description: values.description ?? '',
        permissions: values.permissions ?? [],
      });
      message.success('Thêm vai trò thành công');
      navigate(ROUTES.ROLES);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Thêm vai trò thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ permissions: [] }}
      requiredMark={renderRequiredMark}
      className={styles.form}
    >
      <div className={styles.columns}>
        {/* Cột trái */}
        <div className={styles.leftColumn}>
          <div className={styles.sectionTitle}>1. Thông tin vai trò</div>

          <Form.Item
            label="Tên vai trò"
            name="roleName"
            rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên vai trò' }]}
          >
            <Input placeholder="Nhập tên vai trò" />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea placeholder="Nhập mô tả" rows={8} className={styles.textArea} />
          </Form.Item>

          <div className={styles.note}>
            <span className={styles.asterisk}>* </span>Là trường thông tin bắt buộc
          </div>
        </div>

        {/* Cột phải */}
        <div className={styles.rightColumn}>
          <div className={styles.sectionTitle}>2. Phân quyền chức năng</div>
          <div className={styles.permissionList}>
            {groups.length > 0 ? (
              <Form.Item name="permissions" noStyle>
                <PermissionSelector groups={groups} />
              </Form.Item>
            ) : (
              <Spin />
            )}
          </div>
        </div>
      </div>

      {/* Nút cố định ở đáy */}
      <div className={styles.footer}>
        <Button className={styles.cancelButton} onClick={() => navigate(ROUTES.ROLES)}>
          Hủy bỏ
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting} className={styles.submitButton}>
          Xác nhận
        </Button>
      </div>
    </Form>
  );
}