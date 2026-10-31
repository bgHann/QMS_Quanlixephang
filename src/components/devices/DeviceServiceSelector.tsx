import { useMemo } from "react";
import { deviceServiceNamesMock } from "../../mock/devices.mock";
import styles from "./DeviceServiceSelector.module.css";

export interface ServiceOption {
  id: string;
  name: string;
}

interface DeviceServiceSelectorProps {
  value?: string[];
  onChange?: (serviceIds: string[]) => void;
}

export default function DeviceServiceSelector({
  value = [],
  onChange,
}: DeviceServiceSelectorProps) {
  // Chuyển dữ liệu mock thành danh sách dịch vụ
  const services = useMemo<ServiceOption[]>(() => {
    return Object.entries(deviceServiceNamesMock).map(([id, name]) => ({
      id,
      name,
    }));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.availableServices}>
        {services.map((service) => {
          const isSelected = value.includes(service.id);

          return (
            <div
              key={service.id}
              className={`${styles.serviceItem} ${
                isSelected ? styles.serviceItemSelected : ""
              }`}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              draggable
              onClick={() => {
                if (!isSelected) {
                  onChange?.([...value, service.id]);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();

                  if (!isSelected) {
                    onChange?.([...value, service.id]);
                  }
                }
              }}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", service.id);
                event.dataTransfer.effectAllowed = "copy";
              }}
            >
              {service.name}
            </div>
          );
        })}
      </div>

      {/* KHU VỰC SẮP XẾP DỊCH VỤ */}
      <div
        className={styles.serviceGrid}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
      >
        {Array.from({ length: 16 }, (_, index) => {
          const serviceId = value[index];

          const service = services.find((item) => item.id === serviceId);

          return (
            <div
              key={index}
              className={`${styles.serviceSlot} ${
                service ? styles.serviceSlotFilled : ""
              }`}
              onDrop={(event) => {
                event.preventDefault();

                const droppedId = event.dataTransfer.getData("text/plain");

                const serviceExists = services.some(
                  (item) => item.id === droppedId,
                );

                if (!serviceExists || value.includes(droppedId)) {
                  return;
                }

                // Tạm thời thêm dịch vụ vào danh sách đã chọn
                onChange?.([...value, droppedId]);
              }}
            >
              {service ? (
                <div className={styles.filledService}>
                  <span className={styles.serviceName}>{service.name}</span>

                  <button
                    type="button"
                    className={styles.removeButton}
                    aria-label={`Xóa dịch vụ ${service.name}`}
                    onClick={() => {
                      onChange?.(value.filter((id) => id !== service.id));
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className={styles.slotPlaceholder}>
                  Kéo thả để sắp xếp
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
