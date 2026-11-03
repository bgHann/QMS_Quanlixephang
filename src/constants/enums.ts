import { TicketStatus } from "../types/ticket";

export const ACCOUNT_STATUS = { ACTIVE: 'ACTIVE', SUSPENDED: 'SUSPENDED' } as const;
export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Ngưng hoạt động',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  WAITING: "Đang chờ",
  PROCESSING: "Đang sử dụng",
  COMPLETED: "Đã sử dụng",
  SKIPPED: "Bỏ qua",
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  WAITING: "#faad14",
  PROCESSING: "#1677ff",
  COMPLETED: "#16a34a",
  SKIPPED: "#ef4444",
};