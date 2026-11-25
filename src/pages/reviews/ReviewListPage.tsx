
import {
  useSearchParams,
} from "react-router-dom";

import ReviewList from "../../components/reviews/ReviewList";
import ReviewTemplate from "../../components/reviews/ReviewTemplate";
import styles from "./ReviewListPage.module.css";

type ReviewTab = "list" | "template";

const ReviewListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: ReviewTab =
    searchParams.get("tab") === "template"
      ? "template"
      : "list";

  const handleTabChange = (tab: ReviewTab) => {
    if (tab === "template") {
      setSearchParams({ tab: "template" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={
              activeTab === "list"
                ? styles.activeTab
                : ""
            }
            onClick={() => handleTabChange("list")}
          >
            Danh sách đánh giá
          </button>

          <button
            type="button"
            className={
              activeTab === "template"
                ? styles.activeTab
                : ""
            }
            onClick={() => handleTabChange("template")}
          >
            Cài đặt mẫu đánh giá
          </button>
        </div>

        {/* Nội dung theo tab */}
        {activeTab === "list" ? (
          <ReviewList />
        ) : (
          <ReviewTemplate />
        )}
      </div>
    </div>
  );
};

export default ReviewListPage;
