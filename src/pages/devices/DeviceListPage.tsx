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
import DeleteDeviceModal from "../../components/devices/DeleteDeviceModal";
import EditDeviceModal from "../../components/devices/EditDeviceModal";

export default function DeviceListPage() {
  const navigate = useNavigate();

  // Danh sách thiết bị
  const [devices, setDevices] = useState<Device[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Trạng thái đóng/mở Popup Âm Lượng
  const [volumeModalOpen, setVolumeModalOpen] = useState(false);

  // Danh sách thiết bị sẽ được điều chỉnh âm lượng
  const [volumeTargetDevices, setVolumeTargetDevices] = useState<Device[]>([]);

  // Trạng thái đóng/mở Popup Nhập mã thiết bị
  const [deviceCodeModalOpen, setDeviceCodeModalOpen] = useState(false);

  // Trạng thái đóng/mở Popup Xác nhận đăng nhập
  const [loginConfirmModalOpen, setLoginConfirmModalOpen] = useState(false);

  const [loginTargetDevice, setLoginTargetDevice] = useState<Device | null>(
    null,
  );

  // Trạng thái đóng/mở Popup Thêm thiết bị
  const [addDeviceModalOpen, setAddDeviceModalOpen] = useState(false);

  const [deviceInfoModalOpen, setDeviceInfoModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);

  const [newDeviceInfo, setNewDeviceInfo] =
    useState<AddDeviceFormValues | null>(null);

  const [searchText, setSearchText] = useState("");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    DeviceAvailability | undefined
  >(undefined);

  const [connectionFilter, setConnectionFilter] = useState<
    ConnectionStatus | undefined
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

  const handleOpenDeviceLogin = (record: Device) => {
    setLoginTargetDevice(record);
    setDeviceCodeModalOpen(true);
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
            connectionStatus: connectionFilter,
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
  }, [
    searchText,
    availabilityFilter,
    connectionFilter,
    page,
    pageSize,
    refreshKey,
  ]);

  const handleDeleteSelectedDevices = () => {
    const selectedIds = selectedRowKeys.map(String);

    if (selectedIds.length === 0) {
      return;
    }

    setDeleteTargetIds(selectedIds);
    setDeleteModalOpen(true);
  };

  const handleOpenEditModal = (record: Device) => {
    setEditingDevice(record);
    setEditModalOpen(true);
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

          <Tooltip title="Đăng nhập thiết bị">
            <Button
              type="text"
              icon={<Router size={20} strokeWidth={2} />}
              aria-label={`Đăng nhập ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
              onClick={() => handleOpenDeviceLogin(record)}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa thiết bị">
            <Button
              type="text"
              icon={<SquarePen size={20} strokeWidth={2} />}
              aria-label={`Sửa ${record.deviceCode}`}
              style={{ color: "#FF7605" }}
              onClick={() => handleOpenEditModal(record)}
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
          <div className={styles.filterLabel}>Trạng thái khả dụng</div>

          <Select
            className={styles.statusSelect}
            classNames={{
              popup: {
                root: styles.statusDropdown,
              },
            }}
            value={availabilityFilter ?? "ALL"}
            onChange={(value) => {
              setAvailabilityFilter(
                value === "ALL" ? undefined : (value as DeviceAvailability),
              );
              setPage(1);
            }}
            options={[
              {
                value: "ALL",
                label: "Tất cả",
              },
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
        <div className={styles.filterField}>
          <div className={styles.filterLabel}>Trạng thái kết nối</div>

          <Select
            className={styles.statusSelect}
            classNames={{
              popup: {
                root: styles.statusDropdown,
              },
            }}
            value={connectionFilter ?? "ALL"}
            onChange={(value) => {
              setConnectionFilter(
                value === "ALL" ? undefined : (value as ConnectionStatus),
              );
              setPage(1);
            }}
            options={[
              {
                value: "ALL",
                label: "Tất cả",
              },
              {
                value: "CONNECTED",
                label: CONNECTION_STATUS_LABEL.CONNECTED,
              },
              {
                value: "DISCONNECTED",
                label: CONNECTION_STATUS_LABEL.DISCONNECTED,
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
          console.log(
            "Thiết bị điều chỉnh âm lượng:",
            volumeTargetDevices.map((device) => device.deviceCode),
          );

          console.log("Mức âm lượng được chọn:", volume);

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
          setLoginTargetDevice(null);
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
        deviceName={loginTargetDevice?.deviceCode ?? ""}
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
          setLoginTargetDevice(null);
        }}
        onReject={() => {
          setLoginConfirmModalOpen(false);
          setLoginTargetDevice(null);
        }}
        onLogin={() => {
          if (!loginTargetDevice) {
            message.error("Không xác định được thiết bị cần đăng nhập");
            return;
          }

          console.log(
            "Yêu cầu đăng nhập thiết bị:",
            loginTargetDevice.deviceId,
          );

          // TODO: Kết nối API xác thực và đăng nhập thiết bị
          message.info("Chức năng đăng nhập thiết bị chưa được kết nối API.");

          setLoginConfirmModalOpen(false);
          setLoginTargetDevice(null);
        }}
      />
      <AddDeviceModal
        open={addDeviceModalOpen}
        onCancel={() => {
          setAddDeviceModalOpen(false);
        }}
        onSubmit={async (values) => {
          try {
            // 1. Lưu thiết bị mới
            const createdDevice = await deviceService.create(values);

            // 2. Thông báo thành công
            message.success(
              `Đã thêm thiết bị ${createdDevice.deviceCode} thành công`,
            );

            // 3. Làm mới danh sách thiết bị
            setSelectedRowKeys([]);
            setPage(1);
            setRefreshKey((prev) => prev + 1);

            // 4. Lưu thông tin để hiển thị popup hiện tại
            setNewDeviceInfo(values);

            // 5. Đóng popup thêm thiết bị
            setAddDeviceModalOpen(false);

            // 6. Mở popup thông tin thiết bị
            setDeviceInfoModalOpen(true);
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Không thể thêm thiết bị. Vui lòng thử lại.";

            message.error(errorMessage);
          }
        }}
      />
      <DeviceInfoModal
        open={deviceInfoModalOpen}
        device={newDeviceInfo}
        onClose={() => {
          setDeviceInfoModalOpen(false);
        }}
      />
      <DeleteDeviceModal
        open={deleteModalOpen}
        deviceNames={deleteTargetIds.map((id) => {
          const device = devices.find((item) => item.deviceId === id);

          return device?.deviceCode ?? id;
        })}
        onCancel={() => {
          setDeleteModalOpen(false);
          setDeleteTargetIds([]);
        }}
        onConfirm={async () => {
          if (deleteTargetIds.length === 0) return;

          try {
            const results = await Promise.allSettled(
              deleteTargetIds.map((id) => deviceService.deleteById(id)),
            );

            const deletedIds = deleteTargetIds.filter((_, index) => {
              const result = results[index];

              return result.status === "fulfilled" && result.value === true;
            });

            if (deletedIds.length === 0) {
              message.error("Không có thiết bị nào được xóa");
              return;
            }

            // Bỏ chọn những thiết bị đã xóa thành công
            setSelectedRowKeys((currentKeys) =>
              currentKeys.filter((key) => !deletedIds.includes(String(key))),
            );

            // Đóng popup
            setDeleteModalOpen(false);
            setDeleteTargetIds([]);

            // Quay về trang đầu và cập nhật danh sách
            setPage(1);
            setRefreshKey((current) => current + 1);

            if (deletedIds.length === results.length) {
              message.success(
                `Đã xóa ${deletedIds.length} thiết bị khỏi dữ liệu mock`,
              );
            } else {
              message.warning(
                `Đã xóa ${deletedIds.length}/${results.length} thiết bị`,
              );
            }
          } catch (error) {
            console.error("Lỗi xóa thiết bị:", error);
            message.error("Không thể xóa thiết bị");
          }
        }}
      />
      <EditDeviceModal
        open={editModalOpen}
        device={editingDevice}
        onCancel={() => {
          setEditModalOpen(false);
          setEditingDevice(null);
        }}
        onSubmit={async (values) => {
          if (!editingDevice) {
            message.error("Không tìm thấy thiết bị cần cập nhật");
            return;
          }

          try {
            const updatedDevice = await deviceService.updateById(
              editingDevice.deviceId,
              values,
            );

            if (!updatedDevice) {
              message.error("Không thể cập nhật thiết bị");
              return;
            }

            // Cập nhật thiết bị đang hiển thị trong bảng
            setDevices((currentDevices) =>
              currentDevices.map((device) =>
                device.deviceId === updatedDevice.deviceId
                  ? updatedDevice
                  : device,
              ),
            );

            // Đóng popup
            setEditModalOpen(false);
            setEditingDevice(null);

            // Tải lại danh sách để áp dụng bộ lọc và phân trang
            setRefreshKey((current) => current + 1);

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
