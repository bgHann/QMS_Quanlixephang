export const SERVICE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type ServiceStatus =
  (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];

export const SERVICE_STATUS_LABEL: Record<ServiceStatus, string> = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngưng hoạt động",
};

export interface Service {
  serviceId: string;
  serviceCode: string;
  serviceName: string;

  counterIds: string[];

  status: ServiceStatus;

  createdAt: string;
}

export interface ServiceListParams {
  page?: number;
  pageSize?: number;

  keyword?: string;
  status?: ServiceStatus;

  fromDate?: string;
  toDate?: string;
}
