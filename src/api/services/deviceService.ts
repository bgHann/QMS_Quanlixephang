import type { Device, DeviceListParams } from "../../types/device";

import type { PageResult } from "../../types/common";
import { devicesMock, deviceServiceNamesMock } from "../../mock/devices.mock";

const DELETED_DEVICES_KEY = "qms_deleted_device_ids";
const UPDATED_DEVICES_KEY = "qms_updated_devices";
const CREATED_DEVICES_KEY = "qms_created_devices";

type DeviceUpdate = Pick<
  Device,
  "deviceName" | "deviceType" | "availability" | "serviceIds" | "description"
>;
type DeviceCreate = Pick<
  Device,
  | "deviceCode"
  | "deviceName"
  | "deviceType"
  | "availability"
  | "serviceIds"
  | "description"
> & {
  templateId?: string;
};

type UpdatedDevices = Record<string, DeviceUpdate>;

const getDeletedDeviceIds = (): string[] => {
  try {
    const stored = localStorage.getItem(DELETED_DEVICES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
};
const getUpdatedDevices = (): UpdatedDevices => {
  try {
    const stored = localStorage.getItem(UPDATED_DEVICES_KEY);

    if (!stored) {
      return {};
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed as UpdatedDevices;
  } catch {
    return {};
  }
};
const getCreatedDevices = (): Device[] => {
  try {
    const stored = localStorage.getItem(CREATED_DEVICES_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (device): device is Device =>
        typeof device === "object" &&
        device !== null &&
        typeof device.deviceId === "string" &&
        typeof device.deviceCode === "string" &&
        typeof device.deviceName === "string" &&
        Array.isArray(device.serviceIds),
    );
  } catch {
    return [];
  }
};
export const deviceService = {
  create: async (values: DeviceCreate): Promise<Device> => {
    const createdDevices = getCreatedDevices();

    const deviceCode = values.deviceCode.trim();
    const normalizedCode = deviceCode.toLowerCase();

    if (!deviceCode) {
      throw new Error("Mã thiết bị không được để trống");
    }

    if (!values.deviceName.trim()) {
      throw new Error("Tên thiết bị không được để trống");
    }

    if (values.serviceIds.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một dịch vụ");
    }

    // Kiểm tra trùng mã trong dữ liệu mock và thiết bị đã thêm
    const existingDevices = [...devicesMock, ...createdDevices];

    const isDuplicate = existingDevices.some(
      (device) => device.deviceCode.trim().toLowerCase() === normalizedCode,
    );

    if (isDuplicate) {
      throw new Error(`Mã thiết bị "${deviceCode}" đã tồn tại`);
    }

    const newDevice: Device = {
      deviceId: crypto.randomUUID(),

      deviceCode,
      deviceName: values.deviceName.trim(),
      deviceType: values.deviceType,
      availability: values.availability,

      connectionStatus: "DISCONNECTED",

      volume: 50,
      showQueue: false,

      serviceIds: [...values.serviceIds],
      counterIds: [],

      description: values.description?.trim(),
      kioskTemplateId: values.templateId,
    };

    // Lưu thiết bị vừa tạo
    const nextDevices = [...createdDevices, newDevice];

    localStorage.setItem(CREATED_DEVICES_KEY, JSON.stringify(nextDevices));

    return newDevice;
  },
  getList: async (
    params: DeviceListParams = {},
  ): Promise<PageResult<Device>> => {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      availability,
      connectionStatus,
    } = params;

    const searchValue = keyword.trim().toLowerCase();

    const deletedDeviceIds = new Set(getDeletedDeviceIds());

    const updatedDevices = getUpdatedDevices();

    // Lấy danh sách thiết bị được thêm mới
    const createdDevices = getCreatedDevices();

    // Kết hợp thiết bị mock và thiết bị mới
    const allDevices = [...createdDevices, ...devicesMock];

    // Áp dụng những thay đổi đã lưu
    const currentDevices = allDevices.map((device) => ({
      ...device,
      ...(updatedDevices[device.deviceId] ?? {}),
    }));

    // Lọc danh sách thiết bị
    const filteredDevices = currentDevices.filter((device) => {
      // Bỏ qua thiết bị đã bị xóa
      if (deletedDeviceIds.has(device.deviceId)) {
        return false;
      }
      const matchesKeyword =
        device.deviceCode.toLowerCase().includes(searchValue) ||
        device.deviceName.toLowerCase().includes(searchValue);

      const matchesAvailability =
        availability === undefined || device.availability === availability;

      const matchesConnection =
        connectionStatus === undefined ||
        device.connectionStatus === connectionStatus;

      return matchesKeyword && matchesAvailability && matchesConnection;
    });

    // Phân trang sau khi lọc
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedDevices = filteredDevices.slice(startIndex, endIndex);

    return {
      items: paginatedDevices,
      page,
      pageSize,
      total: filteredDevices.length,
    };
  },
  // Lấy thông tin chi tiết một thiết bị theo ID
  getById: async (deviceId: string): Promise<Device | null> => {
    const deletedDeviceIds = getDeletedDeviceIds();

    // Không trả về thiết bị đã bị xóa
    if (deletedDeviceIds.includes(deviceId)) {
      return null;
    }

    const createdDevices = getCreatedDevices();

    const allDevices = [...devicesMock, ...createdDevices];

    const originalDevice = allDevices.find(
      (item) => item.deviceId === deviceId,
    );
    if (!originalDevice) {
      return null;
    }

    // Lấy dữ liệu đã chỉnh sửa
    const updatedDevices = getUpdatedDevices();

    const updatedValues = updatedDevices[deviceId];

    return {
      ...originalDevice,
      ...(updatedValues ?? {}),
    };
  },

  updateById: async (
    deviceId: string,
    values: DeviceUpdate,
  ): Promise<Device | null> => {
    // Tìm thiết bị gốc
    const allDevices = [...devicesMock, ...getCreatedDevices()];

    const originalDevice = allDevices.find(
      (item) => item.deviceId === deviceId,
    );

    if (!originalDevice) {
      return null;
    }

    // Không cho cập nhật thiết bị đã xóa
    const deletedIds = getDeletedDeviceIds();

    if (deletedIds.includes(deviceId)) {
      return null;
    }

    // Đọc các thay đổi đã lưu trước đó
    const updatedDevices = getUpdatedDevices();

    // Cập nhật thông tin thiết bị
    const updatedValues: DeviceUpdate = {
      deviceName: values.deviceName,
      deviceType: values.deviceType,
      availability: values.availability,
      serviceIds: [...values.serviceIds],
      description: values.description,
    };

    // Lưu theo deviceId
    updatedDevices[deviceId] = updatedValues;

    localStorage.setItem(UPDATED_DEVICES_KEY, JSON.stringify(updatedDevices));

    // Trả về thiết bị với thông tin mới
    return {
      ...originalDevice,
      ...updatedValues,
    };
  },

  getServiceNames: (serviceIds: string[]): string[] => {
    return serviceIds.map((serviceId) => {
      return deviceServiceNamesMock[serviceId] ?? serviceId;
    });
  },
  deleteById: async (deviceId: string): Promise<boolean> => {
    const allDevices = [...devicesMock, ...getCreatedDevices()];

    const deviceExists = allDevices.some(
      (device) => device.deviceId === deviceId,
    );

    if (!deviceExists) {
      return false;
    }

    const deletedIds = getDeletedDeviceIds();

    if (deletedIds.includes(deviceId)) {
      return false;
    }

    const updatedIds = [...deletedIds, deviceId];

    localStorage.setItem(DELETED_DEVICES_KEY, JSON.stringify(updatedIds));

    return true;
  },
};
