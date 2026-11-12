import axios from 'axios';
import type { Counter } from '../../types/counter';
import { countersMock } from '../../mock/counters.mock';
import { takeMockTickets } from '../../mock/counterQueue.mock';
import type {
    CounterSummary,
    CounterListParams,
    QueueTicket,
    QueueListParams,
    QueueStats,
    HandlingHistory,
} from '../../types/counter'; // Điều chỉnh lại đường dẫn type cho khớp với dự án của bạn
import type { PageResult } from '../../types/common';
import { MOCK_COUNTERS } from '../../mock/counters.mock'; // Điều chỉnh lại đường dẫn mock cho khớp nếu cần
import {
    MOCK_QUEUE,
    MOCK_QUEUE_STATS,
    MOCK_HISTORY
} from '../../mock/counterQueue.mock'; // Đường dẫn chứa các biến mock hàng đợi

const USE_MOCK = true; // đổi false khi backend sẵn sàng
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const counterService = {
    // Danh sách quầy để chọn trong form (đường dẫn API tạm, chờ backend)
    async getAll(): Promise<Counter[]> {
        if (!USE_MOCK) {
            const res = await axios.get('/api/v1/counters/options');
            return res.data.data;
        }
        return delay(300).then(() => countersMock);
    },

    // Lấy danh sách phân trang và lọc quầy
    async getList(params: CounterListParams): Promise<PageResult<CounterSummary>> {
        if (USE_MOCK) {
            await delay(300);
            const kw = (params.keyword ?? '').trim().toLowerCase();
            const filtered = MOCK_COUNTERS.filter(
                (c) =>
                    (!kw || c.name.toLowerCase().includes(kw) || c.deviceCode.toLowerCase().includes(kw)) &&
                    (!params.serviceName || c.services.includes(params.serviceName)) &&
                    (!params.use || (params.use === 'IN_USE') === c.inUse),
            );
            const start = (params.page - 1) * params.pageSize;
            return {
                items: filtered.slice(start, start + params.pageSize),
                page: params.page,
                pageSize: params.pageSize,
                total: filtered.length,
            };
        }
        const res = await axios.get('/counters', { params }); // Hoặc axiosClient tùy theo cách cấu hình dự án của bạn
        return res.data;
    },

    // Lấy thông tin tóm tắt của một quầy
    async getSummary(counterId: string): Promise<CounterSummary | undefined> {
        if (USE_MOCK) {
            await delay();
            return MOCK_COUNTERS.find((c) => c.id === counterId);
        }
        const res = await axios.get(`/counters/${counterId}`); // đường dẫn tạm
        return res.data;
    },

    // Lấy thống kê hàng đợi của quầy
    async getQueueStats(counterId: string): Promise<QueueStats> {
        if (USE_MOCK) {
            await delay(200);
            return { ...MOCK_QUEUE_STATS };
        }
        const res = await axios.get(`/counters/${counterId}/stats`);
        return res.data;
    },

    // Lấy danh sách vé trong hàng đợi của quầy có phân trang và lọc
    async getQueue(counterId: string, params: QueueListParams): Promise<PageResult<QueueTicket>> {
        if (USE_MOCK) {
            await delay();
            const kw = (params.keyword ?? '').trim().toLowerCase();
            const filtered = MOCK_QUEUE.filter(
                (t) =>
                    (!kw || t.number.includes(kw) || t.serviceName.toLowerCase().includes(kw)) &&
                    (!params.status || t.status === params.status) &&
                    (!params.startDate || t.issuedAt.slice(0, 10) >= params.startDate) &&
                    (!params.endDate || t.issuedAt.slice(0, 10) <= params.endDate),
            );
            const start = (params.page - 1) * params.pageSize;
            return {
                items: filtered.slice(start, start + params.pageSize),
                page: params.page,
                pageSize: params.pageSize,
                total: filtered.length,
            };
        }
        const res = await axios.get(`/counters/${counterId}/queue`, { params });
        return res.data;
    },

    // Lấy lịch sử xử lý của quầy
    async getHistory(counterId: string): Promise<HandlingHistory[]> {
        if (USE_MOCK) {
            await delay(200);
            return MOCK_HISTORY.slice(0, 20);
        }
        const res = await axios.get(`/counters/${counterId}/history`);
        return res.data;
    },

    // Gọi số kế tiếp. Nếu đang có số hiện tại thì số đó được ghi là "Hoàn thành"
    // Gọi tối đa `count` số kế tiếp
    async callBatch(counterId: string, count: number): Promise<QueueTicket[]> {
        if (USE_MOCK) {
            await delay(200);
            MOCK_QUEUE_STATS.waiting = Math.max(0, MOCK_QUEUE_STATS.waiting - count);
            return takeMockTickets(count);
        }
        const res = await axios.post(`/counters/${counterId}/call`, { count });
        return res.data;
    },

    // Hoàn thành hoặc bỏ qua (vắng) các số được chọn
    async finishTickets(
        counterId: string,
        tickets: QueueTicket[],
        result: 'DONE' | 'ABSENT',
    ): Promise<void> {
        if (USE_MOCK) {
            await delay(200);
            tickets.forEach((t) =>
                MOCK_HISTORY.unshift({
                    id: `h${Date.now()}-${t.id}`,
                    number: t.number,
                    serviceName: t.serviceName,
                    staffName: 'Nguyen Van A',
                    result,
                }),
            );
            if (result === 'DONE') MOCK_QUEUE_STATS.used += tickets.length;
            else MOCK_QUEUE_STATS.skipped += tickets.length;
            return;
        }
        await axios.post(`/counters/${counterId}/finish`, {
            ticketIds: tickets.map((t) => t.id),
            result,
        });
    },
};