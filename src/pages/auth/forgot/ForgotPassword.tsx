import React, { useState } from "react";
import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import styles from "./ForgotPassword.module.css";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { ForgotPasswordFormValues } from "../../../types/auth";
import { forgotPassword } from "../../../services/authService";
const ForgotPassword = () => {
  const [data, setData] = useState<ForgotPasswordFormValues>({
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = data.email.trim();

    if (!email) {
      setError("Vui lòng nhập email đã đăng ký");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });

      setSuccess(response.data.message);
    } catch (error) {
      setError("Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.content}>
        <h1>Quên mật khẩu</h1>
        <p className={styles.description}>
          Vui lòng cung cấp email đã đăng ký. Chúng tôi sẽ gửi liên kết bảo mật
          để đặt lại mật khẩu của bạn.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Ô nhập Email */}
          <div
            className={`${styles.inputWrapper} ${error ? styles.error : ""}`}
          >
            <Mail
              className={error ? styles.iconError : styles.iconDefault}
              size={20}
            />
            <input
              type="email"
              placeholder="Nhập email..."
              value={data.email}
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setData({ ...data, email: e.target.value });
                if (error) setError("");
              }}
            />
          </div>

          {/* Dòng cảnh báo lỗi */}
          {error && (
            <div className={styles.errorMess}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Nút Tiếp tục */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? "Đang gửi..." : "Tiếp tục"}
          </button>

          {/* Nút Quay lại đăng nhập */}
          <div className={styles.backLinkWrapper}>
            <a href="/login" className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Quay lại trang đăng nhập</span>
            </a>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
