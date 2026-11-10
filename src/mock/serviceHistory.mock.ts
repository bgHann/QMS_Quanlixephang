import type { ServiceHistory } from "../types/serviceHistory";

export const serviceHistoryMock: ServiceHistory[] = [
  {
    id: "1",
    serviceId: "service-03",
    ticketNumber: "2010001",
    status: "COMPLETED",
    performedBy: "Nguyễn Văn A",
    usedAt: "2026-11-06T09:00:00",
    counterName: "Phòng số 1",
  },
  {
    id: "2",
    serviceId: "service-03",
    ticketNumber: "2010002",
    status: "ABSENT",
    performedBy: "Nguyễn Văn A",
    usedAt: "2026-11-06T09:15:00",
    counterName: "Phòng số 1",
  },
  {
    id: "3",
    serviceId: "service-03",
    ticketNumber: "2010003",
    status: "IN_PROGRESS",
    performedBy: "Nguyễn Văn A",
    usedAt: "2026-11-06T09:30:00",
    counterName: "Phòng số 1",
  },
  {
    id: "4",
    serviceId: "service-03",
    ticketNumber: "2010004",
    status: "WAITING",
    performedBy: "Nguyễn Văn B",
    usedAt: "2026-11-06T09:45:00",
    counterName: "Phòng số 2",
  },
];
