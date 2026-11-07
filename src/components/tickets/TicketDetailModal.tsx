import React from "react";
import { Modal, Descriptions } from "antd";
import { Ticket } from "../../types/ticket";
import StatusTag from "../common/StatusTag";

interface Props {
  open: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

const TicketDetailModal: React.FC<Props> = ({
  open,
  ticket,
  onClose,
}) => {
  if (!ticket) return null;

  return (
    <Modal
      title="Chi tiết cấp số"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Số thứ tự">
          {ticket.ticketNumber}
        </Descriptions.Item>

        <Descriptions.Item label="Tên dịch vụ">
          {ticket.serviceName}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian cấp">
          {ticket.issueTime}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian sử dụng">
          {ticket.useTime}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <StatusTag status={ticket.status} />
        </Descriptions.Item>

        <Descriptions.Item label="Người thực hiện">
          {ticket.staffName}
        </Descriptions.Item>

        <Descriptions.Item label="Quầy dịch vụ">
          {ticket.counterName}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TicketDetailModal;