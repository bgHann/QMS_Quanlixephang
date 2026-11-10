import { useMemo, useState } from "react";
import { DatePicker, Input, Select, Table } from "antd";
import type { TableColumnsType } from "antd";

import { Search } from "lucide-react";

import PaginationBar from "../common/PaginationBar";

import { serviceHistoryMock } from "../../mock/serviceHistory.mock";

import {
  SERVICE_HISTORY_STATUS,
  SERVICE_HISTORY_STATUS_LABEL,
} from "../../types/serviceHistory";

import type {
  ServiceHistory,
  ServiceHistoryStatus,
} from "../../types/serviceHistory";

import styles from "./ServiceHistoryTable.module.css";

const { RangePicker } = DatePicker;

interface ServiceHistoryTableProps {
  serviceId: string;
}

const STATUS_COLORS: Record<ServiceHistoryStatus, string> = {
  COMPLETED: "#00B69B",
  IN_PROGRESS: "#1677FF",
  WAITING: "#FAAD14",
  ABSENT: "#FF4D4F",
};

export default function ServiceHistoryTable({
  serviceId,
}: ServiceHistoryTableProps) {
  const [searchText, setSearchText] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    ServiceHistoryStatus | undefined
  >();

  const [fromDate, setFromDate] = useState<string>();
  const [toDate, setToDate] = useState<string>();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredHistory = useMemo(() => {
    return serviceHistoryMock.filter((item) => {
      const matchesService = item.serviceId === serviceId;

      const matchesSearch = item.ticketNumber
        .toLowerCase()
        .includes(searchText.trim().toLowerCase());

      const matchesStatus = !statusFilter || item.status === statusFilter;

      const itemDate = item.usedAt.slice(0, 10);

      const matchesFromDate = !fromDate || itemDate >= fromDate;
      const matchesToDate = !toDate || itemDate <= toDate;

      return (
        matchesService &&
        matchesSearch &&
        matchesStatus &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [serviceId, searchText, statusFilter, fromDate, toDate]);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, page, pageSize]);

  const columns: TableColumnsType<ServiceHistory> = [
    {
      title: "Số thứ tự",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
      width: 130,
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "status",
      key: "status",
      width: 190,

      render: (status: ServiceHistoryStatus) => (
        <span
          className={styles.status}
          style={{ color: STATUS_COLORS[status] }}
        >
          <span
            className={styles.statusDot}
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />

          {SERVICE_HISTORY_STATUS_LABEL[status]}
        </span>
      ),
    },
    {
      title: "Người thực hiện",
      dataIndex: "performedBy",
      key: "performedBy",
      width: 170,
    },
    {
      title: "Thời gian sử dụng",
      dataIndex: "usedAt",
      key: "usedAt",
      width: 170,

      render: (value: string) => {
        const date = new Date(value);

        return Number.isNaN(date.getTime())
          ? "-"
          : date.toLocaleDateString("vi-VN");
      },
    },
    {
      title: "Quầy dịch vụ",
      dataIndex: "counterName",
      key: "counterName",
      width: 150,
    },
  ];

  return (
    <div className={styles.history}>
      {/* ===== BỘ LỌC ===== */}
      <div className={styles.filterArea}>
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
                value === "ALL" ? undefined : (value as ServiceHistoryStatus),
              );
              setPage(1);
            }}
            options={[
              { value: "ALL", label: "Tất cả" },
              {
                value: SERVICE_HISTORY_STATUS.COMPLETED,
                label: SERVICE_HISTORY_STATUS_LABEL.COMPLETED,
              },
              {
                value: SERVICE_HISTORY_STATUS.IN_PROGRESS,
                label: SERVICE_HISTORY_STATUS_LABEL.IN_PROGRESS,
              },
              {
                value: SERVICE_HISTORY_STATUS.WAITING,
                label: SERVICE_HISTORY_STATUS_LABEL.WAITING,
              },
              {
                value: SERVICE_HISTORY_STATUS.ABSENT,
                label: SERVICE_HISTORY_STATUS_LABEL.ABSENT,
              },
            ]}
          />
        </div>

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

      {/* ===== BẢNG ===== */}
      <div className={styles.tableWrapper}>
        <Table<ServiceHistory>
          rowKey="id"
          columns={columns}
          dataSource={paginatedHistory}
          pagination={false}
          scroll={{ x: 800 }}
          locale={{ emptyText: "Chưa có lịch sử sử dụng dịch vụ" }}
        />
      </div>

      {/* ===== PHÂN TRANG ===== */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={filteredHistory.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
