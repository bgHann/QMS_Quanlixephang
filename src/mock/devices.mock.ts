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

// Dữ liệu bổ sung để kiểm thử phân trang
// Chỉ sử dụng trong giai đoạn phát triển frontend

const additionalDevices: Device[] = Array.from({ length: 12 }, (_, index) => {
  const number = index + 4;

  return {
    deviceId: `mock-${number}`,
    deviceCode: `KIO_${String(number).padStart(2, "0")}`,
    deviceName: "Kiosk",
    deviceType: "KIOSK",
    availability: "AVAILABLE",
    connectionStatus: "CONNECTED",
    ipAddress: `192.168.1.${number + 10}`,
    volume: 50,
    showQueue: false,
    serviceIds: ["SVC_01", "SVC_02"],
    counterIds: [],
  };
});

devicesMock.push(...additionalDevices);

// Ánh xạ ID dịch vụ sang tên để hiển thị dữ liệu mock
// Sẽ thay bằng dữ liệu từ serviceItemService khi tích hợp API

export const deviceServiceNamesMock: Record<string, string> = {
  SVC_01: "Khám tim mạch",
  SVC_02: "Khám mắt",
  SVC_03: "Khám tai mũi họng",
};
