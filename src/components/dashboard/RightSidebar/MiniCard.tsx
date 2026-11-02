import React from "react";
import styles from "./MiniCard.module.css";
import { LucideIcon } from "lucide-react";
import { Status } from "../../../types/dashbroad";
interface MiniCardProps {
  total: number;
  title: string;
  icon: LucideIcon;
  themeColor: string;
  statuses: Status[];
}

const MiniCard = ({
  total,
  title,
  icon: Icon,
  themeColor,
  statuses,
}: MiniCardProps) => {
  return (
    <div className={styles.card}>
      {/* Cột trái: Số lượng tổng + Icon + Tên */}
      <div className={styles.leftCol}>
        <span className={styles.totalNumber}>
          {total.toLocaleString("vi-VN")}
        </span>
        <div className={styles.labelRow} style={{ color: themeColor }}>
          <Icon size={16} />
          <span className={styles.titleText}>{title}</span>
        </div>
      </div>

      {/* Đường vạch phân cách mờ */}
      <div className={styles.divider} />

      {/* cột phải danh sách trạng thái kèm số lượng */}
      <div className={styles.rightCol}>
        {statuses.map((item, index) => (
          <div key={index} className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span
                className={styles.dot}
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.statusLabel}>{item.label}</span>
            </div>
            <span className={styles.statusCount} style={{ color: item.color }}>
              {item.count.toLocaleString("vi-VN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCard;
