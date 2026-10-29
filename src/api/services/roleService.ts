import axios from 'axios';
import type { ListParams, PageResult } from '../../types/common';
import type { PermissionGroup, Role, RoleForm } from '../../types/role';
import { rolesMock } from '../../mock/roles.mock';
import { permissionGroupsMock } from '../../mock/permissions.mock';
const USE_MOCK = true; // đổi thành false khi backend sẵn sàng
const delay = <T>(data: T, ms = 300) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

let db: Role[] = [...rolesMock];

export const roleService = {
  async getList({ page = 1, pageSize = 10, keyword = '' }: ListParams = {}): Promise<PageResult<Role>> {
    if (!USE_MOCK) {
      const res = await axios.get('/api/v1/roles', { params: { page, pageSize, keyword } });
      return res.data.data;
    }
    const kw = keyword.trim().toLowerCase();
    const filtered = db.filter(
      (r) => !kw || r.roleName.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw),
    );
    const start = (page - 1) * pageSize;
    return delay({ items: filtered.slice(start, start + pageSize), page, pageSize, total: filtered.length });
  },
    async getById(id: string): Promise<Role> {
    if (!USE_MOCK) {
      const res = await axios.get(`/api/v1/roles/${id}`);
      return res.data.data;
    }
    const role = db.find((r) => r.roleId === id);
    if (!role) throw new Error('Không tìm thấy vai trò');
    return delay(role);
  },
  async remove(ids: string[]): Promise<void> {
    if (!USE_MOCK) {
      await axios.delete('/api/v1/roles', { data: { ids } });
      return;
    }
    if (db.some((r) => ids.includes(r.roleId) && r.userCount > 0)) {
      throw new Error('Không thể xóa vai trò đang có tài khoản được phân quyền');
    }
    db = db.filter((r) => !ids.includes(r.roleId));
    return delay(undefined);
  },
  async getPermissionGroups(): Promise<PermissionGroup[]> {
    if (!USE_MOCK) {
      const res = await axios.get('/api/v1/permissions');
      return res.data.data;
    }
    return delay(permissionGroupsMock);
  },

  async create(body: RoleForm): Promise<Role> {
    if (!USE_MOCK) {
      const res = await axios.post('/api/v1/roles', body);
      return res.data.data;
    }
    const role: Role = { ...body, roleId: String(Date.now()), userCount: 0 };
    db = [role, ...db];
    return delay(role);
  },
};