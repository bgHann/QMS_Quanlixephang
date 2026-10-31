import { Button, Modal } from "antd";
import styles from "./LoginConfirmModal.module.css";

interface LoginConfirmModalProps {
  open: boolean;
  deviceName: string;
  time: string;
  location: string;
  onCancel: () => void;
  onReject: () => void;
  onLogin: () => void;
}

export default function LoginConfirmModal({
  open,
  deviceName,
  time,
  location,
  onCancel,
  onReject,
  onLogin,
}: LoginConfirmModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnHidden
      className={styles.loginConfirmModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Xác nhận đăng nhập</h2>

        <div className={styles.information}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tên thiết bị:</span>

            <span className={styles.infoValue}>{deviceName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Thời gian:</span>

            <span className={styles.infoValue}>{time}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Địa điểm:</span>

            <span className={styles.infoValue}>{location}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button className={styles.rejectButton} onClick={onReject}>
            Từ chối
          </Button>

          <Button
            type="primary"
            className={styles.loginButton}
            onClick={onLogin}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </Modal>
  );
}
