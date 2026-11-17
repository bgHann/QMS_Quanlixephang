import { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { accountService } from '../../api/services/accountService';
import { counterService } from '../../api/services/counterService';
import { ACCOUNT_STATUS, ACCOUNT_STATUS_LABEL } from '../../constants/enums';
import { VALIDATION } from '../../constants/validation';
import type { AccountForm } from '../../types/account';
import type { Counter } from '../../types/counter';
import type { Role } from '../../types/role';
import styles from './AccountFormModal.module.css';

// Mã quyền "Xử lý quầy" (chờ BA chốt danh sách quyền đầy đủ)
const COUNTER_OPERATE = 'COUNTER_OPERATE';

interface AccountFormModalProps {
    open: boolean;
    roles: Role[];
    onClose: () => void;
    onSuccess: () => void; // gọi lại để tải lại danh sách
}

export default function AccountFormModal({ open, roles, onClose, onSuccess }: AccountFormModalProps) {
    const [form] = Form.useForm<AccountForm>();
    const [counters, setCounters] = useState<Counter[]>([]);
    const [roleId, setRoleId] = useState<string>();
    const [submitting, setSubmitting] = useState(false);

    // Vai trò có quyền "Xử lý quầy" thì mới được (và bắt buộc phải) chọn quầy
    const needsCounter = roles.find((r) => r.roleId === roleId)?.permissions.includes(COUNTER_OPERATE) ?? false;

    useEffect(() => {
        counterService
            .getAll()
            .then(setCounters)
            .catch((error) => {
                message.error(error instanceof Error ? error.message : 'Không tải được danh sách quầy');
            });
    }, []);

    const handleValuesChange = (changed: Partial<AccountForm>) => {
        if ('roleId' in changed) {
            setRoleId(changed.roleId);
            form.setFieldValue('counterIds', []); // đổi vai trò thì xóa quầy đã chọn
        }
    };

    const handleFinish = async (values: AccountForm) => {
        setSubmitting(true);
        try {
            await accountService.create({
                fullName: values.fullName.trim(),
                phone: values.phone.trim(),
                email: values.email.trim(),
                username: values.username.trim(),
                password: values.password,
                roleId: values.roleId,
                counterIds: needsCounter ? values.counterIds ?? [] : [],
                status: values.status,
            });
            message.success('Thêm tài khoản thành công');
            onSuccess();
            onClose();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Thêm tài khoản thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            width={640}
            centered
            maskClosable={false}
            footer={null}
            onCancel={onClose}
            afterClose={() => {
                form.resetFields();
                setRoleId(undefined);
            }}
            className={styles.modal}
            title={<div className={styles.title}>Thêm tài khoản</div>}
        >
            <Form<AccountForm>
                form={form}
                layout="vertical"
                className={styles.form}
                initialValues={{ status: ACCOUNT_STATUS.ACTIVE, counterIds: [] }}
                onValuesChange={handleValuesChange}
                onFinish={handleFinish}
                // Dấu * đỏ đặt SAU nhãn như Figma
                requiredMark={(label, { required }) => (
                    <>
                        {label}
                        {required && <span className={styles.asterisk}> *</span>}
                    </>
                )}
            >
                <Form.Item
                    label="Họ tên"
                    name="fullName"
                    className={styles.fullRow}
                    rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input placeholder="Nhập họ tên" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                        { pattern: /^\d+$/, message: 'Số điện thoại chỉ gồm chữ số' },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không đúng định dạng' },
                    ]}
                >
                    <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                    label="Tên đăng nhập:"
                    name="username"
                    className={styles.fullRow}
                    rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                >
                    <Input placeholder="Nhập tên đăng nhập" />
                </Form.Item>

                {/* required={false}: tự vẽ dấu * để chèn thêm chữ "Tối thiểu 8 ký tự" như Figma */}
                <Form.Item
                    label={
                        <span>
                            Mật khẩu: <span className={styles.asterisk}>*</span>
                            <span className={styles.hint}>Tối thiểu {VALIDATION.PASSWORD_MIN} ký tự</span>
                        </span>
                    }
                    name="password"
                    required={false}
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu' },
                        { min: VALIDATION.PASSWORD_MIN, message: `Mật khẩu tối thiểu ${VALIDATION.PASSWORD_MIN} ký tự` },
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu:" />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu:" />
                </Form.Item>

                <Form.Item
                    label="Vai trò"
                    name="roleId"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                >
                    <Select<string>
                        placeholder="Chọn vai trò"
                        className={styles.select}
                        options={roles.map((r) => ({ value: r.roleId, label: r.roleName }))}
                    />
                </Form.Item>

                {/* required: luôn hiện dấu *, còn có bắt buộc chọn hay không thì tùy vai trò */}
                <Form.Item
                    label="Quầy dịch vụ xử lý"
                    name="counterIds"
                    required
                    rules={[{ required: needsCounter, message: 'Vui lòng chọn quầy dịch vụ xử lý' }]}
                >
                    <Select<string[]>
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="Chọn quầy dịch vụ xử lý"
                        className={styles.select}
                        disabled={!needsCounter}
                        options={counters.map((c) => ({ value: c.counterId, label: c.counterName }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Tình trạng"
                    name="status"
                    className={styles.fullRow}
                    rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
                >
                    <Select
                        className={styles.select}
                        options={[ACCOUNT_STATUS.ACTIVE, ACCOUNT_STATUS.SUSPENDED].map((value) => ({
                            value,
                            label: ACCOUNT_STATUS_LABEL[value],
                        }))}
                    />
                </Form.Item>

                <div className={styles.note}>
                    <span className={styles.asterisk}>* </span>Là trường thông tin bắt buộc
                </div>

                <div className={styles.footer}>
                    <Button className={styles.cancelButton} onClick={onClose}>
                        Hủy bỏ
                    </Button>
                    <Button type="primary" htmlType="submit" className={styles.submitButton} loading={submitting}>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}