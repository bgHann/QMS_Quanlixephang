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

// ==================== DEVICE ====================

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
