import type { Device, DeviceListParams } from "../../types/device";

import type { PageResult } from "../../types/common";
import { devicesMock, deviceServiceNamesMock } from "../../mock/devices.mock";

const DELETED_DEVICES_KEY = "qms_deleted_device_ids";

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

export const deviceService = {
  getList: async (
    params: DeviceListParams = {},
  ): Promise<PageResult<Device>> => {
    const { page = 1, pageSize = 10, keyword = "", availability } = params;

    const searchValue = keyword.trim().toLowerCase();

    // Lấy danh sách ID thiết bị đã xóa
    const deletedDeviceIds = new Set(getDeletedDeviceIds());

    // Lọc thiết bị theo từ khóa, trạng thái và ID đã xóa
    const filteredDevices = devicesMock.filter((device) => {
      // Bỏ qua thiết bị đã bị xóa
      if (deletedDeviceIds.has(device.deviceId)) {
        return false;
      }
      const matchesKeyword =
        device.deviceCode.toLowerCase().includes(searchValue) ||
        device.deviceName.toLowerCase().includes(searchValue);

      const matchesAvailability =
        availability === undefined || device.availability === availability;

      return matchesKeyword && matchesAvailability;
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

    // Thiết bị đã bị xóa thì không cho phép xem chi tiết
    if (deletedDeviceIds.includes(deviceId)) {
      return null;
    }

    const device = devicesMock.find((item) => item.deviceId === deviceId);

    return device ?? null;
  },

  getServiceNames: (serviceIds: string[]): string[] => {
    return serviceIds.map((serviceId) => {
      return deviceServiceNamesMock[serviceId] ?? serviceId;
    });
  },
  deleteById: async (deviceId: string): Promise<boolean> => {
    const deviceExists = devicesMock.some(
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
