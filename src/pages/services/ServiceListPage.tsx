import { useEffect, useState } from "react";
import type { Key } from "react";

import {
  Button,
  DatePicker,
  Input,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";

import type { TableColumnsType } from "antd";

import { Info, Search, SquarePen } from "lucide-react";

import PaginationBar from "../../components/common/PaginationBar";

import { serviceService } from "../../api/services/serviceService";

import { SERVICE_STATUS, SERVICE_STATUS_LABEL } from "../../types/service";

import type { Service, ServiceStatus } from "../../types/service";

import styles from "./ServiceListPage.module.css";

import ServiceToolbar from "../../components/services/ServiceToolbar";
import { useNavigate } from "react-router-dom";
import {
  ROUTES,
  buildServiceDetailPath,
  buildServiceEditPath,
} from "../../constants/routes";

import DeleteServiceModal from "../../components/services/DeleteServiceModal";

const { RangePicker } = DatePicker;

export default function ServiceListPage() {
  const navigate = useNavigate();
  // Danh sách dịch vụ
  const [services, setServices] = useState<Service[]>([]);

  // Checkbox
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // Bộ lọc
  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] = useState<ServiceStatus | undefined>(
    undefined,
  );

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();

  // Phân trang
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Loading
  const [loading, setLoading] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Lấy danh sách dịch vụ
  useEffect(() => {
    let active = true;

    const fetchServices = async () => {
      setLoading(true);

      try {
        const response = await serviceService.getList({
          page,
          pageSize,
          keyword: searchText,
          status: statusFilter,
          fromDate,
          toDate,
        });

        if (active) {
          setServices(response.items);
          setTotal(response.total);
        }
      } catch {
        if (active) {
          message.error("Không thể tải danh sách dịch vụ");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchServices();

    return () => {
      active = false;
    };
  }, [page, pageSize, searchText, statusFilter, fromDate, toDate, refreshKey]);

  const handleDeleteServices = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }

    setDeleting(true);

    try {
      const deletedCount = await serviceService.deleteMany(
        selectedRowKeys.map(String),
      );

      message.success(`Đã xóa ${deletedCount} dịch vụ thành công`);

      // Bỏ lựa chọn sau khi xóa
      setSelectedRowKeys([]);

      // Đóng popup
      setDeleteModalOpen(false);

      // Điều chỉnh trang nếu trang hiện tại không còn dữ liệu
      const remainingTotal = Math.max(0, total - deletedCount);
      const lastPage = Math.max(1, Math.ceil(remainingTotal / pageSize));

      setPage((currentPage) => Math.min(currentPage, lastPage));

      // Tải lại danh sách
      setRefreshKey((current) => current + 1);
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Không thể xóa dịch vụ. Vui lòng thử lại.",
      );
    } finally {
      setDeleting(false);
    }
  };
  // Cấu hình các cột
  const columns: TableColumnsType<Service> = [
    {
      title: "Mã dịch vụ",
      dataIndex: "serviceCode",
      key: "serviceCode",
      width: 160,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 220,
    },
    {
      title: "Quầy dịch vụ",
      dataIndex: "counterIds",
      key: "counterIds",
      width: 280,

      render: (counterIds: string[]) => {
        const counterNames = serviceService.getCounterNames(counterIds);

        return counterNames.join(", ");
      },
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "status",
      key: "status",
      width: 180,

      render: (status: ServiceStatus) => {
        const isActive = status === SERVICE_STATUS.ACTIVE;

        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: isActive ? "#00B69B" : "#FF4D4F",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: isActive ? "#00B69B" : "#FF4D4F",
              }}
            />

            {SERVICE_STATUS_LABEL[status]}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      width: 120,

      render: (_, record) => (
        <div className={styles.actionButtons}>
          <Tooltip title="Thông tin dịch vụ">
            <Button
              type="text"
              icon={<Info size={18} />}
              aria-label={`Thông tin ${record.serviceCode}`}
              onClick={() => {
                navigate(buildServiceDetailPath(record.serviceId));
              }}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa dịch vụ">
            <Button
              type="text"
              icon={<SquarePen size={18} />}
              aria-label={`Chỉnh sửa ${record.serviceCode}`}
              onClick={() => {
                navigate(buildServiceEditPath(record.serviceId));
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const selectedServiceCodes = selectedRowKeys.map((key) => {
    const service = services.find((item) => item.serviceId === String(key));

    return service?.serviceCode ?? String(key);
  });

  return (
    <div className={styles.page}>
      {/* ===== BỘ LỌC ===== */}
      <div className={styles.filterArea}>
        {/* TÌM KIẾM */}
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Tìm kiếm</label>

          <Input
            placeholder="Tìm kiếm"
            prefix={<Search size={16} />}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPage(1);
            }}
            allowClear
          />
        </div>

        {/* TRẠNG THÁI HOẠT ĐỘNG */}
        <div className={styles.filterField}>
          <label className={styles.filterLabel}>Trạng thái hoạt động</label>

          <Select
            className={styles.statusSelect}
            classNames={{
              popup: {
                root: styles.statusDropdown,
              },
            }}
            value={statusFilter ?? "ALL"}
            onChange={(value) => {
              setStatusFilter(
                value === "ALL" ? undefined : (value as ServiceStatus),
              );

              setPage(1);
            }}
            options={[
              {
                value: "ALL",
                label: "Tất cả",
              },
              {
                value: SERVICE_STATUS.ACTIVE,
                label: SERVICE_STATUS_LABEL.ACTIVE,
              },
              {
                value: SERVICE_STATUS.INACTIVE,
                label: SERVICE_STATUS_LABEL.INACTIVE,
              },
            ]}
          />
        </div>

        {/* KHOẢNG THỜI GIAN */}
        <div className={styles.dateFilter}>
          <label className={styles.filterLabel}>Chọn thời gian</label>

          <RangePicker
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            onChange={(dates) => {
              setFromDate(dates?.[0]?.format("YYYY-MM-DD"));

              setToDate(dates?.[1]?.format("YYYY-MM-DD"));

              setPage(1);
            }}
          />
        </div>
      </div>
      {/* ===== KHU VỰC BẢNG VÀ THANH CÔNG CỤ ===== */}
      <div className={styles.tableSection}>
        {/* ===== BẢNG DỊCH VỤ ===== */}
        <div className={styles.tableWrapper}>
          <Table<Service>
            rowKey="serviceId"
            columns={columns}
            dataSource={services}
            loading={loading}
            pagination={false}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => {
                setSelectedRowKeys(keys);
              },
            }}
          />
        </div>
        {/* ===== THANH CÔNG CỤ ===== */}
        <div className={styles.toolbarWrapper}>
          <ServiceToolbar
            onAdd={() => {
              navigate(ROUTES.SERVICE_CREATE);
            }}
            onDelete={() => {
              setDeleteModalOpen(true);
            }}
            deleteDisabled={selectedRowKeys.length === 0}
          />
        </div>
      </div>
      {/* ===== PHÂN TRANG ===== */}
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
      <DeleteServiceModal
        open={deleteModalOpen}
        serviceNames={selectedServiceCodes}
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
          }
        }}
        onConfirm={() => void handleDeleteServices()}
      />
    </div>
  );
}
