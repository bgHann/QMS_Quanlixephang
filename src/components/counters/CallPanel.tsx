import { useEffect, useState } from 'react';
import { Button, Checkbox, InputNumber, Popover, message } from 'antd';
import { BellOutlined, DesktopOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import ConfirmDialog from '../common/ConfirmDialog';
import { counterService } from '../../api/services/counterService';
import { ROUTES } from '../../constants/routes';
import { HISTORY_RESULT_COLOR, HISTORY_RESULT_LABEL } from '../../constants/enums';
import { CallingTicket, HandlingHistory } from '../../types/counter';
import styles from './CallPanel.module.css';

const MAX_BATCH = 6; // SRS OPR-03: tối đa 6 số một lần

interface Props {
    counterId: string;
    waiting: number;
    onChanged: () => void; // báo trang cha tải lại số liệu
}

export default function CallPanel({ counterId, waiting, onChanged }: Props) {
    const navigate = useNavigate();

    const [now, setNow] = useState(dayjs());
    const [calling, setCalling] = useState<CallingTicket[]>([]); // các số đang hiện trong khung
    const [checked, setChecked] = useState<string[]>([]);        // id các số được check
    const [batchSize, setBatchSize] = useState(MAX_BATCH);       // số lượng xử lý/lần
    const [history, setHistory] = useState<HandlingHistory[]>([]);
    const [paused, setPaused] = useState(false);
    const [busy, setBusy] = useState(false);
    const [closeOpen, setCloseOpen] = useState(false);

    const processing = calling.filter((c) => c.callState === 'PROCESSING');
    const hasProcessing = processing.length > 0;
    const first = calling[0]; // dùng cho kiểu 1 số
    const checkedTickets = processing.filter((c) => checked.includes(c.id));
    const noneChecked = checkedTickets.length === 0;
    const allChecked = hasProcessing && checkedTickets.length === processing.length;
    const [mode, setMode] = useState<'single' | 'multi'>('multi');

    useEffect(() => {
        const t = setInterval(() => setNow(dayjs()), 30000);
        return () => clearInterval(t);
    }, []);

    const reloadHistory = () => counterService.getHistory(counterId).then(setHistory);

    useEffect(() => {
        counterService.getHistory(counterId).then(setHistory);
    }, [counterId]);

    // Gọi số: lấy tối đa batchSize số, tự check tất cả
    const handleCall = async (count: number) => {
        if (hasProcessing) {
            message.info('Vui lòng xử lý xong các số đang gọi');
            return;
        }
        setBusy(true);
        try {
            const picked = await counterService.callBatch(counterId, count);
            if (picked.length === 0) message.info('Hiện không còn số đang chờ');
            const next: CallingTicket[] = picked.map((t) => ({ ...t, callState: 'PROCESSING' }));
            setCalling(next); // bỏ các số đã xử lý ở lượt trước
            setMode(count === 1 ? 'single' : 'multi');
            setChecked(next.map((t) => t.id));
            onChanged();
        } catch {
            message.error('Gọi số thất bại, vui lòng thử lại');
        } finally {
            setBusy(false);
        }
    };

    // Hoàn thành / Bỏ qua: chỉ áp dụng cho các số được check
    const handleFinish = async (result: 'DONE' | 'ABSENT') => {
        if (noneChecked) return;
        setBusy(true);
        try {
            await counterService.finishTickets(counterId, checkedTickets, result);
            const ids = checkedTickets.map((t) => t.id);
            setCalling((list) =>
                list.map((c) => (ids.includes(c.id) ? { ...c, callState: result } : c)),
            );
            setChecked([]);
            await reloadHistory();
            onChanged();
        } catch {
            message.error('Thao tác thất bại, vui lòng thử lại');
        } finally {
            setBusy(false);
        }
    };

    const handleRecall = () => {
        message.success(`Đang gọi lại số ${checkedTickets.map((t) => t.number).join(', ')}`);
    };

    const toggleOne = (id: string) =>
        setChecked((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

    const toggleAll = () => setChecked(allChecked ? [] : processing.map((t) => t.id));

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(() => {
                message.warning('Trình duyệt không cho phép toàn màn hình');
            });
        }
    };

    const notReady = () => message.info('Chức năng đang làm');

    const batchEditor = (
        <div className={styles.batchEditor}>
            <div>Số lượng xử lý / lần (tối đa {MAX_BATCH})</div>
            <InputNumber
                min={1}
                max={MAX_BATCH}
                value={batchSize}
                onChange={(v) => setBatchSize(v ?? 1)}
            />
        </div>
    );

    return (
        <div className={styles.panel}>
            {/* Số lượt chờ + giờ */}
            <div className={styles.top}>
                <div>
                    <div className={styles.waiting}>
                        Số lượt chờ: <span className={styles.waitingCount}>{waiting}</span>
                    </div>
                    <div className={styles.clock}>
                        {now.format('DD/MM/YYYY')}
                        <span className={styles.clockTime}>{now.format('hh:mm A')}</span>
                    </div>
                </div>

                <div className={styles.topButtons}>
                    <Button className={styles.outlineOrange} icon={<DesktopOutlined />} onClick={toggleFullscreen}>
                        Phóng to
                    </Button>
                    <Button className={styles.outlineOrange} icon={<BellOutlined />} onClick={notReady}>
                        Thông báo
                    </Button>
                </div>
            </div>

            {/* Hàng nút điều khiển */}
            <div className={styles.actionRow}>
                <Button className={styles.multiBtn} onClick={() => handleCall(batchSize)}>
                    Gọi nhiều số
                    <span className={styles.multiCount}>{batchSize}</span>
                    <Popover content={batchEditor} trigger="click" placement="bottom">
                        <EditOutlined onClick={(e) => e.stopPropagation()} />
                    </Popover>
                </Button>
                <Button className={styles.stopBtn} onClick={() => setPaused((p) => !p)}>
                    {paused ? 'Tiếp nhận lại' : 'Ngưng tiếp nhận'}
                </Button>
                <Button className={styles.closeBtn} onClick={() => setCloseOpen(true)}>
                    Đóng quầy
                </Button>
            </div>

            {/* Khung gọi số / đang xử lý */}
            <div className={styles.callBox}>
                <div className={styles.callHead}>
                    <span className={styles.callTitle}>
                        {calling.length > 0 && mode === 'multi' ? 'Đang xử lý' : ''}
                    </span>
                    {hasProcessing && mode === 'multi' && (
                        <Checkbox checked={allChecked} onChange={toggleAll}>
                            Chọn tất cả
                        </Checkbox>
                    )}
                </div>

                <div className={styles.callBody}>
                    {calling.length === 0 ? (
                        <div className={styles.hint}>
                            <div>Vui lòng bấm nút</div>
                            <div>
                                <span className={styles.hintStrong}>“Gọi Số”</span> để tiếp tục làm việc
                            </div>
                        </div>
                    ) : mode === 'single' ? (
                        <div className={styles.single}>
                            <div className={styles.currentNumber}>{first.number}</div>
                            <div className={styles.currentService}>DV: {first.serviceName}</div>
                            {first.callState !== 'PROCESSING' && (
                                <span
                                    className={styles.ticketResult}
                                    style={{ color: HISTORY_RESULT_COLOR[first.callState] }}
                                >
                                    {HISTORY_RESULT_LABEL[first.callState]}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.ticketGrid}>
                            {calling.map((t) => (
                                <div
                                    key={t.id}
                                    className={`${styles.ticketCard} ${t.callState !== 'PROCESSING' ? styles.ticketDone : ''}`}
                                >
                                    <div className={styles.ticketTop}>
                                        <span className={styles.ticketNumber}>{t.number}</span>
                                        {t.callState === 'PROCESSING' ? (
                                            <Checkbox checked={checked.includes(t.id)} onChange={() => toggleOne(t.id)} />
                                        ) : (
                                            <span
                                                className={styles.ticketResult}
                                                style={{ color: HISTORY_RESULT_COLOR[t.callState] }}
                                            >
                                                {HISTORY_RESULT_LABEL[t.callState]}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.ticketService}>DV: {t.serviceName}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.callButtons}>
                    {hasProcessing ? (
                        <Button
                            type="primary"
                            className={`${styles.callBtn} ${styles.callMain}`}
                            disabled={noneChecked}
                            loading={busy}
                            onClick={() => handleFinish('DONE')}
                        >
                            Hoàn Thành
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            className={`${styles.callBtn} ${styles.callMain}`}
                            loading={busy}
                            onClick={() => handleCall(1)}
                        >
                            Gọi Số
                        </Button>
                    )}
                    <Button className={styles.callBtn} disabled={noneChecked} onClick={handleRecall}>
                        Gọi Lại
                    </Button>
                    <Button className={styles.callBtn} disabled={noneChecked} onClick={() => handleFinish('ABSENT')}>
                        Bỏ Qua
                    </Button>
                    <Button className={styles.callBtn} disabled={noneChecked} onClick={notReady}>
                        Chuyển quầy
                    </Button>
                </div>
            </div>

            {/* Lịch sử xử lý */}
            <div className={styles.historyTitle}>Lịch sử xử lý</div>
            <div className={styles.history}>
                {history.map((h) => (
                    <div key={h.id} className={styles.historyRow}>
                        <span>
                            <span className={styles.historyNum}>{h.number}</span>
                            DV: {h.serviceName}
                        </span>
                        <span>{h.staffName}</span>
                        <span className={styles.result} style={{ color: HISTORY_RESULT_COLOR[h.result] }}>
                            {HISTORY_RESULT_LABEL[h.result]}
                        </span>
                        <span>
                            {h.result === 'ABSENT' && (
                                <Button
                                    size="small"
                                    className={styles.recallBtn}
                                    icon={<ReloadOutlined />}
                                    onClick={() => message.success(`Đang gọi lại số ${h.number}`)}
                                >
                                    Gọi lại
                                </Button>
                            )}
                        </span>
                    </div>
                ))}
            </div>

            <ConfirmDialog
                open={closeOpen}
                title="Đóng quầy"
                content="Bạn có chắc chắn muốn đóng quầy?"
                onOk={() => navigate(ROUTES.COUNTERS)}
                onCancel={() => setCloseOpen(false)}
            />
        </div>
    );
}