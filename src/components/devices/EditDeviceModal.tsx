import { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";

import { DEVICE_TYPE, DEVICE_AVAILABILITY } from "../../constants/enums";

import type { Device } from "../../types/device";

import DeviceServiceSelector from "./DeviceServiceSelector";

import styles from "./EditDeviceModal.module.css";

const { TextArea } = Input;

// Những trường được phép cập nhật
export type EditDeviceFormValues = Pick<
  Device,
  "deviceName" | "deviceType" | "availability" | "serviceIds" | "description"
>;

interface EditDeviceModalProps {
  open: boolean;
  device: Device | null;
  onCancel: () => void;
  onSubmit: (values: EditDeviceFormValues) => void;
}

export default function EditDeviceModal({
  open,
  device,
  onCancel,
  onSubmit,
}: EditDeviceModalProps) {
  const [form] = Form.useForm<EditDeviceFormValues>();

  // Điền dữ liệu hiện tại khi mở popup
  useEffect(() => {
    if (open && device) {
      form.setFieldsValue({
        deviceName: device.deviceName,
        deviceType: device.deviceType,
        availability: device.availability,
        serviceIds: [...device.serviceIds],
        description: device.description ?? "",
      });
    }
  }, [open, device, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: EditDeviceFormValues) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={900}
      centered
      destroyOnHidden
      className={styles.editDeviceModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Chỉnh sửa thiết bị</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            {/* MÃ THIẾT BỊ */}
            <Form.Item label="Mã thiết bị" required>
              <Input value={device?.deviceCode ?? ""} disabled />
            </Form.Item>

            {/* TÊN THIẾT BỊ */}
            <Form.Item
              label="Tên thiết bị"
              name="deviceName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên thiết bị",
                },
              ]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>

            {/* LOẠI THIẾT BỊ */}
            <Form.Item
              label="Loại thiết bị"
              name="deviceType"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn loại thiết bị",
                },
              ]}
            >
              <Select
                placeholder="Chọn loại thiết bị"
                options={[
                  {
                    label: "Kiosk",
                    value: DEVICE_TYPE.KIOSK,
                  },
                  {
                    label: "Màn hình trung tâm",
                    value: DEVICE_TYPE.MAIN_DISPLAY,
                  },
                  {
                    label: "Màn hình quầy",
                    value: DEVICE_TYPE.COUNTER_DISPLAY,
                  },
                  {
                    label: "Thiết bị đánh giá",
                    value: DEVICE_TYPE.RATING_DEVICE,
                  },
                ]}
              />
            </Form.Item>

            {/* TRẠNG THÁI KHẢ DỤNG */}
            <Form.Item
              label="Trạng thái khả dụng"
              name="availability"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái",
                },
              ]}
            >
              <Select
                placeholder="Chọn trạng thái khả dụng"
                options={[
                  {
                    label: "Khả dụng",
                    value: DEVICE_AVAILABILITY.AVAILABLE,
                  },
                  {
                    label: "Không khả dụng",
                    value: DEVICE_AVAILABILITY.UNAVAILABLE,
                  },
                ]}
              />
            </Form.Item>
          </div>

          {/* DỊCH VỤ SỬ DỤNG */}
          <div className={styles.serviceSection}>
            <label className={styles.sectionLabel}>
              Dịch vụ sử dụng <span>*</span>
            </label>

            <Form.Item
              name="serviceIds"
              rules={[
                {
                  validator: (_, value: string[]) => {
                    if (value?.length > 0) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Vui lòng chọn ít nhất một dịch vụ"),
                    );
                  },
                },
              ]}
            >
              <DeviceServiceSelector />
            </Form.Item>
          </div>

          {/* MÔ TẢ */}
          <Form.Item label="Mô tả" name="description">
            <TextArea placeholder="Nhập mô tả" rows={2} />
          </Form.Item>

          <p className={styles.requiredNote}>
            <span>*</span> Là trường thông tin bắt buộc
          </p>

          {/* NÚT THAO TÁC */}
          <div className={styles.actions}>
            <Button className={styles.cancelButton} onClick={handleCancel}>
              Hủy bỏ
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className={styles.confirmButton}
            >
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
