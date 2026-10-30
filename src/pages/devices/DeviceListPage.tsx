import { useEffect, useState } from "react";
import { Volume2, Router, SquarePen, Info } from "lucide-react";
import styles from "./DeviceListPage.module.css";
import PaginationBar from "../../components/common/PaginationBar";
import type { Key } from "react";
import { Table, Tooltip, message, Button, Space, Input, Select } from "antd";
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

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);

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
  }, [searchText, availabilityFilter, page, pageSize]);

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
    </div>
  );
}
