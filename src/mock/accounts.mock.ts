import { ACCOUNT_STATUS } from '../constants/enums';
import type { Account } from '../types/account';

const makeAccounts = (roleId: string, count: number): Account[] =>
  Array.from({ length: count }, (_, i) => ({
    accountId: `${roleId}-${i + 1}`,
    username: `tuyetnguyen@${12 + i}`,
    fullName: 'Nguyen Van A',
    phone: '0919256712',
    email: 'tuyetnguyen123@gmail.com',
    status: i % 3 === 1 ? ACCOUNT_STATUS.SUSPENDED : ACCOUNT_STATUS.ACTIVE,
    roleId,
  }));

// Khớp userCount trong roles.mock.ts (vai trò "Quản lý" id 4 có 0 người nên bảng trống)
export const accountsMock: Account[] = ['1', '2', '3', '5', '6'].flatMap((id) => makeAccounts(id, 6));