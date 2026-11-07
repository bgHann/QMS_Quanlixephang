import React from "react";
import styles from "./RightSidebar.module.css";
import MiniCard from "./MiniCard";
import { Monitor, MessageSquare, Layers } from "lucide-react";
import ServicePieChart from "./ServicePieChart";
import RatingBars from "./RatingBars";

const MINI_CARD_DATA = [
  {
    id: 1,
    title: "Thiết bị",
    total: 4221,
    icon: Monitor,
    themeColor: "#FF7506",
    statuses: [
      { label: "Đang hoạt động", count: 3799, color: "#FF7506" },
      { label: "Ngưng hoạt động", count: 422, color: "#E73F3F" },
    ],
  },
  {
    id: 2,
    title: "Dịch vụ",
    total: 4221,
    icon: MessageSquare,
    themeColor: "#4277FF",
    statuses: [
      { label: "Đang hoạt động", count: 3799, color: "#4277FF" },
      { label: "Ngưng hoạt động", count: 422, color: "#E73F3F" },
    ],
  },
  {
    id: 3,
    title: "Cấp số",
    total: 4221,
    icon: Layers,
    themeColor: "#35C75A",
    statuses: [
      { label: "Đang hoạt động", count: 3799, color: "#35C75A" },
      { label: "Ngưng hoạt động", count: 422, color: "#E73F3F" },
      { label: "Bỏ qua", count: 30, color: "#7E7D88" },
    ],
  },
];

const RightSidebar = () => {
  return (
    <aside className={styles.container}>
      <div className={styles.cardList}>
        {MINI_CARD_DATA.map((item) => (
          <MiniCard
            key={item.id}
            total={item.total}
            title={item.title}
            icon={item.icon}
            themeColor={item.themeColor}
            statuses={item.statuses}
          />
        ))}
      </div>
      <ServicePieChart />
      <RatingBars />
    </aside>
  );
};

export default RightSidebar;
