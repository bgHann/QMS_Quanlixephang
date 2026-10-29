import type { PermissionFunction, PermissionGroup } from '../types/role';

const crud = (prefix: string): PermissionFunction[] => [
  { code: `${prefix}_VIEW`, name: 'Xem' },
  { code: `${prefix}_CREATE`, name: 'Thêm' },
  { code: `${prefix}_UPDATE`, name: 'Sửa' },
  { code: `${prefix}_DELETE`, name: 'Xóa' },
];

export const permissionGroupsMock: PermissionGroup[] = [
  { groupCode: 'DASHBOARD', groupName: 'Dashboard', functions: [{ code: 'DASHBOARD_VIEW', name: 'Xem' }] },
  { groupCode: 'DEVICE', groupName: 'Thiết bị', functions: crud('DEVICE') },
  { groupCode: 'SERVICE', groupName: 'Dịch vụ', functions: crud('SERVICE') },
  {
    groupCode: 'COUNTER',
    groupName: 'Quầy dịch vụ',
    functions: [...crud('COUNTER'), { code: 'COUNTER_OPERATE', name: 'Xử lý quầy' }],
  },
  { groupCode: 'TICKET', groupName: 'Cấp số', functions: crud('TICKET') },
  { groupCode: 'RATING', groupName: 'Đánh giá', functions: [{ code: 'RATING_VIEW', name: 'Xem' }] },
  { groupCode: 'SETTINGS', groupName: 'Cài đặt hệ thống', functions: crud('SETTINGS') },
];
export const allPermissionCodes: string[] = permissionGroupsMock.flatMap((g) => g.functions.map((f) => f.code));