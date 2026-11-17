import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CounterWorkPage.module.css';
import CounterHeader from '../../components/counters/CounterHeader';
import QueuePanel from '../../components/counters/QueuePanel';
import CallPanel from '../../components/counters/CallPanel';
import { counterService } from '../../api/services/counterService';
import { CounterSummary, QueueStats } from '../../types/counter';

export default function CounterWorkPage() {
    const { counterId = '' } = useParams();

    const [counter, setCounter] = useState<CounterSummary | null>(null);
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        counterService.getSummary(counterId).then((c) => setCounter(c ?? null));
    }, [counterId]);

    useEffect(() => {
        counterService.getQueueStats(counterId).then(setStats);
    }, [counterId, refreshKey]);

    return (
        <div className={styles.page}>
            <CounterHeader title={counter?.name ?? 'Quầy dịch vụ'} />

            <div className={styles.body}>
                <QueuePanel
                    counterId={counterId}
                    serviceName={counter?.services[0] ?? ''}
                    stats={stats}
                    refreshKey={refreshKey}
                />

                <CallPanel
                    counterId={counterId}
                    waiting={stats?.waiting ?? 0}
                    onChanged={() => setRefreshKey((k) => k + 1)}
                />
            </div>
        </div>
    );
}