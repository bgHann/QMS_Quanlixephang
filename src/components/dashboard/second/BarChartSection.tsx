import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { ServiceBarPoint, TimeFilterMode } from "../../../types/dashbroad";
import styles from "./BarChartSection.module.css";

// khai báo props cho component
export interface BarChartSectionProps {
  data?: ServiceBarPoint[];
  isLoading?: boolean;
  onFilterChange?: (filter: TimeFilterMode) => void;
}

const BAR_COLORS = ["#22d3ee", "#FF9640", "#3B82F6", "#22c55e", "#F87171"];

// dữ liệu mock mặc định lúc chưa có api thật từ server
const defaultData: ServiceBarPoint[] = [
  { serviceName: "Tim", count: 304 },
  { serviceName: "Mũi họng", count: 1160 },
  { serviceName: "Mắt", count: 709 },
  { serviceName: "Răng", count: 807 },
  { serviceName: "May", count: 205 },
];

export default function BarChartSection({
  data = defaultData,
  isLoading = false,
  onFilterChange,
}: BarChartSectionProps) {
  // lưu mốc thời gian đang chọn
  const [filterMode, setFilterMode] = useState<TimeFilterMode>("Giờ");

  // bắt sự kiện người dùng đổi dropdown lọc
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as TimeFilterMode;
    setFilterMode(newMode);
    // báo ngược lên component cha để fetch api mới
    if (onFilterChange) {
      onFilterChange(newMode);
    }
  };

  return (
    <div className={styles.card}>
      {/* thanh tiêu đề và nút lọc */}
      <div className={styles.header}>
        <h3 className={styles.title}>STT cấp theo dịch vụ</h3>

        <div className={styles.selectWrapper}>
          <select
            value={filterMode}
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="Giờ">Giờ</option>
            <option value="Ngày">Ngày</option>
            <option value="Tuần">Tuần</option>
            <option value="Tháng">Tháng</option>
          </select>
          <ChevronDown className={styles.selectArrow} size={14} />
        </div>
      </div>

      {/* vùng vẽ biểu đồ cột */}
      <div className={styles.chartContainer}>
        {isLoading ? (
          <div className={styles.loadingText}>đang tải dữ liệu...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data as any[]}
              /* giảm margin top từ 25 xuống còn 15 để không bị cấn số trên đỉnh */
              margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
              barCategoryGap="25%"
            >
              {/* đường lưới ngang nét đứt mờ */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />

              {/* trục hoành ghi tên các khoa chuyên môn */}
              <XAxis
                dataKey="serviceName"
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />

              {/* trục tung bên trái */}
              <YAxis
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              {/* hộp tooltip khi rê chuột vào cột */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ServiceBarPoint;
                    return (
                      <div className={styles.customTooltip}>
                        <p className={styles.tooltipLabel}>
                          {item.serviceName}
                        </p>
                        <p className={styles.tooltipValue}>
                          {item.count.toLocaleString()} số
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* vẽ từng cột với bo góc trên, in số trên đỉnh và đổ màu riêng */}
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="count"
                  position="top"
                  fill="#6b7280"
                  fontSize={11}
                />
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
