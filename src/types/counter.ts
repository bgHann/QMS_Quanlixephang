export interface Counter {
    counterId: string;
    counterCode: string;
    counterName: string;
}
export interface CounterSummary {
    id: string;
    name: string;        // "Quầy số 1"
    deviceCode: string;  // "PC_01"
    services: string[];  // các dịch vụ quầy đang phục vụ
    inUse: boolean;      // thẻ cam = đang sử dụng (xem ghi chú cuối)
}

export type CounterUseFilter = 'IN_USE' | 'FREE';

export interface CounterQuery {
    keyword?: string;
    serviceName?: string;
    use?: CounterUseFilter;
}

export interface CounterListParams extends CounterQuery {
    page: number;
    pageSize: number;
}
// ===== Màn làm việc của quầy =====
export type QueueStatus = 'WAITING_ACCEPT' | 'WAITING_ASSIGN' | 'ASSIGNED' | 'ACCEPTED';

export interface QueueTicket {
    id: string;
    number: string;      // "2010001"
    issuedAt: string;    // ISO: "2022-12-12T10:07:00"
    serviceName: string;
    status: QueueStatus;
}

export interface QueueQuery {
    keyword?: string;
    status?: QueueStatus;
    startDate?: string;  // "YYYY-MM-DD"
    endDate?: string;
}

export interface QueueListParams extends QueueQuery {
    page: number;
    pageSize: number;
}

export interface QueueStats {
    issued: number;
    waiting: number;
    used: number;
    skipped: number;
    cancelled: number;
}

export type HistoryResult = 'DONE' | 'TRANSFERRED' | 'ABSENT';

export interface HandlingHistory {
    id: string;
    number: string;
    serviceName: string;
    staffName: string;
    result: HistoryResult;
}
export type CallState = 'PROCESSING' | 'DONE' | 'ABSENT';

export interface CallingTicket extends QueueTicket {
    callState: CallState; // đang xử lý / hoàn thành / vắng
}