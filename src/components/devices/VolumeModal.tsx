import { useEffect, useState } from "react";
import { Button, Modal, Slider } from "antd";
import { Volume2 } from "lucide-react";
import styles from "./VolumeModal.module.css";

interface VolumeModalProps {
  open: boolean;
  deviceNames: string[];
  initialVolume?: number;
  onCancel: () => void;
  onConfirm: (volume: number) => void;
}

export default function VolumeModal({
  open,
  deviceNames,
  initialVolume = 50,
  onCancel,
  onConfirm,
}: VolumeModalProps) {
  const [volume, setVolume] = useState(initialVolume);

  // Khôi phục giá trị âm lượng mỗi khi mở popup
  useEffect(() => {
    if (open) {
      setVolume(initialVolume);
    }
  }, [open, initialVolume]);

  const handleConfirm = () => {
    onConfirm(volume);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      centered
      className={styles.volumeModal}
      destroyOnHidden
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Âm Lượng</h2>

        <p className={styles.description}>
          Điều chỉnh âm lượng của các thiết bị{" "}
          <span className={styles.deviceNames}>{deviceNames.join(", ")}</span>
        </p>

        <div className={styles.sliderRow}>
          <Volume2 size={24} strokeWidth={2} className={styles.volumeIcon} />

          <Slider
            min={0}
            max={100}
            value={volume}
            onChange={setVolume}
            className={styles.slider}
            tooltip={{ open: false }}
          />

          <span className={styles.volumeValue}>{volume}%</span>
        </div>

        <div className={styles.actions}>
          <Button className={styles.cancelButton} onClick={onCancel}>
            Hủy bỏ
          </Button>

          <Button
            type="primary"
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </Modal>
  );
}
