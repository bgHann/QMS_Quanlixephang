import axios from 'axios';
import type { Counter } from '../../types/counter';
import { countersMock } from '../../mock/counters.mock';

const USE_MOCK = true; // đổi false khi backend sẵn sàng
const delay = <T>(data: T, ms = 300) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

export const counterService = {
    // Danh sách quầy để chọn trong form (đường dẫn API tạm, chờ backend)
    async getAll(): Promise<Counter[]> {
        if (!USE_MOCK) {
            const res = await axios.get('/api/v1/counters/options');
            return res.data.data;
        }
        return delay(countersMock);
    },
};