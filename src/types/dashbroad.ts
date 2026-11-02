//sidebarright top minicard
export interface Status {
  label: string;
  count: number;
  color?: string;
}
export interface SumaryResponse {
  total: number;
  statuses: Status[];
}
// top card
export interface TopCardResponse {
  total: number;
  percentage: number;
}
// tỷ lệ dịch vụ
export interface ServiceRatio {
  title: string;
  value: number;
  color?: string;
}
// lượng đánh giá tb
export interface RatingItem {
  id: string;
  name: string;
  value: number;
  color?: string;
}
