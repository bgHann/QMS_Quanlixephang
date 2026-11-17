import { Button, Modal } from "antd";

import styles from "./DeleteDeviceModal.module.css";

interface DeleteDeviceModalProps {
  open: boolean;
  deviceNames: string[];
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDeviceModal({
  open,
  deviceNames,
  onCancel,
  onConfirm,
}: DeleteDeviceModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnHidden
      className={styles.deleteDeviceModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Xóa thiết bị</h2>

        <p className={styles.description}>
          Bạn có chắc chắn muốn xóa{" "}
          {deviceNames.length === 1 ? "thiết bị" : "các thiết bị"}{" "}
          <span className={styles.deviceNames}>{deviceNames.join(", ")}</span>?
        </p>

        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onCancel}>
            Hủy bỏ
          </Button>

          <Button
            type="primary"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
}
