
export type ReviewStatus = "Đã đánh giá" | "Chưa đánh giá";

export type TemplateStatus = "Đang sử dụng" | "Ngừng sử dụng";

export interface Review {
  id: number;
  code: string;
  counter: string;
  reviewTime: string;
  content: string;
  status: ReviewStatus;
  rating: number;
}

export interface ReviewTemplate {
  id: number;
  code: string;
  name: string;
  content: string;
  questionCount: number;
  counter: string;
  status: TemplateStatus;
  createdAt: string;
}

export interface ReviewFilter {
  keyword?: string;
  counter?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReviewTemplateFilter {
  keyword?: string;
  counter?: string;
}
