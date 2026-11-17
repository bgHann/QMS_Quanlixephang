export const SERVICE_HISTORY_STATUS = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN_PROGRESS",
  WAITING: "WAITING",
  ABSENT: "ABSENT",
} as const;

export type ServiceHistoryStatus =
  (typeof SERVICE_HISTORY_STATUS)[keyof typeof SERVICE_HISTORY_STATUS];

export const SERVICE_HISTORY_STATUS_LABEL: Record<
  ServiceHistoryStatus,
  string
> = {
  COMPLETED: "Đã hoàn thành",
  IN_PROGRESS: "Đang thực hiện",
  WAITING: "Đang chờ",
  ABSENT: "Vắng",
};

export interface ServiceHistory {
  id: string;
  serviceId: string;
  ticketNumber: string;
  status: ServiceHistoryStatus;
  performedBy: string;
  usedAt: string;
  counterName: string;
}
