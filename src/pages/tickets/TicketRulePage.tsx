import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Radio,
  Switch,
  Tooltip,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import styles from "./TicketRulesPage.module.css";

type PrefixMode = "none" | "prefix" | "suffix" | "custom";
type NumberRangeMode = "independent" | "system";

interface ServiceRule {
  id: number;
  name: string;
  code: string;
  prefix: string;
  start: number;
  end: number;
}

const initialRules: ServiceRule[] = [
  {
    id: 1,
    name: "Khoa cấp cứu",
    code: "CAP",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 2,
    name: "Khoa sản",
    code: "SAN",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 3,
    name: "Khoa nhi",
    code: "NHI",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 4,
    name: "Khoa tim mạch",
    code: "TIM",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 5,
    name: "Khoa ung bướu",
    code: "BUO",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 6,
    name: "Khoa răng hàm mặt",
    code: "HAM",
    prefix: "",
    start: 999,
    end: 999,
  },
  {
    id: 7,
    name: "Khoa nội tiết",
    code: "NOT",
    prefix: "",
    start: 999,
    end: 999,
  },
];

const TicketRulesPage: React.FC = () => {
  const navigate = useNavigate();

  const [prefixMode, setPrefixMode] =
    useState<PrefixMode>("prefix");

  const [customPrefixEnabled, setCustomPrefixEnabled] =
    useState(false);

  const [customPrefix, setCustomPrefix] = useState("");

  const [rangeMode, setRangeMode] =
    useState<NumberRangeMode>("independent");

  const [rules, setRules] =
    useState<ServiceRule[]>(initialRules);

  const [previewRule, setPreviewRule] =
    useState<ServiceRule>(initialRules[0]);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 7;

  const totalPages = Math.max(
    1,
    Math.ceil(rules.length / pageSize)
  );

  const pagedRules = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return rules.slice(startIndex, startIndex + pageSize);
  }, [rules, currentPage]);

  const getPreviewNumber = () => {
    const prefix =
      prefixMode === "none"
        ? ""
        : prefixMode === "suffix"
        ? ""
        : prefixMode === "custom"
        ? customPrefix
        : previewRule.code;

    const suffix =
      prefixMode === "suffix"
        ? customPrefix
        : "";

    return `${prefix}${previewRule.start}${suffix}`;
  };

  const handleRuleChange = (
    id: number,
    field: "prefix" | "start" | "end",
    value: string | number | null
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              [field]:
                field === "prefix"
                  ? String(value ?? "")
                  : Number(value ?? 0),
            }
          : rule
      )
    );
  };

  const handleConfirm = () => {
    const invalidRule = rules.find(
      (rule) => rule.start > rule.end
    );

    if (invalidRule) {
      message.error(
        `Số bắt đầu của ${invalidRule.name} không được lớn hơn số kết thúc`
      );
      return;
    }

    message.success("Xác nhận thiết lập quy tắc thành công");

    const firstRule = rules[0];

    if (firstRule) {
      setPreviewRule(firstRule);
    }
  };

  const handleCancel = () => {
    setRules(initialRules);
    setPrefixMode("prefix");
    setCustomPrefixEnabled(false);
    setCustomPrefix("");
    setRangeMode("independent");
    setCurrentPage(1);
    setPreviewRule(initialRules[0]);

    message.info("Đã hủy các thay đổi");
  };

  return (
    <div className={styles.page}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={styles.tab}
          onClick={() => navigate("/tickets")}
        >
          Danh sách cấp số
        </button>

        <button className={styles.activeTab}>
          Cài đặt quy tắc
        </button>
      </div>

      {/* Nội dung */}
      <div className={styles.contentLayout}>
        {/* Cột thiết lập */}
        <div className={styles.settingsColumn}>
          <h2 className={styles.sectionTitle}>
            Thiết lập
          </h2>

          {/* Tiền tố / hậu tố */}
          <div className={styles.settingGroup}>
            <div className={styles.settingHeading}>
              <span>Tiền tố / hậu tố</span>

              <Tooltip title="Thiết lập ký tự hiển thị trước hoặc sau số thứ tự">
                <InfoCircleOutlined className={styles.infoIcon} />
              </Tooltip>
            </div>

            <Radio.Group
              value={prefixMode}
              onChange={(event) =>
                setPrefixMode(event.target.value)
              }
              className={styles.prefixOptions}
            >
              <Radio.Button value="none">
                Không có
              </Radio.Button>

              <Radio.Button value="prefix">
                Tiền tố
              </Radio.Button>

              <Radio.Button value="suffix">
                Hậu tố
              </Radio.Button>

              <Radio.Button value="custom">
                Tùy chỉnh
              </Radio.Button>
            </Radio.Group>

            {prefixMode === "custom" && (
              <div className={styles.customPrefix}>
                <Input
                  value={customPrefix}
                  placeholder="Nhập tiền tố tùy chỉnh"
                  maxLength={10}
                  onChange={(event) =>
                    setCustomPrefix(event.target.value)
                  }
                />
              </div>
            )}

            <div className={styles.customToggle}>
              <span>Mặc định sử dụng mã dịch vụ</span>

              <Switch
                size="small"
                checked={customPrefixEnabled}
                onChange={setCustomPrefixEnabled}
              />
            </div>
          </div>

          {/* Dãy số cấp */}
          <div className={styles.settingGroup}>
            <div className={styles.settingHeading}>
              <span>Dãy số cấp</span>

              <button
                className={styles.resetLink}
                onClick={() => {
                  setRules((prev) =>
                    prev.map((rule) => ({
                      ...rule,
                      start: 999,
                      end: 999,
                    }))
                  );
                }}
              >
                Reset
              </button>
            </div>

            <Radio.Group
              value={rangeMode}
              onChange={(event) =>
                setRangeMode(event.target.value)
              }
              className={styles.rangeOptions}
            >
              <Radio.Button value="independent">
                Riêng và độc lập
              </Radio.Button>

              <Radio.Button value="system">
                Chung theo hệ thống
              </Radio.Button>
            </Radio.Group>
          </div>

          {/* Bảng cấu hình */}
          <div className={styles.tableWrapper}>
            <table className={styles.ruleTable}>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Tiền tố</th>
                  <th>Số bắt đầu</th>
                  <th>Số kết thúc</th>
                </tr>
              </thead>

              <tbody>
                {pagedRules.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.name}</td>

                    <td>
                      <Input
                        size="small"
                        value={
                          customPrefixEnabled
                            ? rule.code
                            : rule.prefix
                        }
                        placeholder={rule.code}
                        disabled={customPrefixEnabled}
                        onChange={(event) =>
                          handleRuleChange(
                            rule.id,
                            "prefix",
                            event.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <InputNumber
                        size="small"
                        min={0}
                        max={999999}
                        value={rule.start}
                        onChange={(value) =>
                          handleRuleChange(
                            rule.id,
                            "start",
                            value
                          )
                        }
                      />
                    </td>

                    <td>
                      <InputNumber
                        size="small"
                        min={0}
                        max={999999}
                        value={rule.end}
                        onChange={(value) =>
                          handleRuleChange(
                            rule.id,
                            "end",
                            value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.warningText}>
            Dãy số cấp của các dịch vụ không được trùng nhau
          </div>

          {/* Phân trang */}
          <div className={styles.tableFooter}>
            <div className={styles.pageSize}>
              Đang hiển thị <span>{pagedRules.length}</span> kết quả
            </div>

            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                ‹ Trước
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={
                    currentPage === pageNumber
                      ? styles.currentPage
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(pageNumber)
                  }
                >
                  {pageNumber}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                Sau ›
              </button>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className={styles.formActions}>
            <Button
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Hủy bỏ
            </Button>

            <Button
              type="primary"
              className={styles.confirmButton}
              onClick={handleConfirm}
            >
              Xác nhận
            </Button>
          </div>
        </div>

        {/* Cột xem trước */}
        <aside className={styles.previewColumn}>
          <h2 className={styles.sectionTitle}>
            Xem trước
          </h2>

          <div className={styles.previewCard}>
            <div className={styles.previewHeading}>
              Số thứ tự được cấp
            </div>

            <div className={styles.previewNumber}>
              {getPreviewNumber()}
            </div>

            <div className={styles.previewService}>
              DV: {previewRule.name}
            </div>

            <div className={styles.previewTimes}>
              <div>
                <span>Thời gian cấp:</span>
                <span>--:--</span>
              </div>

              <div>
                <span>Thời gian sử dụng:</span>
                <span>--:--</span>
              </div>
            </div>

            <div className={styles.previewNote}>
              Thời gian dự kiến đến lượt của quý khách là 5 phút
            </div>

            {/* QR minh họa */}
            <div className={styles.qrSection}>
              <div className={styles.qrCode}>
                <div className={styles.qrPattern}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <p>
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                Nếu cần hỗ trợ hoặc đánh giá về quy trình,
                vui lòng liên hệ nhân viên tại quầy.
              </p>
            </div>
          </div>

          <div className={styles.previewHint}>
            <ReloadOutlined />
            <span>
              Bản xem trước thay đổi theo quy tắc đang thiết lập
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TicketRulesPage;