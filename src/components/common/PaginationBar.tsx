import { Pagination, Select, Space } from 'antd';

interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function PaginationBar({ page, pageSize, total, onPageChange, onPageSizeChange }: PaginationBarProps) {
  return (
    <div
      style={{
        flexShrink: 0, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', gap: 12, paddingTop: 12,
      }}
    >
      <Space size={6}>
        <span style={{ fontSize: 12 }}>Đang hiển thị</span>
        <Select
          size="small"
          value={pageSize}
          options={[10, 20, 50].map((n) => ({ value: n, label: n }))}
          onChange={onPageSizeChange}
          style={{ width: 58 }}
        />
        <span style={{ fontSize: 12 }}>kết quả</span>
      </Space>
      <Pagination
        current={page}
        pageSize={pageSize}
        total={total}
        showSizeChanger={false}
        size="small"
        onChange={onPageChange}
        itemRender={(_, type, original) =>
          type === 'prev' ? <span>‹ Trước</span> : type === 'next' ? <span>Sau ›</span> : original
        }
      />
    </div>
  );
}