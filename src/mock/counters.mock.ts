import type { Counter } from '../types/counter';
import { CounterSummary } from '../types/counter';

export const countersMock: Counter[] = [1, 2, 3, 4, 5].map((n) => ({
    counterId: String(n),
    counterCode: `Q${n}`,
    counterName: `Quầy số ${n}`,
}));
export const MOCK_SERVICE_NAMES = [
    'Khám tim mạch',
    'Khám tổng quát',
    'Nội soi',
    'Khám sản - Phụ Khoa',
    'Khám răng hàm mặt',
    'Khám tai mũi họng',
    'Khám hô hấp',
];

export const MOCK_COUNTERS: CounterSummary[] = Array.from({ length: 23 }, (_, i) => ({
    id: String(i + 1),
    name: `Quầy số ${i + 1}`,
    deviceCode: `PC_${String(i + 1).padStart(2, '0')}`,
    services: MOCK_SERVICE_NAMES.slice(0, 3 + (i % 5)),
    inUse: i % 3 === 1,
}));