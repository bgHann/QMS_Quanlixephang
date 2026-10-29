
import type { Role } from '../types/role';

const desc = 'Thực hiện nhiệm vụ về thống kê số liệu và tổng hợp số liệu';

export const rolesMock: Role[] = [
  {
    roleId: '1',
    roleName: 'Kế toán',
    description: desc,
    userCount: 6,
    permissions: ['DASHBOARD_VIEW', 'RATING_VIEW'],
  },
  {
    roleId: '2',
    roleName: 'Bác sĩ',
    description: desc,
    userCount: 6,
    permissions: ['DASHBOARD_VIEW', 'TICKET_VIEW'],
  },
  {
    roleId: '3',
    roleName: 'Lễ tân',
    description: desc,
    userCount: 6,
    permissions: [
      'DASHBOARD_VIEW',
      'TICKET_VIEW',
      'TICKET_CREATE',
    ],
  },
  {
    roleId: '4',
    roleName: 'Quản lý',
    description: desc,
    userCount: 0,
    permissions: [
      'DASHBOARD_VIEW',
      'TICKET_VIEW',
      'TICKET_CREATE',
      'RATING_VIEW',
    ],
  },
  {
    roleId: '5',
    roleName: 'Admin',
    description: desc,
    userCount: 6,
    permissions: [
      'DASHBOARD_VIEW',
      'TICKET_VIEW',
      'TICKET_CREATE',
      'RATING_VIEW',
    ],
  },
  {
    roleId: '6',
    roleName: 'Superadmin',
    description: desc,
    userCount: 6,
    permissions: [
      'DASHBOARD_VIEW',
      'TICKET_VIEW',
      'TICKET_CREATE',
      'RATING_VIEW',
    ],
  },
];
