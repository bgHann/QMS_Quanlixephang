import { Plus, Trash2 } from "lucide-react";
import { Tooltip } from "antd";

import styles from "./ServiceToolbar.module.css";

interface ServiceToolbarProps {
  onAdd: () => void;
  onDelete: () => void;
  deleteDisabled?: boolean;
}

export default function ServiceToolbar({
  onAdd,
  onDelete,
  deleteDisabled = false,
}: ServiceToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <Tooltip title="Thêm dịch vụ" placement="left">
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={onAdd}
          aria-label="Thêm dịch vụ"
        >
          <Plus size={20} strokeWidth={2} />
        </button>
      </Tooltip>

      <Tooltip title="Xóa dịch vụ" placement="left">
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={onDelete}
          disabled={deleteDisabled}
          aria-label="Xóa dịch vụ"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      </Tooltip>
    </div>
  );
}
