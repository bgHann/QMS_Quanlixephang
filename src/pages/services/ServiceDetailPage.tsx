import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildServiceEditPath } from "../../constants/routes";
import { Spin, Empty, message } from "antd";

import { serviceService } from "../../api/services/serviceService";
import type { Service } from "../../types/service";

import styles from "./ServiceDetailPage.module.css";

import ServiceHistoryTable from "../../components/services/ServiceHistoryTable";

const SCHEDULE_DAYS = [
  { key: "monday", label: "Thứ 2" },
  { key: "tuesday", label: "Thứ 3" },
  { key: "wednesday", label: "Thứ 4" },
  { key: "thursday", label: "Thứ 5" },
  { key: "friday", label: "Thứ 6" },
  { key: "saturday", label: "Thứ 7" },
  { key: "sunday", label: "Chủ nhật" },
  { key: "holiday", label: "Ngày lễ" },
] as const;

export default function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;

    const fetchService = async () => {
      setLoading(true);

      try {
        const result = await serviceService.getById(serviceId ?? "");

        if (active) {
          setService(result);
        }
      } catch {
        if (active) {
          message.error("Không thể tải thông tin dịch vụ");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchService();

    return () => {
      active = false;
    };
  }, [serviceId]);

  if (loading) {
    return <Spin />;
  }

  if (!service) {
    return <Empty description="Không tìm thấy dịch vụ" />;
  }
  const activeSchedule = SCHEDULE_DAYS.flatMap(({ key, label }) => {
    const day = service.schedule?.[key];

    if (!day?.enabled || !day.startTime || !day.endTime) {
      return [];
    }

    return [
      {
        key,
        label,
        time: `${day.startTime} - ${day.endTime}`,
      },
    ];
  });

  return (
    <div className={styles.page}>
      {/* ===== THÔNG TIN DỊCH VỤ ===== */}
      <section className={styles.infoPanel}>
        <h2 className={styles.infoTitle}>Thông tin dịch vụ</h2>

        <div className={styles.infoContent}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mã dịch vụ:</span>
            <span className={styles.infoValue}>{service.serviceCode}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Tên dịch vụ:</span>
            <span className={styles.infoValue}>{service.serviceName}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mô tả:</span>
            <span className={styles.infoValue}>
              {service.description || "Chưa có mô tả"}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Hình ảnh:</span>

            <div className={styles.infoValue}>
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.serviceName}
                  className={styles.serviceImage}
                />
              ) : (
                <div className={styles.emptyImage}>Chưa có hình ảnh</div>
              )}
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Thời gian:</span>

            <div className={styles.scheduleList}>
              {activeSchedule.length > 0 ? (
                activeSchedule.map((day) => (
                  <div key={day.key} className={styles.scheduleItem}>
                    <span>{day.label}:</span>
                    <span>{day.time}</span>
                  </div>
                ))
              ) : (
                <span>Chưa thiết lập</span>
              )}
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Quầy thực hiện:</span>
            <span className={styles.infoValue}>
              {service.counterIds.length
                ? serviceService.getCounterNames(service.counterIds).join(", ")
                : "Chưa phân quầy"}
            </span>
          </div>
        </div>

        {/* Sẽ kết nối đến trang cập nhật ở bước sau */}
        <button
          className={styles.updateButton}
          type="button"
          onClick={() => navigate(buildServiceEditPath(service.serviceId))}
        >
          Cập nhật
        </button>
      </section>

      {/* ===== LỊCH SỬ SỬ DỤNG ===== */}
      <section className={styles.historyPanel}>
        <ServiceHistoryTable serviceId={service.serviceId} />
      </section>
    </div>
  );
}
