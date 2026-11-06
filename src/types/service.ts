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

export type ServiceAssignmentMethod = "ASSIGN_ON_ISSUE" | "ASSIGN_ON_CALL";

export interface ServiceScheduleDay {
  enabled: boolean;

  // Định dạng HH:mm
  startTime?: string;
  endTime?: string;

  shiftIds: string[];
}

export type ServiceSchedule = Record<string, ServiceScheduleDay>;

export interface Service {
  serviceId: string;
  serviceCode: string;
  serviceName: string;

  counterIds: string[];

  status: ServiceStatus;

  createdAt: string;

  // Thông tin bổ sung
  description?: string;

  assignmentMethod?: ServiceAssignmentMethod;

  // Lịch xử lý
  schedule?: ServiceSchedule;

  // Ảnh đại diện
  imageUrl?: string;
}

export interface ServiceListParams {
  page?: number;
  pageSize?: number;

  keyword?: string;
  status?: ServiceStatus;

  fromDate?: string;
  toDate?: string;
}
