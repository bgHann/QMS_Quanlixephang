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

//Bảng thống kê số luộng STT cấp
export interface LineChartPoint {
  time: string; //tục hoàn figma sket xs pss
  value: number; //số lương cấp số (trục tung)
  [key: string]: any; //cho phép thêm các thuộc tính khác nếu cần
}
//thời gian
export type TimeFilterMode = "Giờ" | "Ngày" | "Tuần" | "Tháng";
// kiểu cho từng cột dịch vụ (stt cấp theo dịch vụ)
export interface ServiceBarPoint {
  serviceName: string; // tên khoa: tim mạch, mũi họng...
  count: number; // số lượng stt cấp: 304, 1160...
  color?: string; // màu riêng nếu backend có trả về (tùy chọn)
  [key: string]: any; // để recharts không bị bắt bẻ type
}

// kiểu cho response trả về từ api cho biểu đồ cột
export interface ServiceBarChartResponse {
  filter: TimeFilterMode;
  data: ServiceBarPoint[];
}
