import type { Device } from "../types/device";

export const devicesMock: Device[] = [
  {
    deviceId: "1",
    deviceCode: "KIO_01",
    deviceName: "Kiosk",
    deviceType: "KIOSK",
    availability: "AVAILABLE",
    connectionStatus: "CONNECTED",
    ipAddress: "192.168.1.10",
    volume: 50,
    showQueue: false,
    serviceIds: ["SVC_01", "SVC_02"],
    counterIds: [],
  },
  {
    deviceId: "2",
    deviceCode: "LCD_01",
    deviceName: "LCD trung tâm",
    deviceType: "MAIN_DISPLAY",
    availability: "AVAILABLE",
    connectionStatus: "CONNECTED",
    ipAddress: "192.168.1.11",
    volume: 50,
    showQueue: false,
    serviceIds: [],
    counterIds: ["CNT_01", "CNT_02"],
  },
  {
    deviceId: "3",
    deviceCode: "KIO_02",
    deviceName: "Kiosk",
    deviceType: "KIOSK",
    availability: "UNAVAILABLE",
    connectionStatus: "DISCONNECTED",
    ipAddress: "192.168.1.12",
    volume: 50,
    showQueue: false,
    serviceIds: ["SVC_01"],
    counterIds: [],
  },
];

// Ánh xạ ID dịch vụ sang tên để hiển thị dữ liệu mock
// Sẽ thay bằng dữ liệu từ serviceItemService khi tích hợp API

export const deviceServiceNamesMock: Record<string, string> = {
  SVC_01: "Khám tim mạch",
  SVC_02: "Khám mắt",
  SVC_03: "Khám tai mũi họng",
};
