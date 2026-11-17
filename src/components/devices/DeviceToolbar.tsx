import { Tooltip } from "antd";
import { Volume2, Plus, Trash2 } from "lucide-react";
import styles from "./DeviceToolbar.module.css";

interface DeviceToolbarProps {
  onVolume: () => void;
  onAdd: () => void;
  onDelete: () => void;
  volumeDisabled?: boolean;
  deleteDisabled?: boolean;
}

export default function DeviceToolbar({
  onVolume,
  onAdd,
  onDelete,
  volumeDisabled = false,
  deleteDisabled = false,
}: DeviceToolbarProps) {
  return (
    <div
      className={styles.toolbar}
      role="toolbar"
      aria-label="Công cụ quản lý thiết bị"
    >
      {/* Điều chỉnh âm lượng */}
      <Tooltip title="Điều chỉnh âm lượng" placement="left">
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={onVolume}
          disabled={volumeDisabled}
          aria-label="Điều chỉnh âm lượng"
        >
          <Volume2 size={20} strokeWidth={2} />
        </button>
      </Tooltip>

      {/* Thêm thiết bị */}
      <Tooltip title="Thêm thiết bị" placement="left">
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={onAdd}
          aria-label="Thêm thiết bị"
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </Tooltip>

      {/* Xóa thiết bị */}
      <Tooltip title="Xóa thiết bị" placement="left">
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={onDelete}
          disabled={deleteDisabled}
          aria-label="Xóa thiết bị"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      </Tooltip>
    </div>
  );
}
