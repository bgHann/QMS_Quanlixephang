import styles from "./StartCart.module.css";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

export type ColorVariant = "blue" | "orange" | "green" | "purple" | "red";

interface StartCartProps {
  title: string;
  iconRight: LucideIcon;
  value: number;
  percent?: number; // số âm = giảm
  colorVariant?: ColorVariant;
}

const StartCart = ({
  title,
  iconRight: IconRight,
  value,
  percent = 10,
  colorVariant = "blue",
}: StartCartProps) => {
  const isDown = percent < 0;
  const BadgeIcon = isDown ? ArrowDown : ArrowUp;

  return (
    <div className={`${styles.container} ${styles[colorVariant]}`}>
      <div className={styles.header}>
        <p className="">{title}</p>
        <IconRight className={styles.icon} />
      </div>
      <p className={styles.value}>{value.toLocaleString("vi-VN")}</p>
      <div className={`${styles.badge} ${isDown ? styles.badgeDown : ""}`}>
        <BadgeIcon className={styles.badgeIcon} />
        <span>
          {isDown ? "" : "+"}
          {percent}% so với kì trước
        </span>
      </div>
    </div>
  );
};

export default StartCart;