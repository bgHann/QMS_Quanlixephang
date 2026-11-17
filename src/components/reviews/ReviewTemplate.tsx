import { useState } from "react";
import {
  Table,
  Input,
  Select,
  Tooltip,
  Modal,
  Pagination,
  Button,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import styles from "./ReviewTemplate.module.css";

interface TemplateItem {
  key: number;
  code: string;
  name: string;
  content: string;
  questions: string;
}

const initialTemplates: TemplateItem[] = [
  { key: 1, code: "2010001", name: "Khám tim mạch", content: "-", questions: "-" },
  { key: 2, code: "2010001", name: "Khám sản - Phụ Khoa", content: "-", questions: "-" },
  { key: 3, code: "2010001", name: "Khám răng hàm mặt", content: "Đánh giá thứ nhất: Tệ...", questions: "Đánh giá thứ nhất: Tệ..." },
  { key: 4, code: "2010001", name: "Khám tai mũi họng", content: "Dịch vụ tốt", questions: "Dịch vụ tốt" },
  { key: 5, code: "2010001", name: "Khám hô hấp", content: "-", questions: "-" },
  { key: 6, code: "2010001", name: "Khám tổng quát", content: "Chờ lâu", questions: "Chờ lâu" },
  { key: 7, code: "2010001", name: "Khám tai mũi họng", content: "-", questions: "-" },
  { key: 8, code: "2010001", name: "Khám tổng quát", content: "-", questions: "-" },
  { key: 9, code: "2010001", name: "Khám tai mũi họng", content: "-", questions: "-" },
  { key: 10, code: "2010001", name: "Khám tổng quát", content: "-", questions: "-" },
];

const ReviewTemplate = () => {
  const [data, setData] = useState<TemplateItem[]>(initialTemplates);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([1, 5]);
  const [searchText, setSearchText] = useState("");
  const [counter, setCounter] = useState("all");
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase());

    return matchSearch && (counter === "all" || item.name === counter);
  });

  const openAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setOpenModal(true);
  };

  const openEditModal = (record: TemplateItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingItem) {
        setData((prev) =>
          prev.map((item) =>
            item.key === editingItem.key ? { ...item, ...values } : item
          )
        );
        message.success("Cập nhật mẫu đánh giá thành công");
      } else {
        setData((prev) => [
          ...prev,
          {
            ...values,
            key: Date.now(),
            code: "2010001",
            questions: "-",
          },
        ]);
        message.success("Thêm mẫu đánh giá thành công");
      }

      setOpenModal(false);
      form.resetFields();
    } catch {
      // Giữ modal mở khi dữ liệu chưa hợp lệ
    }
  };

  const handleDelete = (record: TemplateItem) => {
    Modal.confirm({
      title: "Xóa mẫu đánh giá",
      content: `Bạn có chắc chắn muốn xóa mẫu "${record.name}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setData((prev) => prev.filter((item) => item.key !== record.key));
        setSelectedRowKeys((prev) => prev.filter((key) => key !== record.key));
        message.success("Đã xóa mẫu đánh giá");
      },
    });
  };

  const columns: ColumnsType<TemplateItem> = [
    {
      title: "Mã đánh giá",
      dataIndex: "code",
      width: "23%",
    },
    {
      title: "Tên đánh giá",
      dataIndex: "name",
      width: "22%",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: "23%",
      ellipsis: true,
    },
    {
      title: "Số câu hỏi",
      dataIndex: "questions",
      width: "22%",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <div className={styles.actions}>
          <Tooltip title="Thông tin mẫu">
            <InfoCircleOutlined
              onClick={() =>
                Modal.info({
                  title: "Thông tin mẫu đánh giá",
                  content: (
                    <div>
                      <p>Mã đánh giá: {record.code}</p>
                      <p>Tên đánh giá: {record.name}</p>
                      <p>Nội dung: {record.content}</p>
                    </div>
                  ),
                })
              }
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <EditOutlined onClick={() => openEditModal(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const deleteSelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn mẫu đánh giá cần xóa");
      return;
    }

    Modal.confirm({
      title: "Xóa mẫu đánh giá",
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} mẫu đã chọn?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setData((prev) =>
          prev.filter((item) => !selectedRowKeys.includes(item.key))
        );
        setSelectedRowKeys([]);
        message.success("Đã xóa các mẫu được chọn");
      },
    });
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
              { label: "Khám hô hấp", value: "Khám hô hấp" },
              { label: "Khám tổng quát", value: "Khám tổng quát" },
            ]}
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

      <div className={styles.sideActions}>
        <Tooltip title="Thêm mẫu đánh giá">
          <button onClick={openAddModal}>
            <PlusOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Cài đặt câu hỏi">
          <button
            onClick={() =>
              message.info("Chức năng cài đặt câu hỏi sẽ được triển khai tiếp")
            }
          >
            <SettingOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Xóa mẫu đã chọn">
          <button className={styles.deleteButton} onClick={deleteSelected}>
            <DeleteOutlined />
          </button>
        </Tooltip>
      </div>

      <Modal
        title={editingItem ? "Cập nhật mẫu đánh giá" : "Thêm mẫu đánh giá"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên đánh giá"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên đánh giá" }]}
          >
            <Input placeholder="Nhập tên đánh giá" />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập nội dung đánh giá" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewTemplate;