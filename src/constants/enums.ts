import { TicketStatus } from "../types/ticket";

// ==================== TÀI KHOẢN ====================
export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  ACTIVE: "Hoạt động",
  SUSPENDED: "Ngưng hoạt động",
};

// ==================== THIẾT LẬP GIAO DIỆN ====================
export const THEME_COLORS = [
  "#4D8F8B", "#5B9A28", "#1E5B3A", "#2BB3A6", "#2E7DB8",
  "#6F4BB8", "#FF7506", "#E5484D", "#D6336C", "#7A5C3E",
] as const;

export const VOICE_OPTIONS = [
  { value: "south", label: "Miền Nam" },
  { value: "north", label: "Miền Bắc" },
] as const;

export const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

// Cụm thông tin chèn vào câu đọc
export const TEMPLATE_TOKENS = [
  { key: "{soThuTu}", label: "Số thứ tự" },
  { key: "{quayTen}", label: "Số/quầy tên" },
] as const;

export const SAMPLE_TEMPLATES = [
  "Kính mời khách hàng có số {soThuTu} đến quầy {quayTen} để được phục vụ.",
  "Xin mời số thứ tự {soThuTu} đến quầy {quayTen}",
  "Quý khách mang số {soThuTu}, vui lòng di chuyển đến quầy {quayTen} để tiếp tục giao dịch.",
];

// ==================== CẤP SỐ ====================
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

// ==================== THIẾT BỊ ====================

// Loại thiết bị
export const DEVICE_TYPE = {
  KIOSK: "KIOSK",
  MAIN_DISPLAY: "MAIN_DISPLAY",
  COUNTER_DISPLAY: "COUNTER_DISPLAY",
  RATING_DEVICE: "RATING_DEVICE",
} as const;

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

// Trạng thái khả dụng
export const DEVICE_AVAILABILITY = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
} as const;

export type DeviceAvailability =
  (typeof DEVICE_AVAILABILITY)[keyof typeof DEVICE_AVAILABILITY];

// Trạng thái kết nối
export const CONNECTION_STATUS = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
} as const;

export type ConnectionStatus =
  (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

export const CONNECTION_STATUS_LABEL: Record<ConnectionStatus, string> = {
  CONNECTED: "Kết nối",
  DISCONNECTED: "Mất kết nối",
};

export const DEVICE_AVAILABILITY_LABEL: Record<DeviceAvailability, string> = {
  AVAILABLE: "Khả dụng",
  UNAVAILABLE: "Không khả dụng",
};