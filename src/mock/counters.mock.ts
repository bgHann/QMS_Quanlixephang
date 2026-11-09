import type { Counter } from "../types/serviceCounter";

export const countersMock: Counter[] = [
  {
    id: "1",
    name: "Quầy số 1",
    code: "PC_01",
    status: "active",
    services: [
      { id: "1", name: "Khám tim mạch" },
      { id: "2", name: "Khám tổng quát" },
    ],
  },
  {
    id: "2",
    name: "Quầy số 2",
    code: "PC_02",
    status: "inactive",
    services: [
      { id: "3", name: "Khám mắt" },
      { id: "4", name: "Khám tai mũi họng" },
    ],
  },
  {
    id: "3",
    name: "Quầy số 3",
    code: "PC_03",
    status: "active",
    services: [
      { id: "5", name: "Khám tổng quát" },
      { id: "6", name: "Khám da liễu" },
    ],
  },
  {
    id: "4",
    name: "Quầy số 4",
    code: "PC_04",
    status: "active",
    services: [
      { id: "7", name: "Khám tim mạch" },
      { id: "8", name: "Khám thần kinh" },
      { id: "9", name: "Khám tổng quát" },
    ],
  },
  {
    id: "5",
    name: "Quầy số 5",
    code: "PC_05",
    status: "inactive",
    services: [{ id: "10", name: "Khám mắt" }],
  },
  {
    id: "6",
    name: "Quầy số 6",
    code: "PC_06",
    status: "active",
    services: [
      { id: "11", name: "Khám tai mũi họng" },
      { id: "12", name: "Khám răng hàm mặt" },
    ],
  },
  {
    id: "7",
    name: "Quầy số 7",
    code: "PC_07",
    status: "inactive",
    services: [
      { id: "13", name: "Khám tổng quát" },
      { id: "14", name: "Khám da liễu" },
    ],
  },
  {
    id: "8",
    name: "Quầy số 8",
    code: "PC_08",
    status: "active",
    services: [{ id: "15", name: "Khám tim mạch" }],
  },
  {
    id: "9",
    name: "Quầy số 9",
    code: "PC_09",
    status: "active",
    services: [
      { id: "16", name: "Khám mắt" },
      { id: "17", name: "Khám thần kinh" },
    ],
  },
  {
    id: "10",
    name: "Quầy số 10",
    code: "PC_10",
    status: "inactive",
    services: [
      { id: "18", name: "Khám tổng quát" },
      { id: "19", name: "Khám tim mạch" },
      { id: "20", name: "Khám da liễu" },
    ],
  },
  {
    id: "11",
    name: "Quầy số 11",
    code: "PC_11",
    status: "active",
    services: [
      { id: "21", name: "Khám tai mũi họng" },
      { id: "22", name: "Khám răng hàm mặt" },
    ],
  },
  {
    id: "12",
    name: "Quầy số 12",
    code: "PC_12",
    status: "inactive",
    services: [{ id: "23", name: "Khám tổng quát" }],
  },
];
