import React from "react";
import { Breadcrumb, Typography } from "antd";

interface Props {
  title: string;
  items?: string[];
}

const PageHeader: React.FC<Props> = ({
  title,
  items = [],
}) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Breadcrumb
        items={[
          { title: "QMS" },
          ...items.map((item) => ({ title: item })),
        ]}
        style={{
          fontSize: 12,
          marginBottom: 5,
        }}
      />

      <Typography.Title
        level={4}
        style={{
          color: "#ff7900",
          margin: 0,
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        {title}
      </Typography.Title>
    </div>
  );
};

export default PageHeader;