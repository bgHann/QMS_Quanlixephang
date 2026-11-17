import { ACCOUNT_STATUS } from '../constants/enums';
import type { Account } from '../types/account';

const makeAccounts = (roleId: string, roleName: string, count: number): Account[] =>
  Array.from({ length: count }, (_, i) => ({
    accountId: `${roleId}-${i + 1}`,
    username: `tuyetnguyen@${12 + i}`,
    fullName: 'Nguyen Van A',
    phone: '0919256712',
    email: 'tuyetnguyen123@gmail.com',
    status: i % 3 === 1 ? ACCOUNT_STATUS.SUSPENDED : ACCOUNT_STATUS.ACTIVE,
    roleId,
    roleName,
  }));

// Khớp id và tên với roles.mock.ts (vai trò "Quản lý" id 4 có 0 người nên không có ở đây)
const roles: [string, string][] = [
  ['1', 'Kế toán'],
  ['2', 'Bác sĩ'],
  ['3', 'Lễ tân'],
  ['5', 'Admin'],
  ['6', 'Superadmin'],
];

export const accountsMock: Account[] = roles.flatMap(([id, name]) => makeAccounts(id, name, 6));