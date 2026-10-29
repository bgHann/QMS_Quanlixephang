import axios from 'axios';
import type { PageResult } from '../../types/common';
import type { Account, AccountListParams } from '../../types/account';
import { accountsMock } from '../../mock/accounts.mock';

const USE_MOCK = true; // đổi false khi backend sẵn sàng
const delay = <T>(data: T, ms = 300) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

let db: Account[] = [...accountsMock];

export const accountService = {
  async getListByRole({
    roleId, page = 1, pageSize = 10, keyword = '', status,
  }: AccountListParams): Promise<PageResult<Account>> {
    if (!USE_MOCK) {
      const res = await axios.get(`/api/v1/roles/${roleId}/accounts`, {
        params: { page, pageSize, keyword, status },
      });
      return res.data.data;
    }
    const kw = keyword.trim().toLowerCase();
    const filtered = db.filter(
      (a) =>
        a.roleId === roleId &&
        (!status || a.status === status) &&
        (!kw || [a.username, a.fullName, a.phone, a.email].some((v) => v.toLowerCase().includes(kw))),
    );
    const start = (page - 1) * pageSize;
    return delay({ items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length });
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