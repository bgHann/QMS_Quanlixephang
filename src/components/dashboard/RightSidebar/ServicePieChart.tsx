import React from "react";
import { ServiceRatio } from "../../../types/dashbroad";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import styles from "./ServicePieChart.module.css";

interface ServicePieChartProps {
  data?: ServiceRatio[];
}

const DEFAULT_DATA: ServiceRatio[] = [
  { title: "Khám tim mạch", value: 275, color: "#FF9640" },
  { title: "Khác", value: 90, color: "#F87171" },
  { title: "Khám răng", value: 173, color: "#22C55E" },
  { title: "Khám mũi họng", value: 187, color: "#3B82F6" },
  { title: "Khám tai", value: 200, color: "#22D3EE" },
];

// Hàm v
const renderInnerLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  title,
}: any) => {
  const RADIAN = Math.PI / 180;
  // Tâm của chữ nằm ở vị trí 60% từ tâm hình tròn ra mép
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const words = title.split(" ");

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={9}
      fontWeight={600}
    >
      {/* Tách từ để chữ tự rớt dòng, không bị tràn ra ngoài lát cắt */}
      {words.map((word: string, index: number) => (
        <tspan
          x={x}
          dy={index === 0 ? -(words.length - 1) * 5 : 10}
          key={index}
        >
          {word}
        </tspan>
      ))}
    </text>
  );
};

const ServicePieChart = ({ data = DEFAULT_DATA }: ServicePieChartProps) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tỷ lệ dịch vụ được sử dụng</h3>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Lớp 1: Vẽ miếng bánh và chữ tên dịch vụ bên trong */}
            <Pie
              data={data}
              cx="50%"
              cy="55%"
              outerRadius="65%"
              innerRadius={0}
              dataKey="value"
              labelLine={false}
              label={renderInnerLabel}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>

            {/* Lớp 2: Vẽ đường chỉ dẫn (leader line) và con số bên ngoài */}
            <Pie
              data={data}
              cx="50%"
              cy="55%"
              outerRadius="65%"
              innerRadius={0}
              dataKey="value"
              stroke="none"
              fill="none"
              label={({ value }: any) => value}
              labelLine={{ stroke: "#999999", strokeWidth: 1 }}
              startAngle={90}
              endAngle={-270}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicePieChart;
