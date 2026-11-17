import { useEffect, useRef, useState } from 'react';
import type { Key } from 'react';
import { DatePicker, Input, Select, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CalendarOutlined, EditOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { ClipboardList } from 'lucide-react';
import dayjs from 'dayjs';
import StartCart from '../dashboard/topCard/StartCart/StartCart';
import PaginationBar from '../common/PaginationBar';
import { counterService } from '../../api/services/counterService';
import { QUEUE_STATUS_COLOR, QUEUE_STATUS_LABEL } from '../../constants/enums';
import { QueueStats, QueueStatus, QueueTicket } from '../../types/counter';
import styles from './QueuePanel.module.css';

const { RangePicker } = DatePicker;

interface Props {
    counterId: string;
    serviceName: string;
    stats: QueueStats | null;
    refreshKey: number;
}

export default function QueuePanel({ counterId, serviceName, stats, refreshKey }: Props) {
    const [keyword, setKeyword] = useState('');
    const [debounced, setDebounced] = useState('');
    const [status, setStatus] = useState<QueueStatus | undefined>();
    const [startDate, setStartDate] = useState<string | undefined>();
    const [endDate, setEndDate] = useState<string | undefined>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [items, setItems] = useState<QueueTicket[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

    const reqId = useRef(0);

    const s = stats ?? { issued: 0, waiting: 0, used: 0, skipped: 0, cancelled: 0 };

    useEffect(() => {
        const t = setTimeout(() => {
            setDebounced(keyword);
            setPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [keyword]);

    useEffect(() => {
        const id = ++reqId.current;
        setLoading(true);

        counterService
            .getQueue(counterId, { keyword: debounced, status, startDate, endDate, page, pageSize })
            .then((res) => {
                if (id !== reqId.current) return;
                setItems(res.items);
                setTotal(res.total);
            })
            .catch(() => {
                if (id === reqId.current) message.error('Không tải được danh sách số thứ tự');
            })
            .finally(() => {
                if (id === reqId.current) setLoading(false);
            });
    }, [counterId, debounced, status, startDate, endDate, page, pageSize, refreshKey]);

    const notReady = () => message.info('Chức năng đang làm');

    const columns: ColumnsType<QueueTicket> = [
        { title: 'Số thứ tự', dataIndex: 'number' },
        {
            title: 'Thời gian cấp',
            dataIndex: 'issuedAt',
            render: (v: string) => dayjs(v).format('HH:mm DD/MM/YYYY'),
        },
        { title: 'Dịch vụ', dataIndex: 'serviceName' },
        {
            title: 'Loại xử lý',
            dataIndex: 'status',
            render: (st: QueueStatus) => (
                <span className={styles.status}>
                    <span className={styles.dot} style={{ background: QUEUE_STATUS_COLOR[st] }} />
                    <span style={{ color: QUEUE_STATUS_COLOR[st] }}>{QUEUE_STATUS_LABEL[st]}</span>
                </span>
            ),
        },
        {
            title: 'Hành động',
            align: 'center',
            render: () => (
                <span className={styles.actions}>
                    <EditOutlined onClick={notReady} />
                    <InfoCircleOutlined onClick={notReady} />
                </span>
            ),
        },
    ];

    return (
        <div className={styles.panel}>
            <div className={styles.title}>Danh sách số thứ tự của dịch vụ {serviceName}</div>

            {/* Thẻ thống kê */}
            <div className={styles.stats}>
                <StartCart title="Số thứ tự đã cấp" iconRight={ClipboardList} value={s.issued} colorVariant="blue" />
                <StartCart title="Số thứ tự đang chờ" iconRight={ClipboardList} value={s.waiting} colorVariant="orange" />
                <StartCart title="Số thứ tự đã sử dụng" iconRight={ClipboardList} value={s.used} colorVariant="green" />
                <StartCart title="Số thứ tự đã bỏ qua" iconRight={ClipboardList} value={s.skipped} colorVariant="purple" />
                <StartCart title="Số thứ tự đã hủy" iconRight={ClipboardList} value={s.cancelled} colorVariant="red" />
            </div>

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
                    <div className={styles.filterTitle}>Trạng thái</div>
                    <Select<QueueStatus>
                        className={styles.select}
                        placeholder="Tất cả"
                        allowClear
                        value={status}
                        options={(Object.keys(QUEUE_STATUS_LABEL) as QueueStatus[]).map((k) => ({
                            label: QUEUE_STATUS_LABEL[k],
                            value: k,
                        }))}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                    />
                </div>

                <div className={styles.filterItem}>
                    <div className={styles.filterTitle}>Chọn thời gian</div>
                    <RangePicker
                        format="DD/MM/YYYY"
                        placeholder={['Từ ngày', 'Đến ngày']}
                        suffixIcon={<CalendarOutlined />}
                        onChange={(dates) => {
                            setStartDate(dates?.[0]?.format('YYYY-MM-DD'));
                            setEndDate(dates?.[1]?.format('YYYY-MM-DD'));
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Bảng: cuộn bên trong */}
            <div className={styles.tableWrap}>
                <Table<QueueTicket>
                    rowKey="id"
                    size="small"
                    columns={columns}
                    dataSource={items}
                    loading={loading}
                    pagination={false}
                    rowSelection={{ selectedRowKeys: selectedKeys, onChange: (keys) => setSelectedKeys(keys) }}
                />
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