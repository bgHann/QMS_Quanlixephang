
import React from "react";
import { Tag } from "antd";
import { TicketStatus } from "../../types/ticket";
import {
  TICKET_STATUS_LABELS,
  TICKET_STATUS_COLORS,
} from "../../constants/enums";

interface StatusTagProps {
  status: TicketStatus;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  return (
    <Tag
      color={TICKET_STATUS_COLORS[status]}
      style={{
        border: "none",
        borderRadius: 12,
        fontSize: 11,
        padding: "1px 8px",
      }}
    >
      {TICKET_STATUS_LABELS[status]}
    </Tag>
  );
};

export default StatusTag;
