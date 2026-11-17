import { THEME_COLORS } from '../constants/enums';
import type { DisplaySetting, AudioSetting } from '../types/setting';

export const displaySettingMock: DisplaySetting = {
    unitName: '<p>Tây Thạnh</p>',
    unitCode: 'TT001',
    bannerText: '',
    themeColor: THEME_COLORS[0],
};
export const MOCK_AUDIO_SETTING: AudioSetting = {
    voice: 'south',
    speed: 0.5,
    template: 'Xin mời khách hàng có số {soThuTu} vào',
};