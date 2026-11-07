export type TicketStatus =
  | "WAITING"
  | "PROCESSING"
  | "COMPLETED"
  | "SKIPPED";

export interface Ticket {
  id: string;
  ticketNumber: string;
  serviceName: string;
  issueTime: string;
  useTime: string;
  status: TicketStatus;
  staffName: string;
  counterName: string;
}

export interface TicketFilter {
  keyword?: string;
  serviceName?: string;
  status?: TicketStatus | "";
  startDate?: string;
  endDate?: string;
}

export interface TicketStatistics {
  totalIssued: number;
  waiting: number;
  inUse: number;
  skipped: number;
}

export interface PageResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TicketRule {
  id: string;
  serviceName: string;
  prefix: string;
  startNumber: number;
  endNumber: number;
  currentNumber: number;
  resetDaily: boolean;
}