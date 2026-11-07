import React from "react";
import styles from "./DashboardPage.module.css";
import StartOverView from "../../components/dashboard/topCard/StartOverView/StartOverView";
import RightSidebar from "../../components/dashboard/RightSidebar/RightSidebar";
import LineChartSection from "../../components/dashboard/second/LineChartSection";
import BarChartSection from "../../components/dashboard/second/BarChartSection";
import TicketDetailModal from "../../components/tickets/TicketDetailModal";
import TicketListPage from "../tickets/TicketListPage";
export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* cọt trá*/}
      <div className={styles.leftCol}>
        <StartOverView />
        {/* hàng ngang chứa 2 biểu đồ */}
        <div className={styles.chartsRow}>
          <div className={styles.lineCol}>
            <LineChartSection />
          </div>
          <div className={styles.barCol}>
            <BarChartSection />
          </div>
        </div>
      </div>

      {/* cọtt phải chứa RightSidebar */}
      <div className={styles.rightCol}>
        <RightSidebar />
      </div>
    </div>
  );
}
