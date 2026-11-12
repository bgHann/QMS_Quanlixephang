import { UserOutlined } from '@ant-design/icons';
import styles from './CounterCard.module.css';
import { CounterSummary } from '../../types/counter';

interface Props {
    counter: CounterSummary;
    onClick: (counter: CounterSummary) => void;
}

const MAX_TAGS = 5;

export default function CounterCard({ counter, onClick }: Props) {
    const shown = counter.services.slice(0, MAX_TAGS);
    const rest = counter.services.length - shown.length;

    return (
        <div
            className={`${styles.card} ${counter.inUse ? styles.inUse : ''}`}
            onClick={() => onClick(counter)}
        >
            <div className={styles.head}>
                <img
                    className={styles.photo}
                    src={`${process.env.PUBLIC_URL}/images/templates/counter-bg.jpg`}
                    alt=""
                />
                <div className={styles.headText}>
                    <div className={styles.nameRow}>
                        {!counter.inUse && <UserOutlined />}
                        <span>{counter.name}</span>
                    </div>
                    <div className={styles.code}>{counter.deviceCode}</div>
                </div>
            </div>

            <div className={styles.body}>
                {shown.map((s) => (
                    <span key={s} className={styles.tag}>
                        {s}
                    </span>
                ))}
                {rest > 0 && <span className={styles.tag}>+{rest}</span>}
            </div>
        </div>
    );
}