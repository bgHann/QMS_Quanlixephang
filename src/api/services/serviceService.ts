import type { Service, ServiceListParams } from "../../types/service";

import { servicesMock, countersMock } from "../../mock/services.mock";

export interface ServicePageResult {
  items: Service[];
  page: number;
  pageSize: number;
  total: number;
}

export const serviceService = {
  getList: async (
    params: ServiceListParams = {},
  ): Promise<ServicePageResult> => {
    const {
      page = 1,
      pageSize = 10,
      keyword = "",
      status,
      fromDate,
      toDate,
    } = params;

    const searchValue = keyword.trim().toLowerCase();

    // Bước 1: Lọc danh sách
    const filteredServices = servicesMock.filter((service) => {
      // Tìm kiếm theo mã hoặc tên dịch vụ
      const matchesKeyword =
        service.serviceCode.toLowerCase().includes(searchValue) ||
        service.serviceName.toLowerCase().includes(searchValue);

      // Lọc trạng thái
      const matchesStatus = status === undefined || service.status === status;

      // Lọc từ ngày
      const matchesFromDate = !fromDate || service.createdAt >= fromDate;

      // Lọc đến ngày
      const matchesToDate = !toDate || service.createdAt <= toDate;

      return (
        matchesKeyword && matchesStatus && matchesFromDate && matchesToDate
      );
    });

    // Bước 2: Phân trang sau khi lọc
    const startIndex = (page - 1) * pageSize;

    const paginatedServices = filteredServices.slice(
      startIndex,
      startIndex + pageSize,
    );

    return {
      items: paginatedServices,
      page,
      pageSize,
      total: filteredServices.length,
    };
  },

  // Lấy thông tin chi tiết dịch vụ
  getById: async (serviceId: string): Promise<Service | null> => {
    const service = servicesMock.find((item) => item.serviceId === serviceId);

    return service ?? null;
  },

  // Chuyển danh sách mã quầy thành tên quầy
  getCounterNames: (counterIds: string[]): string[] => {
    return counterIds.map((counterId) => countersMock[counterId] ?? counterId);
  },
};
