import { useEffect, useRef, useState } from 'react';
import { Button, Input, message } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styles from './AudioSettingPage.module.css';
import { settingService } from '../../../api/services/settingService';
import { SPEED_OPTIONS, TEMPLATE_TOKENS, SAMPLE_TEMPLATES, VOICE_OPTIONS } from '../../../constants/enums';
import { AudioSetting, SpeechSpeed, VoiceRegion } from '../../../types/setting';

const WAVE = [8, 14, 22, 12, 28, 18, 10, 26, 16, 30, 12, 20, 8, 24, 14, 28, 10, 18, 26, 12, 22, 16, 30, 10, 20];

// Biến câu có {soThuTu} thành các chip cam để hiển thị
function renderTemplate(text: string) {
    const parts = text.split(/(\{soThuTu\}|\{quayTen\})/g);
    return parts.map((part, i) => {
        const token = TEMPLATE_TOKENS.find((t) => t.key === part);
        if (token) {
            return (
                <span key={i} className={styles.chipInline}>
                    {token.label}
                </span>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function AudioSettingPage() {
    const [saved, setSaved] = useState<AudioSetting | null>(null);
    const [voice, setVoice] = useState<VoiceRegion>('south');
    const [speed, setSpeed] = useState<SpeechSpeed>(1);
    const [template, setTemplate] = useState('');
    const [saving, setSaving] = useState(false);
    const [playing, setPlaying] = useState(false);
    const textRef = useRef<TextAreaRef>(null);

    const apply = (s: AudioSetting) => {
        setVoice(s.voice);
        setSpeed(s.speed);
        setTemplate(s.template);
    };

    useEffect(() => {
        settingService.getAudioSetting().then((s) => {
            setSaved(s);
            apply(s);
        });
        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    // Chèn cụm thông tin tại vị trí con trỏ
    const insertToken = (token: string) => {
        const el = textRef.current?.resizableTextArea?.textArea;
        if (!el) {
            setTemplate((t) => t + token);
            return;
        }
        const start = el.selectionStart;
        const end = el.selectionEnd;
        setTemplate(template.slice(0, start) + token + template.slice(end));
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(start + token.length, start + token.length);
        }, 0);
    };

    // Nghe thử bằng giọng đọc của trình duyệt (tạm, khi có BE sẽ đổi sang file audio)
    const handleListen = () => {
        if (!('speechSynthesis' in window)) {
            message.warning('Trình duyệt không hỗ trợ đọc thử');
            return;
        }
        if (playing) {
            window.speechSynthesis.cancel();
            setPlaying(false);
            return;
        }
        const text = template.split('{soThuTu}').join('A 0 0 1').split('{quayTen}').join('quầy 1');
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'vi-VN';
        u.rate = speed;
        u.onend = () => setPlaying(false);
        u.onerror = () => setPlaying(false);
        setPlaying(true);
        window.speechSynthesis.speak(u);
    };

    const handleSubmit = async () => {
        if (!template.trim()) {
            message.error('Vui lòng nhập câu đọc');
            return;
        }
        setSaving(true);
        try {
            const body: AudioSetting = { voice, speed, template };
            await settingService.saveAudioSetting(body);
            setSaved(body);
            message.success('Lưu thiết lập audio thành công');
        } catch (e) {
            message.error('Lưu thất bại, vui lòng thử lại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.body}>
                {/* Cột trái */}
                <div className={styles.left}>
                    <div className={styles.label}>Giọng đọc</div>
                    <div className={styles.chipRow}>
                        {VOICE_OPTIONS.map((o) => (
                            <button
                                key={o.value}
                                type="button"
                                className={`${styles.pill} ${voice === o.value ? styles.pillActive : ''}`}
                                onClick={() => setVoice(o.value)}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.label}>Tốc độ đọc</div>
                    <div className={styles.chipRow}>
                        {SPEED_OPTIONS.map((s) => (
                            <button
                                key={s}
                                type="button"
                                className={`${styles.pill} ${styles.pillRound} ${speed === s ? styles.pillActive : ''}`}
                                onClick={() => setSpeed(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className={styles.label}>Nghe thử</div>
                    <div className={styles.player}>
                        <button type="button" className={styles.playBtn} onClick={handleListen}>
                            {playing ? <PauseOutlined /> : <CaretRightOutlined />}
                        </button>
                        <div className={styles.wave}>
                            {WAVE.map((h, i) => (
                                <span
                                    key={i}
                                    className={`${styles.bar} ${playing ? styles.barPlaying : ''}`}
                                    style={{ height: h, animationDelay: `${i * 40}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải */}
                <div className={styles.right}>
                    <div className={styles.label}>Thiết lập câu đọc</div>
                    <div className={styles.hint}>Chọn cụm thông tin để thêm vào câu đọc mẫu</div>

                    <div className={styles.editor}>
                        <div className={styles.tokenBar}>
                            <span className={styles.tokenTitle}>Cụm thông tin</span>
                            {TEMPLATE_TOKENS.map((t) => {
                                const used = template.includes(t.key);
                                return (
                                    <button
                                        key={t.key}
                                        type="button"
                                        disabled={used}
                                        className={`${styles.chip} ${used ? styles.chipUsed : ''}`}
                                        onClick={() => insertToken(t.key)}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                        <Input.TextArea
                            ref={textRef}
                            className={styles.textarea}
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            placeholder="Nhập câu đọc..."
                            variant="borderless"
                            rows={4}
                        />
                        <div className={styles.preview}>{renderTemplate(template)}</div>
                    </div>

                    <div className={`${styles.label} ${styles.sampleTitle}`}>Một số câu mẫu</div>
                    <div className={styles.samples}>
                        {SAMPLE_TEMPLATES.map((s) => (
                            <div key={s} className={styles.sample} onClick={() => setTemplate(s)}>
                                {renderTemplate(s)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <Button className={styles.cancelButton} onClick={() => saved && apply(saved)}>
                    Hủy bỏ
                </Button>
                <Button type="primary" className={styles.okButton} loading={saving} onClick={handleSubmit}>
                    Xác nhận
                </Button>
            </div>
        </div>
    );
}