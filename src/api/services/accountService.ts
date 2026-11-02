import axios from 'axios';
import type { PageResult } from '../../types/common';
import type { Account, AccountListParams, AccountQuery } from '../../types/account';
import { accountsMock } from '../../mock/accounts.mock';
import type { AccountCreateBody } from '../../types/account';
import { rolesMock } from '../../mock/roles.mock';

const USE_MOCK = true; // đổi false khi backend sẵn sàng
const delay = <T>(data: T, ms = 300) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

let db: Account[] = [...accountsMock];

// Lọc + phân trang dữ liệu giả (dùng chung cho 2 hàm lấy danh sách)
function queryMock({ page = 1, pageSize = 10, keyword = '', status, roleId }: AccountQuery): PageResult<Account> {
  const kw = keyword.trim().toLowerCase();
  const filtered = db.filter(
    (a) =>
      (!roleId || a.roleId === roleId) &&
      (!status || a.status === status) &&
      (!kw || [a.username, a.fullName, a.phone, a.email].some((v) => v.toLowerCase().includes(kw))),
  );
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length };
}

export const accountService = {
  // Danh sách tất cả tài khoản (màn Quản lý tài khoản)
  async getList(query: AccountQuery = {}): Promise<PageResult<Account>> {
    if (!USE_MOCK) {
      const res = await axios.get('/api/v1/accounts', { params: query });
      return res.data.data;
    }
    return delay(queryMock(query));
  },
  async create(body: AccountCreateBody): Promise<Account> {
    if (!USE_MOCK) {
      const res = await axios.post('/api/v1/accounts', body);
      return res.data.data;
    }
    if (db.some((a) => a.username === body.username)) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }
    const account: Account = {
      accountId: String(Date.now()),
      username: body.username,
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      status: body.status,
      roleId: body.roleId,
      roleName: rolesMock.find((r) => r.roleId === body.roleId)?.roleName ?? '',
    };
    db = [account, ...db];
    return delay(account);
  },

  async changePassword(accountId: string, newPassword: string): Promise<void> {
    if (!USE_MOCK) {
      await axios.put(`/api/v1/accounts/${accountId}/password`, { newPassword });
      return;
    }
    return delay(undefined);
  },

  // Danh sách tài khoản của một vai trò (màn Chi tiết vai trò)
  async getListByRole(query: AccountListParams): Promise<PageResult<Account>> {
    if (!USE_MOCK) {
      const { roleId, ...params } = query;
      const res = await axios.get(`/api/v1/roles/${roleId}/accounts`, { params });
      return res.data.data;
    }
    return delay(queryMock(query));
  },

  async remove(ids: string[]): Promise<void> {
    if (!USE_MOCK) {
      await axios.delete('/api/v1/accounts', { data: { ids } });
      return;
    }
    db = db.filter((a) => !ids.includes(a.accountId));
    return delay(undefined);
  },
};