import { useState } from "react";
import {
  Table,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Modal,
  Pagination,
  message,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "./ReviewList.module.css";

const { RangePicker } = DatePicker;

interface ReviewItem {
  key: number;
  code: string;
  counter: string;
  time: string;
  content: string;
}

const initialData: ReviewItem[] = [
  {
    key: 1,
    code: "2010001",
    counter: "Khám tim mạch",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
  {
    key: 2,
    code: "2010001",
    counter: "Khám sản - Phụ Khoa",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
  {
    key: 3,
    code: "2010001",
    counter: "Khám răng hàm mặt",
    time: "14:35 - 07/11/2021",
    content: "Đánh giá thứ nhất: Tốt",
  },
  {
    key: 4,
    code: "2010001",
    counter: "Khám tai mũi họng",
    time: "14:35 - 07/11/2021",
    content: "Dịch vụ tốt",
  },
  {
    key: 5,
    code: "2010001",
    counter: "Khám hô hấp",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
  {
    key: 6,
    code: "2010001",
    counter: "Khám tổng quát",
    time: "14:35 - 07/11/2021",
    content: "Chờ lâu",
  },
  {
    key: 7,
    code: "2010001",
    counter: "Khám tai mũi họng",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
  {
    key: 8,
    code: "2010001",
    counter: "Khám tổng quát",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
  {
    key: 9,
    code: "2010001",
    counter: "Khám tai mũi họng",
    time: "14:35 - 07/11/2021",
    content: "-",
  },
];

const ReviewList = () => {
  const [data] = useState<ReviewItem[]>(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([5]);
  const [searchText, setSearchText] = useState("");
  const [counter, setCounter] = useState("all");
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  const [detail, setDetail] = useState<ReviewItem | null>(null);

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.counter.toLowerCase().includes(searchText.toLowerCase());

    const matchCounter =
      counter === "all" || item.counter === counter;

    return matchSearch && matchCounter;
  });

  const columns: ColumnsType<ReviewItem> = [
    {
      title: "STT đánh giá",
      dataIndex: "code",
      width: "22%",
    },
    {
      title: "Quầy dịch vụ",
      dataIndex: "counter",
      width: "22%",
    },
    {
      title: "Thời gian đánh giá",
      dataIndex: "time",
      width: "22%",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: "22%",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: "12%",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <InfoCircleOutlined
            className={styles.actionIcon}
            onClick={() => setDetail(record)}
          />
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterArea}>
        <div className={styles.filterItem}>
          <label>Tìm kiếm</label>
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <div className={styles.filterItem}>
          <label>Quầy dịch vụ</label>
          <Select
            value={counter}
            onChange={setCounter}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Khám tim mạch", value: "Khám tim mạch" },
              { label: "Khám sản - Phụ Khoa", value: "Khám sản - Phụ Khoa" },
              { label: "Khám răng hàm mặt", value: "Khám răng hàm mặt" },
              { label: "Khám tai mũi họng", value: "Khám tai mũi họng" },
              { label: "Khám hô hấp", value: "Khám hô hấp" },
              { label: "Khám tổng quát", value: "Khám tổng quát" },
            ]}
          />
        </div>

        <div className={styles.filterItem}>
          <label>Chọn thời gian</label>
          <RangePicker
            format="DD/MM/YYYY"
            placeholder={["10/10/2021", "19/10/2021"]}
            suffixIcon={<CalendarOutlined />}
            separator={<span className={styles.dateSeparator}>›</span>}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
          pagination={false}
          size="small"
          tableLayout="fixed"
          rowClassName={(record) =>
            selectedRowKeys.includes(record.key) ? styles.selectedRow : ""
          }
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.pageSize}>
          <span>Đang hiển thị</span>
          <Select
            value={pageSize}
            onChange={setPageSize}
            options={[
              { label: "10", value: 10 },
              { label: "20", value: 20 },
              { label: "50", value: 50 },
            ]}
          />
          <span>kết quả</span>
        </div>

        <Pagination
          current={page}
          pageSize={pageSize}
          total={30}
          onChange={setPage}
          showSizeChanger={false}
          itemRender={(current, type, originalElement) => {
            if (type === "prev") return <span>‹ Trước</span>;
            if (type === "next") return <span>Sau ›</span>;
            return originalElement;
          }}
        />
      </div>

      <div className={styles.sideAction}>
        <Tooltip title="Phản hồi">
          <button onClick={() => message.info("Chức năng phản hồi")}>
            <MessageOutlined />
          </button>
        </Tooltip>
      </div>

      <Modal
        title="Chi tiết đánh giá"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={null}
        centered
      >
        {detail && (
          <div className={styles.detailContent}>
            <p><b>STT đánh giá:</b> {detail.code}</p>
            <p><b>Quầy dịch vụ:</b> {detail.counter}</p>
            <p><b>Thời gian:</b> {detail.time}</p>
            <p><b>Nội dung:</b> {detail.content}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;