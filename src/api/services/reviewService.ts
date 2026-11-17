
import {
  Review,
  ReviewFilter,
  ReviewTemplate,
  ReviewTemplateFilter,
} from "../../types/review";

import {
  mockReviews,
  mockReviewTemplates,
} from "../../mock/reviews.mock";

const REVIEW_KEY = "qms_reviews";
const TEMPLATE_KEY = "qms_review_templates";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function normalizeDate(date: string): string {
  const parts = date.split("/");

  if (parts.length !== 3) return "";

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export const reviewService = {
  // =========================
  // DANH SÁCH ĐÁNH GIÁ
  // =========================

  getReviews(): Review[] {
    return readStorage<Review[]>(REVIEW_KEY, mockReviews);
  },

  searchReviews(filters: ReviewFilter = {}): Review[] {
    let reviews = this.getReviews();

    if (filters.keyword?.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();

      reviews = reviews.filter((review) =>
        `${review.code} ${review.counter} ${review.content}`
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (filters.counter) {
      reviews = reviews.filter(
        (review) => review.counter === filters.counter
      );
    }

    if (filters.startDate || filters.endDate) {
      reviews = reviews.filter((review) => {
        const reviewDate = normalizeDate(
          review.reviewTime.split(" ")[0]
        );

        if (!reviewDate) return false;

        if (filters.startDate && reviewDate < filters.startDate) {
          return false;
        }

        if (filters.endDate && reviewDate > filters.endDate) {
          return false;
        }

        return true;
      });
    }

    return reviews;
  },

  getReviewById(id: number): Review | undefined {
    return this.getReviews().find((item) => item.id === id);
  },

  // =========================
  // CÀI ĐẶT MẪU ĐÁNH GIÁ
  // =========================

  getTemplates(): ReviewTemplate[] {
    return readStorage<ReviewTemplate[]>(
      TEMPLATE_KEY,
      mockReviewTemplates
    );
  },

  searchTemplates(
    filters: ReviewTemplateFilter = {}
  ): ReviewTemplate[] {
    let templates = this.getTemplates();

    if (filters.keyword?.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();

      templates = templates.filter((item) =>
        `${item.code} ${item.name} ${item.content}`
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (filters.counter) {
      templates = templates.filter(
        (item) =>
          item.counter === filters.counter ||
          item.counter === "Tất cả quầy"
      );
    }

    return templates;
  },

  getTemplateById(id: number): ReviewTemplate | undefined {
    return this.getTemplates().find((item) => item.id === id);
  },

  addTemplate(data: Omit<ReviewTemplate, "id" | "code">): ReviewTemplate {
    const templates = this.getTemplates();

    const nextId =
      Math.max(0, ...templates.map((item) => item.id)) + 1;

    const newTemplate: ReviewTemplate = {
      ...data,
      id: nextId,
      code: `MDG${String(nextId).padStart(3, "0")}`,
    };

    writeStorage(TEMPLATE_KEY, [...templates, newTemplate]);

    return newTemplate;
  },

  updateTemplate(
    id: number,
    data: Partial<ReviewTemplate>
  ): ReviewTemplate | undefined {
    const templates = this.getTemplates();

    const index = templates.findIndex((item) => item.id === id);

    if (index === -1) return undefined;

    const updatedTemplate = {
      ...templates[index],
      ...data,
      id,
      code: templates[index].code,
    };

    templates[index] = updatedTemplate;

    writeStorage(TEMPLATE_KEY, templates);

    return updatedTemplate;
  },

  deleteTemplate(id: number): void {
    const templates = this.getTemplates();

    writeStorage(
      TEMPLATE_KEY,
      templates.filter((item) => item.id !== id)
    );
  },

  deleteManyTemplates(ids: number[]): void {
    const templates = this.getTemplates();

    writeStorage(
      TEMPLATE_KEY,
      templates.filter((item) => !ids.includes(item.id))
    );
  },
};
