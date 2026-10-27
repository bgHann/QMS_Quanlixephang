import React, { ReactNode } from "react";
import styles from "./AuthLayout.module.css";
import rightImage from "../../assets/images/right.png";
import logo from "../../assets/images/Group.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Nửa bên trái */}
        <div className={styles.leftSection}>
          <div className={styles.header}>
            <img src={logo} alt="Logo QMS" className={styles.imgLogo} />
            <div className={styles.textWrapper}>
              <p>Hệ thống</p>
              <h2>QUẢN LÝ CẤP SỐ</h2>
            </div>
          </div>

          <div className={styles.formContent}>{children}</div>
        </div>

        {/* Nửa bên phải: Ảnh 3D */}
        <img
          src={rightImage}
          alt="Minh họa khu vực cấp số QMS"
          className={styles.imgRight}
        />
      </div>
    </div>
  );
};

export default AuthLayout;
