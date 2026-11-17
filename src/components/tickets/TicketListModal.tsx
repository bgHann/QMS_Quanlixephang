import React, { useEffect, useMemo, useState } from "react";
import { Button, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

import type { Ticket, TicketFilter } from "../../types/ticket";
import { ticketService } from "../../api/services/ticketService";
import StatusTag from "../common/StatusTag";

import styles from "./TicketList.module.css";

interface TicketListModalProps {
  filters: TicketFilter;
  refreshKey: number;
  pageSize?: number;
}

const TicketListModal: React.FC<TicketListModalProps> = ({
  filters,
  refreshKey,
  pageSize: initialPageSize = 10,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Đồng bộ pageSize khi cha thay đổi
  useEffect(() => {
    setPageSize(initialPageSize);
    setPage(1);
  }, [initialPageSize]);

  // Lấy dữ liệu từ ticketService
  const tickets = useMemo(
    () => ticketService.search(filters),
    [filters, refreshKey],
  );

  // Tính tổng số trang
  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));

  // Lấy dữ liệu theo trang
  const pagedTickets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return tickets.slice(start, start + pageSize);
  }, [tickets, page, pageSize]);

  // Các cột của bảng
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
    <div className={styles.tableWrapper}>
      {/* Table danh sách cấp số */}
      <div className={styles.tableContainer}>
        <Table<Ticket>
          columns={columns}
          dataSource={pagedTickets}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ x: 1100 }}
          rowClassName={(record) =>
            record.status === "PROCESSING" ? styles.highlightRow : ""
          }
        />
      </div>

      {/* Footer và phân trang */}
      <div className={styles.tableFooter}>
        <div className={styles.pageSize}>
          <span>Đang hiển thị</span>

          <Select
            value={pageSize}
            options={[
              { label: "5", value: 5 },
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
    </div>
  );
};

export default TicketListModal;
