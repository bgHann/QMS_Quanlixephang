export type CardType = "assigned" | "waiting" | "used" | "skipped";

export interface StatCardItem {
  id: string;
  type: CardType;
  title: string;
  value: number;
  percentChange: number;
}

export const mockDashboardCards: StatCardItem[] = [
  {
    id: "1",
    type: "assigned",
    title: "Số thứ tự đã cấp",
    value: 5329,
    percentChange: 10,
  },
  {
    id: "2",
    type: "waiting",
    title: "Số thứ tự đang chờ",
    value: 5329,
    percentChange: 10,
  },
  {
    id: "3",
    type: "used",
    title: "Số thứ tự đã sử dụng",
    value: 5329,
    percentChange: 10,
  },
  {
    id: "4",
    type: "skipped",
    title: "Số thứ tự đã bỏ qua",
    value: 5329,
    percentChange: 10,
  },
];
