import React from "react";
import styles from "./RatingBars.module.css";
import { RatingItem } from "../../../types/dashbroad";

interface RatingBarsProps {
  data?: RatingItem[];
}

const DEFAULT_RATING_DATA: RatingItem[] = [
  { id: "cardio", name: "Tim mạch", value: 340, color: "#22D3EE" },
  { id: "ent", name: "Mũi họng", value: 500, color: "#FF9640" },
  { id: "ear", name: "Tai", value: 410, color: "#3B82F6" },
  { id: "dental", name: "Răng", value: 240, color: "#22C55E" },
];

const MAX_CHART_VALUE = 600;
const RatingBars = ({ data = DEFAULT_RATING_DATA }: RatingBarsProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lượng đánh giá trung bình</h3>

      {/* khung vẽ biểu đồ */}
      <div className={styles.chartArea}>
        {/* dòng các mốc số trên đỉnh: 200, 450, 600 */}
        <div className={styles.axisHeader}>
          <span style={{ left: `${(200 / MAX_CHART_VALUE) * 100}%` }}>200</span>
          <span style={{ left: `${(450 / MAX_CHART_VALUE) * 100}%` }}>450</span>
          <span style={{ right: "0" }}>600</span>
        </div>

        {/* khunglưới dọc và các thanh ngang */}
        <div className={styles.barsWrapper}>
          {/* 3 đường kẻ dọc chiếu xuống từ mốc 200, 450, 600 */}
          <div
            className={styles.gridLine}
            style={{ left: `${(200 / MAX_CHART_VALUE) * 100}%` }}
          />
          <div
            className={styles.gridLine}
            style={{ left: `${(450 / MAX_CHART_VALUE) * 100}%` }}
          />
          <div className={styles.gridLine} style={{ right: "0" }} />

          {/* 4 thanh ngang bo góc */}
          <div className={styles.barList}>
            {data.map((item) => {
              const widthPercentage = (item.value / MAX_CHART_VALUE) * 100;
              return (
                <div key={item.id} className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${widthPercentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* chú thích màu ở dưới cùng */}
      <div className={styles.legend}>
        {data.map((item) => (
          <div key={item.id} className={styles.legendItem}>
            <span
              className={styles.legendSquare}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.legendLabel}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingBars;
