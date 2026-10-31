import { Button, Form, Input, Modal, Select } from "antd";
import { DEVICE_TYPE, DEVICE_AVAILABILITY } from "../../constants/enums";

import DeviceServiceSelector from "./DeviceServiceSelector";

import type { DeviceType, DeviceAvailability } from "../../constants/enums";

import styles from "./AddDeviceModal.module.css";

const { TextArea } = Input;

export interface AddDeviceFormValues {
  deviceCode: string;
  deviceName: string;
  deviceType: DeviceType;
  availability: DeviceAvailability;
  serviceIds: string[];
  description?: string;
}

interface AddDeviceModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: AddDeviceFormValues) => void;
}

export default function AddDeviceModal({
  open,
  onCancel,
  onSubmit,
}: AddDeviceModalProps) {
  const [form] = Form.useForm<AddDeviceFormValues>();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: AddDeviceFormValues) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      centered
      destroyOnHidden
      className={styles.addDeviceModal}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>Thêm thiết bị</h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className={styles.form}
        >
          {/* ===== THÔNG TIN THIẾT BỊ ===== */}

          <div className={styles.formGrid}>
            <Form.Item
              label="Mã thiết bị"
              name="deviceCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã thiết bị",
                },
              ]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>

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

          {/* ===== DỊCH VỤ SỬ DỤNG ===== */}

          <div className={styles.serviceSection}>
            <label className={styles.sectionLabel}>
              Dịch vụ sử dụng <span>*</span>
            </label>

            <Form.Item
              name="serviceIds"
              initialValue={[]}
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

          {/* ===== MÔ TẢ ===== */}

          <Form.Item label="Mô tả" name="description">
            <TextArea placeholder="Nhập mô tả" rows={2} />
          </Form.Item>

          <p className={styles.requiredNote}>
            <span>*</span> Là trường thông tin bắt buộc
          </p>

          {/* ===== NÚT THAO TÁC ===== */}

          <div className={styles.actions}>
            <Button
              htmlType="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
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
