import React, { useEffect, useState } from "react";
import type { Counter } from "../../types/serviceCounter";
import { counterService } from "../../api/services/counterService";
import ServiceCounterCard from "../../components/ServiceCounter/ServiceCounterCard";
import style from "./CouterPage.module.css";

const CounterPage: React.FC = () => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await counterService.getAll();

        setCounters(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quầy:", error);
        setError("Không thể tải danh sách quầy. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounters();
  }, []);

  // Trạng thái đang tải
  if (loading) {
    return <div className={style.message}>Đang tải dữ liệu...</div>;
  }

  // Trạng thái lỗi
  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  return (
    <div className={style.container}>
      {counters.length === 0 ? (
        <div className={style.empty}>Chưa có quầy dịch vụ nào.</div>
      ) : (
        counters.map((counter) => (
          <ServiceCounterCard key={counter.id} counter={counter} />
        ))
      )}
    </div>
  );
};

export default CounterPage;
