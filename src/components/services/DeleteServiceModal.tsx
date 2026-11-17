import { Button, Modal } from "antd";

import styles from "./DeleteServiceModal.module.css";

interface DeleteServiceModalProps {
  open: boolean;
  serviceNames: string[];
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteServiceModal({
  open,
  serviceNames,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteServiceModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnHidden
      closable={!loading}
      maskClosable={false}
      keyboard={!loading}
      className={styles.deleteServiceModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Xóa dịch vụ</h2>

        <p className={styles.description}>
          Bạn có chắc chắn muốn xóa{" "}
          {serviceNames.length === 1 ? "dịch vụ" : "các dịch vụ"}{" "}
          <span className={styles.serviceNames}>{serviceNames.join(", ")}</span>
          ?
        </p>

        <div className={styles.actions}>
          <Button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            Hủy bỏ
          </Button>

          <Button
            type="primary"
            className={styles.confirmButton}
            onClick={onConfirm}
            loading={loading}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
}
