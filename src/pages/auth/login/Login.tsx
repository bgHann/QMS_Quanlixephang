import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import {
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '../../../components/AuthLayout/AuthLayout';
import { ROUTES } from '../../../constants/routes';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng");
      return;
    }

    setError("");
    localStorage.setItem('accessToken', `demo-token-${username.trim()}`);
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  return (
    <AuthLayout>
      <div className={styles.loginContent}>
        <h1>Đăng nhập</h1>
        <p className={styles.description}>
          Nhập thông tin của bạn để truy cập an toàn vào hệ thống
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Ô nhập tên đăng nhập */}
          <div
            className={`${styles.inputWrapper} ${error ? styles.error : ""}`}
          >
            <User
              className={error ? styles.iconError : styles.iconDefault}
              size={20}
            />
            <input
              className={styles.input}
              id="username"
              name="username"
              type="text"
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
            />
            {error && (
              <AlertTriangle size={18} className={styles.iconWarning} />
            )}
          </div>

          {/* Ô nhập mật khẩu */}
          <div
            className={`${styles.inputWrapper} ${error ? styles.error : ""}`}
          >
            <LockKeyhole
              className={error ? styles.iconError : styles.iconDefault}
              size={20}
            />
            <input
              className={styles.input}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu..."
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
            {error && (
              <AlertTriangle size={18} className={styles.iconWarning} />
            )}
            <button
              className={styles.togglePassword}
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Dòng thông báo lỗi */}
          {error && (
            <div className={styles.errorMess}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Nút Đăng nhập */}
          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>

          {/* Liên kết Quên mật khẩu */}
          <p className={styles.foget}>
            <a href="forgot-password">Quên mật khẩu</a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
