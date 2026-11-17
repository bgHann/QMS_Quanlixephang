import { Button, Modal } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    content?: string;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title = 'Xác nhận xóa?',
    content = 'Bạn có chắc chắn xóa mục này? Hành động này không thể hoàn tác.',
    loading = false,
    onOk,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            width={440}
            centered
            maskClosable={false}
            footer={null}
            onCancel={onCancel}
            className={styles.modal}
        >
            <div className={styles.body}>
                <div className={styles.iconBox}>
                    <WarningOutlined className={styles.icon} />
                </div>
                <div>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.content}>{content}</div>
                </div>
            </div>

            <div className={styles.footer}>
                <Button className={styles.cancelButton} onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="primary" danger className={styles.okButton} loading={loading} onClick={onOk}>
                    Xác nhận
                </Button>
            </div>
        </Modal>
    );
}