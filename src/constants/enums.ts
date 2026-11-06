export const ACCOUNT_STATUS = { ACTIVE: 'ACTIVE', SUSPENDED: 'SUSPENDED' } as const;
export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Ngưng hoạt động',
};
export const THEME_COLORS = [
  '#4D8F8B', '#5B9A28', '#1E5B3A', '#2BB3A6', '#2E7DB8',
  '#6F4BB8', '#FF7506', '#E5484D', '#D6336C', '#7A5C3E',
] as const;
export const VOICE_OPTIONS = [
  { value: 'south', label: 'Miền Nam' },
  { value: 'north', label: 'Miền Bắc' },
] as const;

export const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

// Cụm thông tin chèn vào câu đọc
export const TEMPLATE_TOKENS = [
  { key: '{soThuTu}', label: 'Số thứ tự' },
  { key: '{quayTen}', label: 'Số/quầy tên' },
] as const;

export const SAMPLE_TEMPLATES = [
  'Kính mời khách hàng có số {soThuTu} đến quầy {quayTen} để được phục vụ.',
  'Xin mời số thứ tự {soThuTu} đến quầy {quayTen}',
  'Quý khách mang số {soThuTu}, vui lòng di chuyển đến quầy {quayTen} để tiếp tục giao dịch.',
];