
import { useState } from "react";
import {
  Table,
  Input,
  Select,
  Tooltip,
  Modal,
  Pagination,
  Button,
  Switch,
  Radio,
  Upload,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  CopyOutlined,
  CloseOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadProps } from "antd";
import styles from "./ReviewTemplate.module.css";

interface QuestionOption {
  id: number;
  value: string;
}

interface ReviewQuestion {
  id: number;
  title: string;
  type: "choice" | "text";
  options: QuestionOption[];
  required: boolean;
  allowOther: boolean;
}

interface TemplateItem {
  key: number;
  code: string;
  name: string;
  content: string;
  questions: string;
  questionList?: ReviewQuestion[];
}

const createQuestion = (): ReviewQuestion => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  title: "",
  type: "choice",
  options: [
    { id: Date.now(), value: "" },
    { id: Date.now() + 1, value: "" },
  ],
  required: false,
  allowOther: false,
});

const initialTemplates: TemplateItem[] = [
  { key: 1, code: "2010001", name: "Khám tim mạch", content: "-", questions: "-" },
  { key: 2, code: "2010002", name: "Khám sản - Phụ Khoa", content: "-", questions: "-" },
  { key: 3, code: "2010003", name: "Khám răng hàm mặt", content: "Đánh giá thứ nhất: Tệ...", questions: "2 câu hỏi" },
  { key: 4, code: "2010004", name: "Khám tai mũi họng", content: "Dịch vụ tốt", questions: "2 câu hỏi" },
  { key: 5, code: "2010005", name: "Khám hô hấp", content: "-", questions: "-" },
  { key: 6, code: "2010006", name: "Khám tổng quát", content: "Chờ lâu", questions: "2 câu hỏi" },
  { key: 7, code: "2010007", name: "Khám tai mũi họng", content: "-", questions: "-" },
  { key: 8, code: "2010008", name: "Khám tổng quát", content: "-", questions: "-" },
  { key: 9, code: "2010009", name: "Khám tai mũi họng", content: "-", questions: "-" },
  { key: 10, code: "2010010", name: "Khám tổng quát", content: "-", questions: "-" },
];

