export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
export interface ListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}