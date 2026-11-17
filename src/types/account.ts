import type { AccountStatus } from '../constants/enums';
import type { ListParams } from './common';

export interface Account {
  accountId: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  status: AccountStatus;
  roleId: string;
  roleName: string;   // thêm: cột "Vai trò" trong bảng
}

// Tìm kiếm danh sách tài khoản (roleId không bắt buộc)
export interface AccountQuery extends ListParams {
  roleId?: string;
  status?: AccountStatus;
}

// Dùng cho trang chi tiết vai trò (bắt buộc có roleId)
export interface AccountListParams extends AccountQuery {
  roleId: string;
}
export interface AccountForm {
  fullName: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  counterIds: string[];   // bắt buộc khi vai trò có quyền "Xử lý quầy"
  status: AccountStatus;
}

// Dữ liệu gửi lên server (không gửi ô nhập lại mật khẩu)
export type AccountCreateBody = Omit<AccountForm, 'confirmPassword'>;

export interface ChangePasswordForm {
  password: string;
  confirmPassword: string;
}