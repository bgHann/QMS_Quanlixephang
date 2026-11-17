import { useState } from 'react';
import { Segmented } from 'antd';
import AudioSettingPage from './AudioSettingPage';
import DisplaySettingPage from './DisplaySettingPage';
import styles from './LogoPage.module.css';

type TabKey = 'display' | 'audio';

export default function LogoPage() {
    const [tab, setTab] = useState<TabKey>('display');

    return (
        <div className={styles.page}>
            <Segmented<TabKey>
                value={tab}
                onChange={setTab}
                className={styles.tabs}
                options={[
                    { value: 'display', label: 'Thiết lập hiển thị' },
                    { value: 'audio', label: 'Thiết lập audio' },
                ]}
            />

            <div className={styles.content}>
                {tab === 'display' ? <DisplaySettingPage /> : <AudioSettingPage />}
            </div>
        </div>
    );
}