import { useEffect, useState } from "react";
import { Volume2, Router, SquarePen, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./DeviceListPage.module.css";
import PaginationBar from "../../components/common/PaginationBar";
import type { Key } from "react";
import {
  Table,
  Tooltip,
  message,
  Button,
  Space,
  Input,
  Select,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import type {
  ConnectionStatus,
  DeviceAvailability,
} from "../../constants/enums";

import {
  CONNECTION_STATUS_LABEL,
  DEVICE_AVAILABILITY_LABEL,
} from "../../constants/enums";

import DeviceToolbar from "../../components/devices/DeviceToolbar";

import type { Device } from "../../types/device";
import { deviceService } from "../../api/services/deviceService";

import VolumeModal from "../../components/devices/VolumeModal";
import DeviceCodeModal from "../../components/devices/DeviceCodeModal";
import LoginConfirmModal from "../../components/devices/LoginConfirmModal";

import AddDeviceModal from "../../components/devices/AddDeviceModal";

import type { AddDeviceFormValues } from "../../components/devices/AddDeviceModal";

import DeviceInfoModal from "../../components/devices/DeviceInfoModal";

export default function DeviceListPage() {
  const navigate = useNavigate();

  // Danh sách thiết bị
  const [devices, setDevices] = useState<Device[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // Trạng thái đóng/mở Popup Âm Lượng
  const [volumeModalOpen, setVolumeModalOpen] = useState(false);

  // Danh sách thiết bị sẽ được điều chỉnh âm lượng
  const [volumeTargetDevices, setVolumeTargetDevices] = useState<Device[]>([]);

  // Trạng thái đóng/mở Popup Nhập mã thiết bị
  const [deviceCodeModalOpen, setDeviceCodeModalOpen] = useState(false);

  // Lưu tạm âm lượng cho đến khi mã thiết bị được xác thực
  const [pendingVolume, setPendingVolume] = useState<number | null>(null);

  // Trạng thái đóng/mở Popup Xác nhận đăng nhập
  const [loginConfirmModalOpen, setLoginConfirmModalOpen] = useState(false);

  // Trạng thái đóng/mở Popup Thêm thiết bị
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);

  const [deviceInfoModalOpen, setDeviceInfoModalOpen] = useState(false);

  const [newDeviceInfo, setNewDeviceInfo] =
    useState<AddDeviceFormValues | null>(null);

  const [searchText, setSearchText] = useState("");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    DeviceAvailability | undefined
  >(undefined);

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);

  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  // Mở Popup Âm Lượng
  const handleOpenVolumeModal = (record: Device) => {
    let targetDevices: Device[] = [];

    if (selectedRowKeys.length > 0) {
      // Có checkbox được chọn: lấy các thiết bị đã chọn
      targetDevices = devices.filter((device) =>
        selectedRowKeys.includes(device.deviceId),
      );
    } else {
      // Không chọn checkbox: chỉ điều chỉnh thiết bị được nhấn
      targetDevices = [record];
    }

    setVolumeTargetDevices(targetDevices);
    setVolumeModalOpen(true);
  };

  // Lấy dữ liệu thiết bị

  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      const fetchDevices = async () => {
        setLoading(true);

        try {
          const response = await deviceService.getList({
            page,
            pageSize,
            keyword: searchText,
            availability: availabilityFilter,
          });

          if (active) {
            setDevices(response.items);
            setTotal(response.total);
          }
        } catch (error) {
          if (active) {
            message.error("Không thể tải danh sách thiết bị");
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void fetchDevices();
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchText, availabilityFilter, page, pageSize, refreshKey]);

  const handleDeleteSelectedDevices = () => {
    const selectedIds = selectedRowKeys.map(String);

    if (selectedIds.length === 0) {
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa thiết bị",

      content: (
        <span>
          Bạn có chắc chắn muốn xóa{" "}
          <strong>{selectedIds.length} thiết bị</strong> đã chọn không?
        </span>
      ),

      okText: "Xóa thiết bị",
      okType: "danger",
      cancelText: "Hủy bỏ",
      centered: true,

      onOk: async () => {
        const results = await Promise.allSettled(
          selectedIds.map((id) => deviceService.deleteById(id)),
        );

        const deletedIds = selectedIds.filter((_, index) => {
          const result = results[index];

          return result.status === "fulfilled" && result.value === true;
        });

        const failedCount = selectedIds.length - deletedIds.length;

        if (deletedIds.length > 0) {
          message.success(
            `Đã xóa ${deletedIds.length} thiết bị khỏi dữ liệu mock`,
          );

          // Bỏ chọn các thiết bị đã xóa
          setSelectedRowKeys((previousKeys) =>
            previousKeys.filter((key) => !deletedIds.includes(String(key))),
          );

          // Trở về trang đầu và tải lại dữ liệu
          setPage(1);
          setRefreshKey((previous) => previous + 1);
        }

        if (failedCount > 0) {
          message.error(`Có ${failedCount} thiết bị không thể xóa`);
        }
      },
    });
  };

  // Khai báo các cột của bảng
  const columns: TableColumnsType<Device> = [
    {
      title: "Mã thiết bị",
      dataIndex: "deviceCode",
      key: "deviceCode",
      width: 150,
    },
    {
      title: "Tên thiết bị",
      dataIndex: "deviceName",
      key: "deviceName",
      width: 313,
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 109,
    },

    {
      title: "Trạng thái kết nối",
      dataIndex: "connectionStatus",
      key: "connectionStatus",
      width: 139,

      render: (status: ConnectionStatus) => {
        const isConnected = status === "CONNECTED";

        return (
          <span
            style={{
              color: isConnected ? "#00B69B" : "#FF4D4F",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "currentColor",
              }}
            />

            {CONNECTION_STATUS_LABEL[status]}
          </span>
        );
      },
    },

    {
      title: "Trạng thái khả dụng",
      dataIndex: "availability",
      key: "availability",
      width: 156,

      render: (status: DeviceAvailability) => {
        const isAvailable = status === "AVAILABLE";

        return (
          <span
            style={{
              color: isAvailable ? "#00B69B" : "#FF4D4F",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "currentColor",
              }}
            />

            {DEVICE_AVAILABILITY_LABEL[status]}
          </span>
        );
      },
    },

    {
      title: "Dịch vụ sử dụng",
      dataIndex: "serviceIds",
      key: "serviceIds",
      width: 497,

      render: (serviceIds: string[]) => {
        const serviceNames = deviceService.getServiceNames(serviceIds);

        const displayText = serviceNames.join(", ");

        return (
          <Tooltip title={displayText}>
            <div
              style={{
                maxWidth: 300,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayText || "—"}
            </div>
          </Tooltip>
        );
      },
    },

    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 134,

      render: (_, record: Device) => (
        <Space size={4}>
          <Tooltip title="Điều chỉnh âm lượng">
            <Button
              type="text"
              icon={<Volume2 size={20} strokeWidth={2} />}
              aria-label={`Âm lượng ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
              onClick={() => handleOpenVolumeModal(record)}
            />
          </Tooltip>

          <Tooltip title="Kết nối thiết bị">
            <Button
              type="text"
              icon={<Router size={20} strokeWidth={2} />}
              aria-label={`Kết nối ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa thiết bị">
            <Button
              type="text"
              icon={<SquarePen size={20} strokeWidth={2} />}
              aria-label={`Sửa ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
            />
          </Tooltip>

          <Tooltip title="Thông tin thiết bị">
            <Button
              type="text"
              icon={<Info size={20} strokeWidth={2} />}
              aria-label={`Thông tin ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
              onClick={() => {
                navigate(`/devices/${encodeURIComponent(record.deviceId)}`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.filterArea}>
        <div className={styles.filterField}>
          <div className={styles.filterLabel}>Tìm kiếm</div>

          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPage(1);
            }}
            allowClear
          />
        </div>

        <div className={styles.filterField}>
          <div className={styles.filterLabel}>Trạng thái hoạt động</div>

          <Select
            placeholder="Tất cả trạng thái"
            value={availabilityFilter}
            onChange={(value: DeviceAvailability | undefined) => {
              setAvailabilityFilter(value);
              setPage(1);
            }}
            allowClear
            options={[
              {
                value: "AVAILABLE",
                label: DEVICE_AVAILABILITY_LABEL.AVAILABLE,
              },
              {
                value: "UNAVAILABLE",
                label: DEVICE_AVAILABILITY_LABEL.UNAVAILABLE,
              },
            ]}
          />
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <Table<Device>
          rowKey="deviceId"
          columns={columns}
          dataSource={devices}
          loading={loading}
          pagination={false}
          rowSelection={{
            columnWidth: 44,
            selectedRowKeys,
            onChange: (newSelectedRowKeys) => {
              setSelectedRowKeys(newSelectedRowKeys);
            },
          }}
        />
      </div>
      <div className={styles.toolbarWrapper}>
        <DeviceToolbar
          onVolume={() => {
            const selectedDevice = devices.find((device) =>
              selectedRowKeys.includes(device.deviceId),
            );

            if (selectedDevice) {
              handleOpenVolumeModal(selectedDevice);
            }
          }}
          onAdd={() => {
            setAddDeviceModalOpen(true);
          }}
          onDelete={handleDeleteSelectedDevices}
          volumeDisabled={selectedRowKeys.length === 0}
          deleteDisabled={selectedRowKeys.length === 0}
        />
      </div>
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      <VolumeModal
        open={volumeModalOpen}
        deviceNames={volumeTargetDevices.map((device) => device.deviceCode)}
        initialVolume={50}
        onCancel={() => {
          setVolumeModalOpen(false);
        }}
        onConfirm={(volume) => {
          // Lưu tạm mức âm lượng người dùng đã chọn
          setPendingVolume(volume);

          // Đóng Popup Âm Lượng
          setVolumeModalOpen(false);

          // Mở Popup Nhập mã thiết bị
          setDeviceCodeModalOpen(true);
        }}
      />
      <DeviceCodeModal
        open={deviceCodeModalOpen}
        onCancel={() => {
          setDeviceCodeModalOpen(false);
          setPendingVolume(null);
        }}
        onConfirm={(code) => {
          // Chỉ chuyển popup để kiểm tra giao diện.
          // TODO: Xác thực mã với API trước khi cho phép đăng nhập.
          if (code.length !== 6) {
            return;
          }

          // Đóng Popup Nhập mã thiết bị
          setDeviceCodeModalOpen(false);

          // Mở Popup Xác nhận đăng nhập
          setLoginConfirmModalOpen(true);
        }}
      />
      <LoginConfirmModal
        open={loginConfirmModalOpen}
        deviceName={volumeTargetDevices
          .map((device) => device.deviceCode)
          .join(", ")}
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
          setPendingVolume(null);
        }}
        onReject={() => {
          setLoginConfirmModalOpen(false);
          setPendingVolume(null);
        }}
        onLogin={() => {
          if (pendingVolume === null) {
            return;
          }

          // Tạm thời kiểm tra âm lượng đang chờ xác thực
          console.log("Âm lượng đang chờ xác thực:", pendingVolume);

          // Chưa có API xác thực và cập nhật âm lượng
          window.alert(
            `Đã ghi nhận mức âm lượng ${pendingVolume}%. Chưa cập nhật lên thiết bị vì chưa kết nối API.`,
          );

          setLoginConfirmModalOpen(false);
          setPendingVolume(null);
        }}
      />
      <AddDeviceModal
        open={addDeviceModalOpen}
        onCancel={() => {
          setAddDeviceModalOpen(false);
        }}
        onSubmit={(values) => {
          // Xử lý dữ liệu khi submit
          console.log("Dữ liệu thêm thiết bị:", values);

          // Lưu tạm dữ liệu để hiển thị popup thông tin
          setNewDeviceInfo(values);

          // Đóng popup thêm thiết bị
          setAddDeviceModalOpen(false);

          // Mở popup thông tin thiết bị
          setDeviceInfoModalOpen(true);
        }}
      />
      <DeviceInfoModal
        open={deviceInfoModalOpen}
        device={newDeviceInfo}
        onClose={() => {
          setDeviceInfoModalOpen(false);
        }}
      />
    </div>
  );
}
