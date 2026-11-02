export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  userCount: number;
  permissions: string[];
}
export type RoleForm = Pick<Role, 'roleName' | 'description' | 'permissions'>;

export interface PermissionFunction {
  code: string;   // mã quyền, ví dụ DEVICE_VIEW
  name: string;   // tên hiển thị
}
export interface PermissionGroup {
  groupCode: string;
  groupName: string;
  functions: PermissionFunction[];
}