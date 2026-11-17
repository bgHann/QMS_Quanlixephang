import { useEffect, useRef, useState } from 'react';
import { Empty, Input, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './CounterSelectPage.module.css';
import CounterCard from '../../components/counters/CounterCard';
import PaginationBar from '../../components/common/PaginationBar';
import { counterService } from '../../api/services/counterService';
import { MOCK_SERVICE_NAMES } from '../../mock/counters.mock';
import { buildCounterWorkPath } from '../../constants/routes';
import { CounterSummary, CounterUseFilter } from '../../types/counter';

export default function CounterSelectPage() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState('');
    const [debounced, setDebounced] = useState('');
    const [serviceName, setServiceName] = useState<string | undefined>();
    const [use, setUse] = useState<CounterUseFilter | undefined>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [items, setItems] = useState<CounterSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const reqId = useRef(0);

    // Gõ tìm kiếm: chờ 400ms rồi mới lọc, và về trang 1
    useEffect(() => {
        const t = setTimeout(() => {
            setDebounced(keyword);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [keyword]);

    // Gọi API mỗi khi bộ lọc hoặc trang đổi
    useEffect(() => {
        const id = ++reqId.current; // bỏ qua kết quả cũ nếu có request mới hơn
        setLoading(true);

        counterService
            .getList({ keyword: debounced, serviceName, use, page, pageSize })
            .then((res) => {
                if (id !== reqId.current) return;
                setItems(res.items);
                setTotal(res.total);
            })
            .catch(() => {
                if (id === reqId.current) message.error('Không tải được danh sách quầy');
            })
            .finally(() => {
                if (id === reqId.current) setLoading(false);
            });
    }, [debounced, serviceName, use, page, pageSize]);

    const handleSelect = (counter: CounterSummary) => {
        navigate(buildCounterWorkPath(counter.id));
    };

    return (
        <div className={styles.page}>
            {/* Bộ lọc */}
            <div className={styles.filters}>
                <div className={styles.filterItem}>
                    <div className={styles.filterTitle}>Tìm kiếm</div>
                    <Input
                        className={styles.search}
                        placeholder="Tìm kiếm"
                        prefix={<SearchOutlined />}
                        allowClear
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div className={styles.filterItem}>
                    <div className={styles.filterTitle}>Dịch vụ</div>
                    <Select
                        className={styles.select}
                        placeholder="Tất cả"
                        allowClear
                        value={serviceName}
                        options={MOCK_SERVICE_NAMES.map((s) => ({ label: s, value: s }))}
                        onChange={(v) => {
                            setServiceName(v);
                            setPage(1);
                        }}
                    />
                </div>

                <div className={styles.filterItem}>
                    <div className={styles.filterTitle}>Trạng thái sử dụng</div>
                    <Select<CounterUseFilter>
                        className={styles.select}
                        placeholder="Tất cả"
                        allowClear
                        value={use}
                        options={[
                            { label: 'Đang sử dụng', value: 'IN_USE' },
                            { label: 'Chưa sử dụng', value: 'FREE' },
                        ]}
                        onChange={(v) => {
                            setUse(v);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Lưới thẻ quầy */}
            <div className={`${styles.gridWrap} ${loading ? styles.loading : ''}`}>
                {!loading && items.length === 0 ? (
                    <Empty description="Không có quầy phù hợp" />
                ) : (
                    <div className={styles.grid}>
                        {items.map((c) => (
                            <CounterCard key={c.id} counter={c} onClick={handleSelect} />
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.pager}>
                <PaginationBar
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );
}