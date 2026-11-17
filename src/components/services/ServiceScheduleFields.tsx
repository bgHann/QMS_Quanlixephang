import { Form, Select, Switch, TimePicker } from "antd";

import type { FormInstance } from "antd";

import styles from "./ServiceScheduleFields.module.css";

const DAYS = [
  { key: "monday", label: "Thứ 2" },
  { key: "tuesday", label: "Thứ 3" },
  { key: "wednesday", label: "Thứ 4" },
  { key: "thursday", label: "Thứ 5" },
  { key: "friday", label: "Thứ 6" },
  { key: "saturday", label: "Thứ 7" },
  { key: "sunday", label: "Chủ nhật" },
  { key: "holiday", label: "Ngày lễ" },
] as const;

// Dữ liệu ca tạm thời, sẽ kết nối danh sách ca thật sau
const SHIFT_OPTIONS = [
  {
    value: "CA_01",
    label: "Ca 1 (09:00 - 12:00)",
  },
  {
    value: "CA_02",
    label: "Ca 2 (13:00 - 17:00)",
  },
  {
    value: "CA_03",
    label: "Ca 3 (17:00 - 21:00)",
  },
];

interface ScheduleRowProps {
  dayKey: string;
  label: string;
  form: FormInstance;
}

function ScheduleRow({ dayKey, label, form }: ScheduleRowProps) {
  const enabled = Form.useWatch(["schedule", dayKey, "enabled"], form);

  return (
    <div className={styles.scheduleRow}>
      <span className={styles.dayLabel}>{label}</span>

      <Form.Item
        name={["schedule", dayKey, "enabled"]}
        valuePropName="checked"
        className={styles.fieldItem}
      >
        <Switch
          size="small"
          onChange={(checked) => {
            if (!checked) {
              form.setFieldValue(["schedule", dayKey, "startTime"], undefined);

              form.setFieldValue(["schedule", dayKey, "endTime"], undefined);

              form.setFieldValue(["schedule", dayKey, "shiftIds"], []);
            }
          }}
        />
      </Form.Item>

      <Form.Item
        name={["schedule", dayKey, "startTime"]}
        dependencies={[["schedule", dayKey, "enabled"]]}
        className={styles.fieldItem}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              const isEnabled = getFieldValue(["schedule", dayKey, "enabled"]);

              if (!isEnabled || value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error("Vui lòng chọn giờ bắt đầu"));
            },
          }),
        ]}
      >
        <TimePicker
          format="HH:mm"
          placeholder="00:00"
          minuteStep={5}
          disabled={!enabled}
          className={styles.timePicker}
        />
      </Form.Item>

      <span className={styles.timeSeparator}>›</span>

      <Form.Item
        name={["schedule", dayKey, "endTime"]}
        dependencies={[
          ["schedule", dayKey, "enabled"],
          ["schedule", dayKey, "startTime"],
        ]}
        className={styles.fieldItem}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, endTime) {
              const isEnabled = getFieldValue(["schedule", dayKey, "enabled"]);

              if (!isEnabled) {
                return Promise.resolve();
              }

              if (!endTime) {
                return Promise.reject(new Error("Vui lòng chọn giờ kết thúc"));
              }

              const startTime = getFieldValue([
                "schedule",
                dayKey,
                "startTime",
              ]);

              if (!startTime) {
                return Promise.resolve();
              }

              if (!endTime.isAfter(startTime)) {
                return Promise.reject(
                  new Error("Giờ kết thúc phải sau giờ bắt đầu"),
                );
              }

              return Promise.resolve();
            },
          }),
        ]}
      >
        <TimePicker
          format="HH:mm"
          placeholder="00:00"
          minuteStep={5}
          disabled={!enabled}
          className={styles.timePicker}
        />
      </Form.Item>

      <Form.Item
        name={["schedule", dayKey, "shiftIds"]}
        dependencies={[["schedule", dayKey, "enabled"]]}
        className={styles.fieldItem}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value: string[] | undefined) {
              const isEnabled = getFieldValue(["schedule", dayKey, "enabled"]);

              if (!isEnabled || (value && value.length > 0)) {
                return Promise.resolve();
              }

              return Promise.reject(new Error("Vui lòng chọn ít nhất một ca"));
            },
          }),
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Chọn ca"
          options={SHIFT_OPTIONS}
          disabled={!enabled}
          maxTagCount="responsive"
          className={styles.shiftSelect}
        />
      </Form.Item>
    </div>
  );
}

interface ServiceScheduleFieldsProps {
  form: FormInstance;
}

export default function ServiceScheduleFields({
  form,
}: ServiceScheduleFieldsProps) {
  return (
    <div className={styles.schedule}>
      <div className={styles.scheduleHeader}>
        <span>Thời gian áp dụng</span>
        <span>Thời gian xử lý</span>
      </div>

      <div className={styles.scheduleRows}>
        {DAYS.map((day) => (
          <ScheduleRow
            key={day.key}
            dayKey={day.key}
            label={day.label}
            form={form}
          />
        ))}
      </div>
    </div>
  );
}
