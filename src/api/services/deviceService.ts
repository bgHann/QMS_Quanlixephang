import type { Device, DeviceListParams } from "../../types/device";

import type { PageResult } from "../../types/common";
import { devicesMock, deviceServiceNamesMock } from "../../mock/devices.mock";

export const deviceService = {
  getList: async (
    params: DeviceListParams = {},
  ): Promise<PageResult<Device>> => {
    const { page = 1, pageSize = 10, keyword = "", availability } = params;

    const searchValue = keyword.trim().toLowerCase();

    // Lọc thiết bị theo từ khóa và trạng thái
    const filteredDevices = devicesMock.filter((device) => {
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

  getServiceNames: (serviceIds: string[]): string[] => {
    return serviceIds.map((serviceId) => {
      return deviceServiceNamesMock[serviceId] ?? serviceId;
    });
  },
};
