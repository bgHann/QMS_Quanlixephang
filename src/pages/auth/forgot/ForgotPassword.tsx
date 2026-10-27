import React, { useState } from "react";
import AuthLayout from "../../../components/AuthLayout/AuthLayout";
import styles from "./ForgotPassword.module.css";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Vui lòng nhập email đã đăng ký");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    setError("");

    // TODO: Gửi yêu cầu lấy lại mật khẩu tới API
    console.log("Email reset:", email);
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
              value={email}
              className={styles.input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
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
          <button type="submit" className={styles.submitBtn}>
            Tiếp tục
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
