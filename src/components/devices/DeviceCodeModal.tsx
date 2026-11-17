import { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";
import styles from "./DeviceCodeModal.module.css";

interface DeviceCodeModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (code: string) => void;
}

export default function DeviceCodeModal({
  open,
  onCancel,
  onConfirm,
}: DeviceCodeModalProps) {
  const [code, setCode] = useState("");

  // Xóa mã cũ mỗi khi mở Popup
  useEffect(() => {
    if (open) {
      setCode("");
    }
  }, [open]);

  const handleCodeChange = (value: string) => {
    // Chỉ giữ lại chữ số, tối đa 6 ký tự
    const numericCode = value.replace(/\D/g, "").slice(0, 6);
    setCode(numericCode);
  };

  const handleConfirm = () => {
    if (code.length !== 6) {
      return;
    }

    onConfirm(code);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      destroyOnHidden
      className={styles.deviceCodeModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Nhập mã thiết bị</h2>

        <p className={styles.description}>
          Nhập mã đăng nhập hiển thị trên màn hình thiết bị
        </p>

        <div className={styles.otpWrapper}>
          <Input.OTP length={6} value={code} onChange={handleCodeChange} />
        </div>

        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onCancel}>
            Hủy bỏ
          </Button>

          <Button
            type="primary"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={code.length !== 6}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
}