const ReviewTemplate = () => {
  const [data, setData] = useState<TemplateItem[]>(initialTemplates);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [counter, setCounter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TemplateItem | null>(null);
  const [templateCode, setTemplateCode] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);

  const [settingOpen, setSettingOpen] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("all");

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.code.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.toLowerCase().includes(searchText.toLowerCase());

    return matchSearch && (counter === "all" || item.name === counter);
  });

  const openAddEditor = () => {
    setEditingItem(null);
    setTemplateCode(
      `201${String(Date.now()).slice(-4)}`
    );
    setTemplateName("");
    setTemplateContent("");
    setQuestions([createQuestion(), createQuestion()]);
    setEditorOpen(true);
  };

  const openEditEditor = (record: TemplateItem) => {
    setEditingItem(record);
    setTemplateCode(record.code);
    setTemplateName(record.name);
    setTemplateContent(record.content === "-" ? "" : record.content);
    setQuestions(
      record.questionList?.length
        ? record.questionList
        : [createQuestion(), createQuestion()]
    );
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingItem(null);
  };

  const updateQuestion = (
    questionId: number,
    changes: Partial<ReviewQuestion>
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, ...changes }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  const duplicateQuestion = (question: ReviewQuestion) => {
    const duplicated: ReviewQuestion = {
      ...question,
      id: Date.now() + Math.floor(Math.random() * 1000),
      options: question.options.map((option) => ({
        ...option,
        id: Date.now() + Math.floor(Math.random() * 1000),
      })),
    };

    setQuestions((prev) => [...prev, duplicated]);
  };

  const removeQuestion = (questionId: number) => {
    setQuestions((prev) => prev.filter((item) => item.id !== questionId));
  };

  const addOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                { id: Date.now(), value: "" },
              ],
            }
          : question
      )
    );
  };

  const updateOption = (
    questionId: number,
    optionId: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, value } : option
              ),
            }
          : question
      )
    );
  };

  const addOtherOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? { ...question, allowOther: true }
          : question
      )
    );
  };

  const handleSave = () => {
    if (!templateCode.trim()) {
      message.warning("Vui lòng nhập mã đánh giá");
      return;
    }

    if (!templateName.trim()) {
      message.warning("Vui lòng nhập tên đánh giá");
      return;
    }

    if (!templateContent.trim()) {
      message.warning("Vui lòng nhập nội dung đánh giá");
      return;
    }

    if (questions.length === 0) {
      message.warning("Vui lòng thêm ít nhất một câu hỏi");
      return;
    }

    if (questions.some((question) => !question.title.trim())) {
      message.warning("Vui lòng nhập tiêu đề cho tất cả câu hỏi");
      return;
    }

    const questionCount = `${questions.length} câu hỏi`;

    const newItem: TemplateItem = {
      key: editingItem ? editingItem.key : Date.now(),
      code: templateCode,
      name: templateName,
      content: templateContent,
      questions: questionCount,
      questionList: questions,
    };

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingItem.key ? newItem : item
        )
      );
      message.success("Cập nhật mẫu đánh giá thành công");
    } else {
      setData((prev) => [...prev, newItem]);
      message.success("Thêm mẫu đánh giá thành công");
    }

    closeEditor();
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
        setSelectedRowKeys((prev) =>
          prev.filter((key) => key !== record.key)
        );
        message.success("Đã xóa mẫu đánh giá");
      },
    });
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

  const uploadProps: UploadProps = {
    accept: ".xlsx,.xls,.csv",
    showUploadList: false,
    beforeUpload: (file) => {
      message.success(`Đã chọn tệp: ${file.name}`);
      return false;
    },
  };

  const columns: ColumnsType<TemplateItem> = [
    {
      title: "Mã đánh giá",
      dataIndex: "code",
      width: "20%",
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
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
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
                      <p>Số câu hỏi: {record.questions}</p>
                    </div>
                  ),
                })
              }
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <EditOutlined onClick={() => openEditEditor(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  if (editorOpen) {
    return (
      <div className={styles.editorPage}>
        <div className={styles.editorHeading}>
          {editingItem ? "Chỉnh sửa mẫu đánh giá" : "Thêm mẫu đánh giá"}
        </div>

        <div className={styles.editorLayout}>
          <div className={styles.basicInfo}>
            <div className={styles.formField}>
              <label>
                Mã đánh giá <span>*</span>
              </label>
              <Input
                value={templateCode}
                onChange={(e) => setTemplateCode(e.target.value)}
                placeholder="Nhập mã đánh giá"
              />
            </div>

            <div className={styles.formField}>
              <label>
                Tên đánh giá <span>*</span>
              </label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Nhập tên đánh giá"
              />
            </div>

            <div className={styles.formField}>
              <label>
                Nội dung đánh giá <span>*</span>
              </label>
              <Input
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                placeholder="Nhập nội dung đánh giá"
              />
            </div>

            <div className={styles.requiredNote}>
              <span>*</span> Là trường thông tin bắt buộc
            </div>
          </div>

          <div className={styles.questionArea}>
            <div className={styles.questionToolbar}>
              <div className={styles.questionCount}>
                Tổng số câu hỏi
                <strong>{questions.length}</strong>
                <span>/{Math.max(5, questions.length)}</span>
              </div>

              <Button
                icon={<PlusOutlined />}
                onClick={addQuestion}
                className={styles.outlineButton}
              >
                Thêm câu hỏi
              </Button>

              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  className={styles.outlineButton}
                >
                  Tải file lên
                </Button>
              </Upload>
            </div>

            <div className={styles.questionList}>
              {questions.map((question, index) => (
                <div className={styles.questionCard} key={question.id}>
                  <div className={styles.dragHandle}>
                    <HolderOutlined />
                  </div>

                  <div className={styles.questionCardContent}>
                    <div className={styles.questionHeader}>
                      <div className={styles.questionTitleField}>
                        <label>
                          Tiêu đề <span>*</span>
                        </label>
                        <Input
                          value={question.title}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              title: e.target.value,
                            })
                          }
                          placeholder="Nhập tiêu đề"
                        />
                      </div>

                      <div className={styles.questionTypeField}>
                        <label>
                          Loại câu hỏi <span>*</span>
                        </label>
                        <Select
                          value={question.type}
                          onChange={(value: "choice" | "text") =>
                            updateQuestion(question.id, {
                              type: value,
                            })
                          }
                          options={[
                            { label: "Trắc nghiệm", value: "choice" },
                            { label: "Câu trả lời nhập", value: "text" },
                          ]}
                        />
                      </div>
                    </div>

                    {question.type === "choice" ? (
                      <div className={styles.optionList}>
                        {question.options.map((option) => (
                          <div className={styles.optionRow} key={option.id}>
                            <Radio disabled />
                            <Input
                              value={option.value}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  e.target.value
                                )
                              }
                              placeholder="Nhập lựa chọn"
                            />
                            <button
                              className={styles.removeOption}
                              onClick={() =>
                                updateQuestion(question.id, {
                                  options: question.options.filter(
                                    (item) => item.id !== option.id
                                  ),
                                })
                              }
                              title="Xóa lựa chọn"
                            >
                              <CloseOutlined />
                            </button>
                          </div>
                        ))}

                        {question.allowOther && (
                          <div className={styles.optionRow}>
                            <Radio disabled />
                            <Input value="Người dùng nhập" disabled />
                            <button
                              className={styles.removeOption}
                              onClick={() =>
                                updateQuestion(question.id, {
                                  allowOther: false,
                                })
                              }
                            >
                              <CloseOutlined />
                            </button>
                          </div>
                        )}

                        <div className={styles.optionActions}>
                          <button onClick={() => addOption(question.id)}>
                            Thêm lựa chọn
                          </button>
                          <span />
                          <button onClick={() => addOtherOption(question.id)}>
                            Thêm “Khác”
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.textAnswer}>
                        <Input placeholder="Người dùng nhập" disabled />
                      </div>
                    )}

                    <div className={styles.questionFooter}>
                      <div className={styles.requiredSwitch}>
                        <Switch
                          size="small"
                          checked={question.required}
                          onChange={(checked) =>
                            updateQuestion(question.id, {
                              required: checked,
                            })
                          }
                        />
                        <span>Bắt buộc</span>
                      </div>

                      <button
                        title="Nhân bản câu hỏi"
                        onClick={() => duplicateQuestion(question)}
                      >
                        <CopyOutlined />
                      </button>

                      <button
                        title="Xóa câu hỏi"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className={styles.emptyQuestions}>
                  Chưa có câu hỏi. Nhấn “Thêm câu hỏi” để bắt đầu.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.editorFooter}>
          <Button onClick={closeEditor} className={styles.cancelButton}>
            Hủy bỏ
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            className={styles.confirmButton}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    );
  }

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
          size="middle"
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
            onChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
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
          total={filteredData.length}
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
          <button onClick={openAddEditor}>
            <PlusOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Cài đặt đánh giá">
          <button onClick={() => setSettingOpen(true)}>
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
        open={settingOpen}
        onCancel={() => setSettingOpen(false)}
        footer={null}
        centered
        width={430}
        closable={true}
        closeIcon={<CloseOutlined />}
        className={styles.settingModal}
      >
        <div className={styles.settingContent}>
          <h3>Cài đặt đánh giá</h3>

          <div className={styles.settingField}>
            <label>Cho phép đánh giá lặp lại số thứ tự</label>
            <Radio.Group
              value={allowRepeat}
              onChange={(e) => setAllowRepeat(e.target.value)}
              className={styles.repeatOptions}
            >
              <Radio.Button value={false}>Không cho phép</Radio.Button>
              <Radio.Button value={true}>Cho phép</Radio.Button>
            </Radio.Group>
          </div>

          <p className={styles.settingWarning}>
            Lưu ý: hành động này sẽ reset sau 24h nhằm tránh việc trùng số khi qua ngày
          </p>

          <div className={styles.settingField}>
            <label>Trạng thái về cho phép đánh giá</label>
            <Select
              value={reviewStatus}
              onChange={setReviewStatus}
              className={styles.statusSelect}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Cho phép đánh giá", value: "allowed" },
                { label: "Không cho phép đánh giá", value: "blocked" },
              ]}
            />
          </div>

          <div className={styles.settingActions}>
            <Button
              onClick={() => setSettingOpen(false)}
              className={styles.cancelButton}
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              className={styles.confirmButton}
              onClick={() => {
                setSettingOpen(false);
                message.success("Đã cập nhật cài đặt đánh giá");
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReviewTemplate;
