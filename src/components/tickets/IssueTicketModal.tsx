import React, { useState } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
} from "antd";
import { ticketService } from "../../api/services/ticketService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const services = [
  "Khám sản - Phụ Khoa",
  "Khám tim mạch",
  "Khám răng hàm mặt",
  "Khám tai mũi họng",
  "Khám hô hấp",
];

const IssueTicketModal: React.FC<Props> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      try {
        setLoading(true);

        const ticket = ticketService.issueTicket(values.serviceName);

        message.success(
          `Cấp số thành công: ${ticket.ticketNumber}`
        );

        form.resetFields();
        onSuccess();
        onClose();
      } catch (error) {
        message.error(
          error instanceof Error
            ? error.message
            : "Không thể cấp số."
        );
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <Modal
      title="Cấp số mới"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="serviceName"
          label="Tên dịch vụ"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn dịch vụ",
            },
          ]}
        >
          <Select
            placeholder="Chọn dịch vụ"
            options={services.map((service) => ({
              label: service,
              value: service,
            }))}
          />
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <Button onClick={onClose}>Hủy</Button>

          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            style={{
              background: "#ff7900",
              borderColor: "#ff7900",
            }}
          >
            Cấp số
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default IssueTicketModal;