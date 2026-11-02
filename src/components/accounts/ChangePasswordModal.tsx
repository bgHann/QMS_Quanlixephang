import { useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { accountService } from '../../api/services/accountService';
import { VALIDATION } from '../../constants/validation';
import type { Account, ChangePasswordForm } from '../../types/account';
import styles from './ChangePasswordModal.module.css';

interface ChangePasswordModalProps {
    open: boolean;
    account: Account | null;
    onClose: () => void;
}

export default function ChangePasswordModal({ open, account, onClose }: ChangePasswordModalProps) {
    const [form] = Form.useForm<ChangePasswordForm>();
    const [submitting, setSubmitting] = useState(false);

    const handleFinish = async (values: ChangePasswordForm) => {
        if (!account) return;
        setSubmitting(true);
        try {
            await accountService.changePassword(account.accountId, values.password);
            message.success('Đổi mật khẩu thành công');
            onClose();
        } catch (error) {
            message.error(error instanceof Error ? error.message : 'Đổi mật khẩu thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            width={440}
            centered
            maskClosable={false}
            footer={null}
            onCancel={onClose}
            afterClose={() => form.resetFields()}
            className={styles.modal}
            title={<div className={styles.title}>Đổi mật khẩu</div>}
        >
            <Form
                form={form}
                layout="vertical"
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
                    label="Mật khẩu:"
                    name="password"
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