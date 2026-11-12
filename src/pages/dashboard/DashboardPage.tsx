import React, { useState } from "react";
import styles from "./DashboardPage.module.css";
import StartOverView from "../../components/dashboard/topCard/StartOverView/StartOverView";
import RightSidebar from "../../components/dashboard/RightSidebar/RightSidebar";
import LineChartSection from "../../components/dashboard/second/LineChartSection";
import BarChartSection from "../../components/dashboard/second/BarChartSection";
import TicketListModal from "../../components/tickets/TicketListModal";
import { Ticket, TicketFilter } from "../../types/ticket";
export default function DashboardPage() {
  const [filters, setFilters] = useState<TicketFilter>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <div className={styles.container}>
      {/* cọt trá*/}
      <div className={styles.leftCol}>
        <StartOverView />
        {/* bọc main */}
        <div className={styles.main}>
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
        {/* table */}
        <div className={styles.table}>
          <TicketListModal
            filters={filters}
            refreshKey={refreshKey}
            pageSize={5}
          />
        </div>
      </div>
      {/* cọtt phải chứa RightSidebar */}
      <div className={styles.rightCol}>
        <RightSidebar />
      </div>
    </div>
  );
}
