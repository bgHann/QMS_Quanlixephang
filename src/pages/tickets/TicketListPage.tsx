import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Table,
  Tooltip,
} from "antd";

import {
  SearchOutlined,
  CalendarOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";

import { Ticket, TicketFilter } from "../../types/ticket";
import { ticketService } from "../../api/services/ticketService";

import StatusTag from "../../components/common/StatusTag";
import IssueTicketModal from "../../components/tickets/IssueTicketModal";
import TicketDetailModal from "../../components/tickets/TicketDetailModal";
import ResetRangeModal from "../../components/tickets/ResetRangeModal";

import styles from "./TicketListPage.module.css";

const { RangePicker } = DatePicker;

const serviceOptions = [
  "Khám sản - Phụ Khoa",
  "Khám tim mạch",
  "Khám răng hàm mặt",
  "Khám tai mũi họng",
  "Khám hô hấp",
];

const TicketListPage: React.FC = () => {
  const [filters, setFilters] = useState<TicketFilter>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [issueOpen, setIssueOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tickets = useMemo(
    () => ticketService.search(filters),
    [filters, refreshKey]
  );

  const statistics = useMemo(
    () => ticketService.getStatistics(),
    [refreshKey]
  );

  const pagedTickets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tickets.slice(start, start + pageSize);
  }, [tickets, page, pageSize]);

  const totalPages = Math.max(
    1,
    Math.ceil(tickets.length / pageSize)
  );

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dates?.[0]?.format("YYYY-MM-DD"),
      endDate: dates?.[1]?.format("YYYY-MM-DD"),
    }));

    setPage(1);
  };

  const handleSearch = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
    }));

    setPage(1);
  };

  const handleServiceChange = (serviceName?: string) => {
    setFilters((prev) => ({
      ...prev,
      serviceName,
    }));

    setPage(1);
  };

  const handleStatusChange = (status?: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as TicketFilter["status"],
    }));

    setPage(1);
  };

  const columns: ColumnsType<Ticket> = [
    {
      title: "Số thứ tự",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
      width: 100,
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      width: 190,
    },
    {
      title: "Thời gian cấp",
      dataIndex: "issueTime",
      key: "issueTime",
      width: 145,
    },
    {
      title: "Thời gian sử dụng",
      dataIndex: "useTime",
      key: "useTime",
      width: 145,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 125,
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Người thực hiện",
      dataIndex: "staffName",
      key: "staffName",
      width: 140,
    },
    {
      title: "Quầy dịch vụ",
      dataIndex: "counterName",
      key: "counterName",
      width: 120,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={styles.activeTab}>
          Danh sách cấp số
        </button>

        <button
          className={styles.tab}
          onClick={() => {
            window.location.href = "/tickets/rules";
          }}
        >
          Cài đặt quy tắc
        </button>
      </div>

      {/* Statistics */}
      <div className={styles.statistics}>
        <Card className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statLabel}>
            Số thứ tự đã cấp
          </div>

          <div className={styles.statValue}>
            {statistics.totalIssued.toLocaleString("vi-VN")}
          </div>

          <div className={styles.statFooter}>
            <span>↑ 10%</span> so với kỳ trước
          </div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statYellow}`}>
          <div className={styles.statLabel}>
            Số thứ tự đang chờ
          </div>

          <div className={styles.statValue}>
            {statistics.waiting.toLocaleString("vi-VN")}
          </div>

          <div className={styles.statFooter}>
            <span>↓ 10%</span> so với kỳ trước
          </div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statLabel}>
            Số thứ tự đã sử dụng
          </div>

          <div className={styles.statValue}>
            {statistics.inUse.toLocaleString("vi-VN")}
          </div>

          <div className={styles.statFooter}>
            <span>↑ 10%</span> so với kỳ trước
          </div>
        </Card>

        <Card className={`${styles.statCard} ${styles.statPurple}`}>
          <div className={styles.statLabel}>
            Số thứ tự bỏ qua
          </div>

          <div className={styles.statValue}>
            {statistics.skipped.toLocaleString("vi-VN")}
          </div>

          <div className={styles.statFooter}>
            <span>↑ 10%</span> so với kỳ trước
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {/* Tìm kiếm */}
        <div className={styles.filterItem}>
          <div className={styles.filterTitle}>
            Tìm kiếm
          </div>

          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(event) =>
              handleSearch(event.target.value)
            }
          />
        </div>

        {/* Tên dịch vụ */}
        <div className={styles.filterItem}>
          <div className={styles.filterTitle}>
            Tên dịch vụ
          </div>

          <Select
            placeholder="Tên dịch vụ"
            allowClear
            options={serviceOptions.map((service) => ({
              label: service,
              value: service,
            }))}
            onChange={handleServiceChange}
          />
        </div>

        {/* Trạng thái */}
        <div className={styles.filterItem}>
          <div className={styles.filterTitle}>
            Trạng thái
          </div>

          <Select
            placeholder="Trạng thái"
            allowClear
            options={[
              { label: "Đang chờ", value: "WAITING" },
              { label: "Đang sử dụng", value: "PROCESSING" },
              { label: "Đã sử dụng", value: "COMPLETED" },
              { label: "Bỏ qua", value: "SKIPPED" },
            ]}
            onChange={handleStatusChange}
          />
        </div>

        {/* Chọn thời gian */}
        <div className={styles.filterDate}>
          <div className={styles.filterTitle}>
            Chọn thời gian
          </div>

          <RangePicker
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
            suffixIcon={<CalendarOutlined />}
            onChange={(dates) =>
              handleDateChange(
                dates as [Dayjs | null, Dayjs | null] | null
              )
            }
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <Table<Ticket>
          columns={columns}
          dataSource={pagedTickets}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ x: 1100 }}
          rowClassName={(record) =>
            record.status === "PROCESSING"
              ? styles.highlightRow
              : ""
          }
        />
      </div>

      {/* Footer */}
      <div className={styles.tableFooter}>
        <div className={styles.pageSize}>
          <span>Đang hiển thị</span>

          <Select
            value={pageSize}
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
            ]}
            onChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            style={{ width: 60 }}
          />

          <span>kết quả</span>
        </div>

        <div className={styles.pagination}>
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ‹ Trước
          </Button>

          <span>
            {page} / {totalPages}
          </span>

          <Button
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Sau ›
          </Button>
        </div>
      </div>

      {/* Floating actions */}
      <div className={styles.actionButtons}>
        <Tooltip title="Thiết lập dải số">
          <Button
            icon={<FileTextOutlined />}
            onClick={() => setResetOpen(true)}
          />
        </Tooltip>

        <Tooltip title="Cấp số mới">
          <Button
            icon={<PlusOutlined />}
            onClick={() => setIssueOpen(true)}
          />
        </Tooltip>
      </div>

      {/* Modals */}
      <IssueTicketModal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        onSuccess={refresh}
      />

      <TicketDetailModal
        open={detailOpen}
        ticket={selectedTicket}
        onClose={() => setDetailOpen(false)}
      />

      <ResetRangeModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
};

export default TicketListPage;