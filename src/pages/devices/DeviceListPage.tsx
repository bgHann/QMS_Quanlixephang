import { useEffect, useState } from "react";
import type { Key } from "react";
import { Table, Tooltip, message, Button, Space, Input, Select } from "antd";
import {
  SoundOutlined,
  UserOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import type {
  ConnectionStatus,
  DeviceAvailability,
} from "../../constants/enums";

import {
  CONNECTION_STATUS_LABEL,
  DEVICE_AVAILABILITY_LABEL,
} from "../../constants/enums";

import type { Device } from "../../types/device";
import { deviceService } from "../../api/services/deviceService";

export default function DeviceListPage() {
  // Danh sách thiết bị
  const [devices, setDevices] = useState<Device[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [searchText, setSearchText] = useState("");

  const [availabilityFilter, setAvailabilityFilter] = useState<
    DeviceAvailability | undefined
  >(undefined);

  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu thiết bị

  useEffect(() => {
    let active = true;

    const timer = window.setTimeout(() => {
      const fetchDevices = async () => {
        setLoading(true);

        try {
          const response = await deviceService.getList({
            keyword: searchText,
            availability: availabilityFilter,
          });

          if (active) {
            setDevices(response.items);
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
  }, [searchText, availabilityFilter]);

  // Khai báo các cột của bảng
  const columns: TableColumnsType<Device> = [
    {
      title: "Mã thiết bị",
      dataIndex: "deviceCode",
      key: "deviceCode",
    },
    {
      title: "Tên thiết bị",
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },

    {
      title: "Trạng thái kết nối",
      dataIndex: "connectionStatus",
      key: "connectionStatus",

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
      width: 180,

      render: (_, record: Device) => (
        <Space size={4}>
          <Tooltip title="Điều chỉnh âm lượng">
            <Button
              type="text"
              icon={<SoundOutlined />}
              aria-label={`Âm lượng ${record.deviceCode}`}
              disabled
            />
          </Tooltip>

          <Tooltip title="Mã đăng nhập">
            <Button
              type="text"
              icon={<UserOutlined />}
              aria-label={`Mã đăng nhập ${record.deviceCode}`}
              disabled
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa thiết bị">
            <Button
              type="text"
              icon={<EditOutlined />}
              aria-label={`Sửa ${record.deviceCode}`}
              disabled
            />
          </Tooltip>

          <Tooltip title="Thông tin thiết bị">
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              aria-label={`Thông tin ${record.deviceCode}`}
              disabled
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          //   alignItems: "flex-end",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            marginBottom: 16,
            width: 220,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Tìm kiếm
          </div>

          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            allowClear
          />
        </div>
        <div
          style={{
            width: 220,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Trạng thái hoạt động
          </div>

          <Select
            placeholder="Tất cả trạng thái"
            value={availabilityFilter}
            onChange={(value: DeviceAvailability | undefined) => {
              setAvailabilityFilter(value);
            }}
            allowClear
            style={{
              width: "100%",
            }}
            options={[
              {
                value: "AVAILABLE",
                label: "Khả dụng",
              },
              {
                value: "UNAVAILABLE",
                label: "Không khả dụng",
              },
            ]}
          />
        </div>
      </div>
      <Table<Device>
        rowKey="deviceId"
        columns={columns}
        dataSource={devices}
        loading={loading}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </div>
  );
}
