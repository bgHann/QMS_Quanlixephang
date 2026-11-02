import React from "react";
import styles from "./DashboardPage.module.css";
import StartOverView from "../../components/dashboard/topCard/StartOverView/StartOverView";
import RightSidebar from "../../components/dashboard/RightSidebar/RightSidebar";
export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* cọt trá*/}
      <div className={styles.leftCol}>
        <StartOverView />
      </div>

      {/* cọtt phải chứa RightSidebar */}
      <div className={styles.rightCol}>
        <RightSidebar />
      </div>
    </div>
  );
}
