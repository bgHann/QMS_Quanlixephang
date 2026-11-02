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
}

export interface AccountListParams extends ListParams {
  roleId: string;
  status?: AccountStatus;
}