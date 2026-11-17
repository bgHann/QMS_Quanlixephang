export interface DisplaySetting {
    backgroundUrl?: string;
    logoUrl?: string;
    unitName: string;      // chuỗi HTML từ ô soạn thảo, ví dụ "<p>Tây Thạnh</p>"
    unitCode?: string;
    bannerText?: string;   // biểu ngữ tuyên truyền
    themeColor: string;    // 1 trong 10 màu cố định
}
export type VoiceRegion = 'south' | 'north';
export type SpeechSpeed = 0.5 | 1 | 1.5 | 2;

export interface AudioSetting {
    voice: VoiceRegion;
    speed: SpeechSpeed;
    template: string; // câu đọc, chứa mã thay thế như {soThuTu}, {quayTen}
}