import { HandlingHistory, QueueStats, QueueStatus, QueueTicket } from '../types/counter';

const STATUSES: QueueStatus[] = ['WAITING_ACCEPT', 'WAITING_ASSIGN', 'ASSIGNED', 'ACCEPTED'];

export const MOCK_QUEUE: QueueTicket[] = Array.from({ length: 23 }, (_, i) => ({
    id: String(i + 1),
    number: String(2010001 + i),
    issuedAt: `2022-12-${String(1 + (i % 12)).padStart(2, '0')}T10:07:00`,
    serviceName: 'Khám tim mạch',
    status: STATUSES[i % 4],
}));

export const MOCK_QUEUE_STATS: QueueStats = {
    issued: 40,
    waiting: 6,
    used: 30,
    skipped: 4,
    cancelled: 4,
};

export const MOCK_HISTORY: HandlingHistory[] = [
    { id: 'h1', number: '201015', serviceName: 'Khám tim mạch', staffName: 'Nguyen Van A', result: 'DONE' },
    { id: 'h2', number: '201016', serviceName: 'Khám tim mạch', staffName: 'Nguyen Van A', result: 'TRANSFERRED' },
    { id: 'h3', number: '201016', serviceName: 'Khám tim mạch', staffName: 'Nguyen Van A', result: 'ABSENT' },
    { id: 'h4', number: '201016', serviceName: 'Khám tim mạch', staffName: 'Nguyen Ngoc Bao Chung', result: 'ABSENT' },
    { id: 'h5', number: '201016', serviceName: 'Quầy Dịch Vụ Khách Hàng', staffName: 'Nguyen Van A', result: 'ABSENT' },
];
// Bộ đếm để giả lập số mới, không bao giờ hết
let nextCallNo = 2010100;

export function takeMockTickets(count: number): QueueTicket[] {
    return Array.from({ length: count }, () => {
        const no = nextCallNo++;
        return {
            id: `c${no}`,
            number: String(no),
            issuedAt: new Date().toISOString().slice(0, 19),
            serviceName: 'Khám tim mạch',
            status: 'ACCEPTED' as const,
        };
    });
}