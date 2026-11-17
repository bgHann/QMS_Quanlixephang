import { Button, Modal } from "antd";

import { DEVICE_TYPE, DEVICE_AVAILABILITY } from "../../constants/enums";

import { deviceServiceNamesMock } from "../../mock/devices.mock";

import type { AddDeviceFormValues } from "./AddDeviceModal";

import styles from "./DeviceInfoModal.module.css";

interface DeviceInfoModalProps {
  open: boolean;
  device: AddDeviceFormValues | null;
  onClose: () => void;
}

const deviceTypeLabels: Record<string, string> = {
  [DEVICE_TYPE.KIOSK]: "Kiosk",
  [DEVICE_TYPE.MAIN_DISPLAY]: "Màn hình trung tâm",
  [DEVICE_TYPE.COUNTER_DISPLAY]: "Màn hình quầy",
  [DEVICE_TYPE.RATING_DEVICE]: "Thiết bị đánh giá",
};

export default function DeviceInfoModal({
  open,
  device,
  onClose,
}: DeviceInfoModalProps) {
  if (!device) return null;

  const serviceNames = (device.serviceIds ?? []).map(
    (serviceId) => deviceServiceNamesMock[serviceId] ?? serviceId,
  );

  const isAvailable = device.availability === DEVICE_AVAILABILITY.AVAILABLE;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      destroyOnHidden
      className={styles.deviceInfoModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Thông tin thiết bị</h2>

        <div className={styles.infoGrid}>
          {/* CỘT TRÁI */}
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Mã thiết bị:</span>
              <span className={styles.value}>{device.deviceCode}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Địa chỉ IP:</span>
              <span className={styles.value}>Chưa có</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Loại thiết bị:</span>
              <span className={styles.value}>
                {deviceTypeLabels[device.deviceType] ?? device.deviceType}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Âm lượng:</span>
              <span className={styles.value}>Chưa thiết lập</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Mật khẩu đăng nhập:</span>
              <span className={styles.value}>Chưa thiết lập</span>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className={styles.infoColumn}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Tên thiết bị:</span>
              <span className={styles.value}>{device.deviceName}</span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Trạng thái hoạt động:</span>

              <span
                className={
                  isAvailable ? styles.statusActive : styles.statusInactive
                }
              >
                ● {isAvailable ? "Khả dụng" : "Không khả dụng"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Dịch vụ sử dụng:</span>

              <span className={styles.value}>
                {serviceNames.length > 0 ? serviceNames.join(", ") : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="default"
            onClick={onClose}
            className={styles.closeButton}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
