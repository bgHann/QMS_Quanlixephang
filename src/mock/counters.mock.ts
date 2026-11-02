import type { Counter } from '../types/counter';

export const countersMock: Counter[] = [1, 2, 3, 4, 5].map((n) => ({
    counterId: String(n),
    counterCode: `Q${n}`,
    counterName: `Quầy số ${n}`,
}));