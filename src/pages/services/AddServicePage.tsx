import { useState, useEffect } from "react";
import { Button, Form, Input, Radio, Select, Upload, message } from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../constants/routes";
import { SERVICE_STATUS } from "../../types/service";

import styles from "./AddServicePage.module.css";
import ServiceScheduleFields from "../../components/services/ServiceScheduleFields";

import type { Dayjs } from "dayjs";

import { serviceService } from "../../api/services/serviceService";

import type { ServiceSchedule } from "../../types/service";

const { TextArea } = Input;

type AssignmentMethod = "ASSIGN_ON_ISSUE" | "ASSIGN_ON_CALL";

interface ServiceScheduleFormDay {
  enabled?: boolean;
  startTime?: Dayjs;
  endTime?: Dayjs;
  shiftIds?: string[];
}

interface AddServiceFormValues {
  serviceCode: string;
  serviceName: string;
  description: string;

  assignmentMethod: AssignmentMethod;
  status: "ACTIVE" | "INACTIVE";

  schedule?: Record<string, ServiceScheduleFormDay>;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Không thể đọc hình ảnh"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Không thể đọc hình ảnh"));
    };

    reader.readAsDataURL(file);
  });
};

export default function AddServicePage() {
  const navigate = useNavigate();

  const [form] = Form.useForm<AddServiceFormValues>();
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFinish = async (values: AddServiceFormValues) => {
    try {
      // Chuyển dữ liệu lịch xử lý sang định dạng lưu trữ
      const schedule: ServiceSchedule = {};

      for (const [dayKey, day] of Object.entries(values.schedule ?? {})) {
        if (!day.enabled) {
          schedule[dayKey] = {
            enabled: false,
            shiftIds: [],
          };

          continue;
        }

        schedule[dayKey] = {
          enabled: true,

          startTime: day.startTime?.format("HH:mm"),
          endTime: day.endTime?.format("HH:mm"),

          shiftIds: [...(day.shiftIds ?? [])],
        };
      }

      // Lưu dịch vụ mới
      // Chuyển ảnh đã chọn sang Base64
      let imageUrl: string | undefined;

      const selectedFile = imageFiles[0]?.originFileObj;

      if (selectedFile) {
        imageUrl = await fileToBase64(selectedFile);
      }

      // Lưu dịch vụ mới
      const createdService = await serviceService.create({
        serviceCode: values.serviceCode,
        serviceName: values.serviceName,
        description: values.description,
        assignmentMethod: values.assignmentMethod,
        status: values.status,
        schedule,
        imageUrl,
      });

      message.success(
        `Đã thêm dịch vụ ${createdService.serviceCode} thành công`,
      );

      // Quay về trang danh sách
      navigate(ROUTES.SERVICES);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể thêm dịch vụ. Vui lòng thử lại.";

      message.error(errorMessage);
    }
  };

  useEffect(() => {
    const selectedFile = imageFiles[0]?.originFileObj;

    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFiles]);

  return (
    <div className={styles.page}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          assignmentMethod: "ASSIGN_ON_ISSUE",
          status: SERVICE_STATUS.ACTIVE,
        }}
        className={styles.form}
      >
        <div className={styles.content}>
          {/* ===== THÔNG TIN DỊCH VỤ ===== */}
          <section className={styles.leftColumn}>
            <h3 className={styles.sectionTitle}>Thông tin dịch vụ</h3>

            <Form.Item
              label="Mã dịch vụ"
              name="serviceCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã dịch vụ",
                },
              ]}
            >
              <Input placeholder="Mã dịch vụ" />
            </Form.Item>

            <Form.Item
              label="Tên dịch vụ"
              name="serviceName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên dịch vụ",
                },
              ]}
            >
              <Input placeholder="Tên dịch vụ" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả dịch vụ",
                },
              ]}
            >
              <TextArea placeholder="Nhập mô tả" rows={2} />
            </Form.Item>

            {/* ===== HÌNH ẢNH DỊCH VỤ ===== */}
            <div className={styles.imageSection}>
              <div className={styles.fieldLabel}>
                Hình ảnh
                <span className={styles.fieldHint}>
                  {" "}
                  Được sử dụng làm hình đại diện dịch vụ hiển thị ở Kiosk lấy số
                  hình ảnh
                </span>
              </div>

              <Upload
                accept="image/*"
                maxCount={1}
                fileList={imageFiles}
                beforeUpload={(file) => {
                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ];

                  if (!allowedTypes.includes(file.type)) {
                    message.error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP");
                    return Upload.LIST_IGNORE;
                  }

                  const maxSize = 1024 * 1024;

                  if (file.size > maxSize) {
                    message.error("Dung lượng ảnh không được vượt quá 1 MB");
                    return Upload.LIST_IGNORE;
                  }

                  // Không upload lên server
                  return false;
                }}
                onChange={({ fileList }) => {
                  setImageFiles(fileList);
                }}
                onRemove={() => {
                  setImageFiles([]);
                }}
              >
                <Button
                  icon={<UploadOutlined />}
                  className={styles.uploadButton}
                >
                  Chọn ảnh tải lên
                </Button>
              </Upload>
              {previewUrl && (
                <div className={styles.imagePreview}>
                  <img
                    src={previewUrl}
                    alt="Xem trước hình ảnh dịch vụ"
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>

            {/* ===== HÌNH THỨC PHÂN QUẦY ===== */}
            <Form.Item
              label="Hình thức phân quầy"
              name="assignmentMethod"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình thức phân quầy",
                },
              ]}
            >
              <Radio.Group className={styles.assignmentGroup}>
                <Radio.Button
                  value="ASSIGN_ON_ISSUE"
                  className={styles.assignmentOption}
                >
                  <strong>Chỉ định quầy khi cấp số</strong>
                  <span>
                    Khi người dùng lấy số, hệ thống gán ngay quầy phục vụ phù
                    hợp
                  </span>
                </Radio.Button>

                <Radio.Button
                  value="ASSIGN_ON_CALL"
                  className={styles.assignmentOption}
                >
                  <strong>Phân quầy khi gọi số</strong>
                  <span>
                    Số thứ tự được phân đến quầy khi có quầy trống gọi số phục
                    vụ
                  </span>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* ===== TRẠNG THÁI ===== */}
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái",
                },
              ]}
            >
              <Select
                options={[
                  {
                    value: SERVICE_STATUS.ACTIVE,
                    label: "Hoạt động",
                  },
                  {
                    value: SERVICE_STATUS.INACTIVE,
                    label: "Ngưng hoạt động",
                  },
                ]}
              />
            </Form.Item>

            <p className={styles.requiredNote}>
              <span>*</span> Là trường thông tin bắt buộc
            </p>
          </section>

          {/* ===== THỜI GIAN XỬ LÝ ===== */}
          <section className={styles.rightColumn}>
            <h3 className={styles.sectionTitle}>Thời gian xử lý</h3>

            <ServiceScheduleFields form={form} />
          </section>
        </div>

        {/* ===== NÚT THAO TÁC ===== */}
        <div className={styles.actions}>
          <Button
            htmlType="button"
            className={styles.cancelButton}
            onClick={() => navigate(ROUTES.SERVICES)}
          >
            Hủy bỏ
          </Button>

          <Button
            htmlType="submit"
            type="primary"
            className={styles.confirmButton}
          >
            Xác nhận
          </Button>
        </div>
      </Form>
    </div>
  );
}
