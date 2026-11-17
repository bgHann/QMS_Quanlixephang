import type { CSSProperties } from 'react';
import DOMPurify from 'dompurify';
import styles from './DisplayPreview.module.css';

interface DisplayPreviewProps {
    backgroundUrl?: string;
    logoUrl?: string;
    unitName?: string;   // chuỗi HTML từ ô soạn thảo
    bannerText?: string;
    themeColor?: string;
}

// Dữ liệu mẫu để minh họa
const DEMO_ROWS = [1, 2, 3, 4, 5, 6].map((n) => ({
    counter: `Quầy ${n}`,
    service: 'TỔ ĐỊA BÀN PHI ĐỊA GIỚI HÀNH CHÍNH LĨNH VỰC NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
    number: String(201000 + n),
}));

export default function DisplayPreview({
    backgroundUrl,
    logoUrl,
    unitName,
    bannerText,
    themeColor = '#FF7506',
}: DisplayPreviewProps) {
    // Màu và ảnh nền lấy từ dữ liệu người dùng nhập nên để inline
    const mainStyle = {
        '--theme-color': themeColor,
        backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : undefined,
    } as CSSProperties;

    return (
        <div className={styles.layout} style={{ '--theme-color': themeColor } as CSSProperties}>
            {/* Màn hình chính (TV) */}
            <div className={styles.main} style={mainStyle}>
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <div className={styles.brand}>
                            {logoUrl && <img src={logoUrl} alt="Logo" className={styles.logo} />}
                            {/* DOMPurify lọc bỏ mã độc trong HTML trước khi hiển thị */}
                            <div
                                className={styles.unitName}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(unitName ?? '') }}
                            />
                        </div>
                        <div className={styles.title}>THEO DÕI GỌI SỐ</div>
                        <div className={styles.clock}>
                            <div className={styles.time}>12:00</div>
                            <div className={styles.date}>Ngày 20, tháng 8, 2025</div>
                        </div>
                    </div>

                    <div className={styles.rows}>
                        {DEMO_ROWS.map((row) => (
                            <div key={row.number} className={styles.row}>
                                <div>
                                    <div className={styles.counter}>{row.counter}</div>
                                    <div className={styles.service}>{row.service}</div>
                                </div>
                                <div className={styles.number}>{row.number}</div>
                                <div className={styles.waiting}>Hàng chờ</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.banner}>{bannerText || 'Câu biểu ngữ ở đây'}</div>
            </div>

            {/* Hai khung nhỏ (màn hình quầy, kiosk...) */}
            <div className={styles.side}>
                <div className={styles.thumb}>
                    <div className={styles.thumbLabel}>SỐ THỨ TỰ</div>
                    <div className={styles.thumbNumber}>201001</div>
                </div>
                <div className={styles.thumb}>
                    <div className={styles.thumbLabel}>SỐ THỨ TỰ</div>
                    <div className={styles.thumbNumber}>201002</div>
                </div>
            </div>
        </div>
    );
}