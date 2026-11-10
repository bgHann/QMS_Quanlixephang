
import React, { useMemo, useState } from "react";

import {
  Button,
  Card,
  DatePicker,
  Input,
  Select,
  Tooltip,
} from "antd";

import {
  SearchOutlined,
  CalendarOutlined,
  PlusOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

import type { Dayjs } from "dayjs";

import type { Ticket, TicketFilter } from "../../types/ticket";
import { ticketService } from "../../api/services/ticketService";

import IssueTicketModal from "../../components/tickets/IssueTicketModal";
import TicketDetailModal from "../../components/tickets/TicketDetailModal";
import ResetRangeModal from "../../components/tickets/ResetRangeModal";
import TicketListModal from "../../components/tickets/TicketListModal";

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

  const [issueOpen, setIssueOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  // Lấy dữ liệu thống kê
  const statistics = useMemo(
    () => ticketService.getStatistics(),
    [refreshKey]
  );

  // Làm mới dữ liệu
  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Lọc theo thời gian
  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    setFilters((prev) => ({
      ...prev,
      startDate: dates?.[0]?.format("YYYY-MM-DD"),
      endDate: dates?.[1]?.format("YYYY-MM-DD"),
    }));
  };

  // Tìm kiếm
  const handleSearch = (keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
    }));
  };

  // Lọc theo dịch vụ
  const handleServiceChange = (serviceName?: string) => {
    setFilters((prev) => ({
      ...prev,
      serviceName,
    }));
  };

  // Lọc theo trạng thái
  const handleStatusChange = (status?: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status as TicketFilter["status"],
    }));
  };

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

      {/* Table danh sách cấp số */}
      <TicketListModal
        filters={filters}
        refreshKey={refreshKey}
      />

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
