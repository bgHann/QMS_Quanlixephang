import { Button, Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import styles from "./DeviceDetailPage.module.css";

import { useEffect, useState } from "react";

import { deviceService } from "../../api/services/deviceService";

import type { Device } from "../../types/device";

import { DEVICE_TYPE, CONNECTION_STATUS } from "../../constants/enums";

import { SquarePen, Router, Volume2, Trash2 } from "lucide-react";

import VolumeModal from "../../components/devices/VolumeModal";

import DeviceCodeModal from "../../components/devices/DeviceCodeModal";

import LoginConfirmModal from "../../components/devices/LoginConfirmModal";

import DeleteDeviceModal from "../../components/devices/DeleteDeviceModal";

import EditDeviceModal from "../../components/devices/EditDeviceModal";

const deviceTypeLabels: Record<string, string> = {
  [DEVICE_TYPE.KIOSK]: "Kiosk",
  [DEVICE_TYPE.MAIN_DISPLAY]: "Màn hình trung tâm",
  [DEVICE_TYPE.COUNTER_DISPLAY]: "Màn hình quầy",
  [DEVICE_TYPE.RATING_DEVICE]: "Thiết bị đánh giá",
};

export default function DeviceDetailPage() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();

  const [device, setDevice] = useState<Device | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [volumeModalOpen, setVolumeModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  // Popup nhập mã thiết bị
  const [deviceCodeModalOpen, setDeviceCodeModalOpen] = useState(false);

  // Popup xác nhận đăng nhập
  const [loginConfirmModalOpen, setLoginConfirmModalOpen] = useState(false);

  // Lưu tạm mức âm lượng đang điều chỉnh
  const [pendingVolume, setPendingVolume] = useState<number | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const serviceNames = device
    ? deviceService.getServiceNames(device.serviceIds)
    : [];

  useEffect(() => {
    let cancelled = false;

    const fetchDevice = async () => {
      setLoading(true);
      setError(null);
      setDevice(null);

      if (!deviceId) {
        setError("Không tìm thấy mã định danh thiết bị");
        setLoading(false);
        return;
      }

      try {
        const result = await deviceService.getById(deviceId);

        if (cancelled) return;

        if (!result) {
          setError("Không tìm thấy thiết bị");
        } else {
          setDevice(result);
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Lỗi tải thông tin thiết bị:", err);
        setError("Không thể tải thông tin thiết bị");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDevice();

    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  const handleDeleteDevice = () => {
    if (!device) return;

    setDeleteModalOpen(true);
  };
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h2 className={styles.deviceTitle}>
          Thông tin thiết bị {device?.deviceCode ?? ""}
        </h2>

        {loading ? (
          <p>Đang tải thông tin thiết bị...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : device ? (
          <>
            <div className={styles.infoGrid}>
              {/* CỘT 1 */}
              <div className={styles.infoColumn}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Mã thiết bị:</span>
                  <span className={styles.value}>{device.deviceCode}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Loại thiết bị:</span>
                  <span className={styles.value}>
                    {deviceTypeLabels[device.deviceType] ?? device.deviceType}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Mật khẩu đăng nhập:</span>
                  <span className={styles.value}>—</span>
                </div>
              </div>

              {/* CỘT 2 */}
              <div className={styles.infoColumn}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Tên thiết bị:</span>
                  <span className={styles.value}>{device.deviceName}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Trạng thái hoạt động:</span>

                  <span
                    className={
                      device.connectionStatus === CONNECTION_STATUS.CONNECTED
                        ? styles.statusActive
                        : styles.statusInactive
                    }
                  >
                    <span className={styles.statusDot}>●</span>

                    {device.connectionStatus === CONNECTION_STATUS.CONNECTED
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Địa chỉ IP:</span>
                  <span className={styles.value}>
                    {device.ipAddress || "Chưa có"}
                  </span>
                </div>
              </div>

              {/* CỘT 3 */}
              <div className={styles.infoColumn}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Âm lượng:</span>
                  <span className={styles.value}>{device.volume}%</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Dịch vụ sử dụng:</span>
                  <span className={styles.value}>
                    {serviceNames.length > 0 ? serviceNames.join(", ") : "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.actionBar}>
              <Button
                icon={<SquarePen size={18} strokeWidth={1.8} />}
                className={styles.actionButton}
                onClick={() => setEditModalOpen(true)}
              >
                Cập nhật
              </Button>

              <Button
                icon={<Router size={18} strokeWidth={1.8} />}
                className={styles.actionButton}
                onClick={() => setDeviceCodeModalOpen(true)}
              >
                Đăng nhập thiết bị
              </Button>

              <Button
                icon={<Volume2 size={18} strokeWidth={1.8} />}
                className={styles.actionButton}
                onClick={() => setVolumeModalOpen(true)}
              >
                Âm lượng
              </Button>

              <Button
                icon={<Trash2 size={18} strokeWidth={1.8} />}
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleDeleteDevice}
              >
                Xóa thiết bị
              </Button>
            </div>
          </>
        ) : null}
      </div>
      <VolumeModal
        open={volumeModalOpen}
        deviceNames={device ? [device.deviceCode] : []}
        initialVolume={device?.volume ?? 50}
        onCancel={() => {
          setVolumeModalOpen(false);
        }}
        onConfirm={(volume) => {
          // Hiện tại chỉ ghi nhận giá trị trong giao diện mock
          console.log(`Âm lượng thiết bị ${device?.deviceCode}:`, volume);

          setVolumeModalOpen(false);

          message.info(
            "Đã ghi nhận mức âm lượng. Chưa cập nhật lên thiết bị thật.",
          );
        }}
      />
      <DeviceCodeModal
        open={deviceCodeModalOpen}
        onCancel={() => {
          setDeviceCodeModalOpen(false);
        }}
        onConfirm={(code) => {
          if (code.length !== 6) return;

          // TODO: Xác thực mã đăng nhập với backend
          setDeviceCodeModalOpen(false);
          setLoginConfirmModalOpen(true);
        }}
      />
      <LoginConfirmModal
        open={loginConfirmModalOpen}
        deviceName={device?.deviceCode ?? ""}
        time={new Date().toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
        location="Chưa có dữ liệu"
        onCancel={() => {
          setLoginConfirmModalOpen(false);
        }}
        onReject={() => {
          setLoginConfirmModalOpen(false);
        }}
        onLogin={() => {
          if (!device) return;

          console.log("Yêu cầu đăng nhập thiết bị:", device.deviceId);

          message.info("Chức năng đăng nhập thiết bị chưa được kết nối API.");

          setLoginConfirmModalOpen(false);
        }}
      />

      <DeleteDeviceModal
        open={deleteModalOpen}
        deviceNames={device ? [device.deviceCode] : []}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={async () => {
          if (!device) return;

          try {
            const success = await deviceService.deleteById(device.deviceId);

            if (!success) {
              message.error("Không tìm thấy thiết bị hoặc thiết bị đã bị xóa");
              return;
            }

            setDeleteModalOpen(false);

            message.success(
              `Đã xóa thiết bị ${device.deviceCode} khỏi dữ liệu mock`,
            );

            navigate(ROUTES.DEVICES, { replace: true });
          } catch (error) {
            console.error("Lỗi xóa thiết bị:", error);
            message.error("Không thể xóa thiết bị");
          }
        }}
      />
      <EditDeviceModal
        open={editModalOpen}
        device={device}
        onCancel={() => {
          setEditModalOpen(false);
        }}
        onSubmit={async (values) => {
          if (!device) {
            message.error("Không tìm thấy thiết bị cần cập nhật");
            return;
          }

          try {
            const updatedDevice = await deviceService.updateById(
              device.deviceId,
              values,
            );

            if (!updatedDevice) {
              message.error("Không thể cập nhật thiết bị");
              return;
            }

            // Cập nhật thông tin hiển thị ngay trên trang Chi tiết
            setDevice(updatedDevice);

            // Đóng popup
            setEditModalOpen(false);

            message.success(
              `Đã cập nhật thiết bị ${updatedDevice.deviceCode} trong dữ liệu mock`,
            );
          } catch (error) {
            console.error("Lỗi cập nhật thiết bị:", error);
            message.error("Có lỗi xảy ra khi cập nhật thiết bị");
          }
        }}
      />
    </div>
  );
}
