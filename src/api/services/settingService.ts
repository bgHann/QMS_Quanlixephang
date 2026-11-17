import axios from 'axios';
import type { DisplaySetting } from '../../types/setting';
import { displaySettingMock } from '../../mock/settings.mock';
import type { AudioSetting } from '../../types/setting';
import { MOCK_AUDIO_SETTING } from '../../mock/settings.mock';

const USE_MOCK = true; // đổi false khi backend sẵn sàng
const delay = <T>(data: T, ms = 300) =>
    new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

let displayDb: DisplaySetting = { ...displaySettingMock };

export const settingService = {
    async getDisplaySetting(): Promise<DisplaySetting> {
        if (!USE_MOCK) {
            const res = await axios.get('/api/v1/settings/display');
            return res.data.data;
        }
        return delay({ ...displayDb });
    },

    async saveDisplaySetting(body: DisplaySetting): Promise<DisplaySetting> {
        if (!USE_MOCK) {
            const res = await axios.put('/api/v1/settings/display', body);
            return res.data.data;
        }
        displayDb = { ...body };
        return delay({ ...displayDb });
    },

    // Tải ảnh lên, trả về đường dẫn ảnh (đường dẫn API tạm, chờ backend)
    async uploadImage(file: File): Promise<string> {
        if (!USE_MOCK) {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('/api/v1/files', formData);
            return res.data.data.url;
        }
        return delay(URL.createObjectURL(file));
    },
    async getAudioSetting(): Promise<AudioSetting> {
        if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 300));
            return { ...MOCK_AUDIO_SETTING };
        }
        const res = await axios.get('/api/v1/settings/audio'); // đường dẫn tạm, chờ BE
        return res.data.data;
    },

    async saveAudioSetting(body: AudioSetting): Promise<void> {
        if (USE_MOCK) {
            await new Promise((r) => setTimeout(r, 400));
            Object.assign(MOCK_AUDIO_SETTING, body);
            return;
        }
        await axios.put('/api/v1/settings/audio', body);
    },
};