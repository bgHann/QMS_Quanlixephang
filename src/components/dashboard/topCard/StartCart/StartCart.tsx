import styles from "./StartCart.module.css";
import { LucideIcon, ArrowUp } from "lucide-react";

export type ColorVariant = "blue" | "orange" | "green" | "purple";

interface StartCartProps {
  title: string;
  iconRight: LucideIcon;
  value: number;
  percent?: number;
  colorVariant?: ColorVariant;
}

const StartCart = ({
  title,
  iconRight: IconRight,
  value,
  percent = 10,
  colorVariant = "blue",
}: StartCartProps) => {
  return (
    <div className={`${styles.container} ${styles[colorVariant]}`}>
      <div className={styles.header}>
        <p className="">{title}</p>
        <IconRight className={styles.icon} />
      </div>
      <p className={styles.value}>{value.toLocaleString("vi-VN")}</p>
      <div className={styles.badge}>
        <ArrowUp className={styles.badgeIcon} />
        <span>+{percent}% so với kì trước</span>
      </div>
    </div>
  );
};

export default StartCart;
