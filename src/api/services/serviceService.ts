import type {
  Service,
  ServiceListParams,
  ServiceAssignmentMethod,
  ServiceSchedule,
  ServiceStatus,
} from "../../types/service";

import { servicesMock, countersMock } from "../../mock/services.mock";

export interface ServicePageResult {
  items: Service[];
  page: number;
  pageSize: number;
  total: number;
}

const CREATED_SERVICES_KEY = "qms_created_services";

export interface ServiceCreateValues {
  serviceCode: string;
  serviceName: string;
  description: string;

  status: ServiceStatus;
  assignmentMethod: ServiceAssignmentMethod;

  schedule?: ServiceSchedule;

  imageUrl?: string;
}

const getCreatedServices = (): Service[] => {
  try {
    const stored = localStorage.getItem(CREATED_SERVICES_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (service): service is Service =>
        typeof service === "object" &&
        service !== null &&
        typeof service.serviceId === "string" &&
        typeof service.serviceCode === "string" &&
        typeof service.serviceName === "string" &&
        typeof service.status === "string" &&
        Array.isArray(service.counterIds),
    );
  } catch {
    return [];
  }
};

export const serviceService = {
  create: async (values: ServiceCreateValues): Promise<Service> => {
    const createdServices = getCreatedServices();

    // Chuẩn hóa dữ liệu
    const serviceCode = values.serviceCode.trim();
    const serviceName = values.serviceName.trim();
    const description = values.description.trim();

    // Kiểm tra dữ liệu bắt buộc
    if (!serviceCode) {
      throw new Error("Mã dịch vụ không được để trống");
    }

    if (!serviceName) {
      throw new Error("Tên dịch vụ không được để trống");
    }

    if (!description) {
      throw new Error("Mô tả không được để trống");
    }

    // Kiểm tra trùng mã dịch vụ
    const allServices = [...servicesMock, ...createdServices];

    const isDuplicate = allServices.some(
      (service) =>
        service.serviceCode.trim().toLowerCase() === serviceCode.toLowerCase(),
    );

    if (isDuplicate) {
      throw new Error(`Mã dịch vụ "${serviceCode}" đã tồn tại`);
    }

    // Tạo dịch vụ mới
    const newService: Service = {
      serviceId: crypto.randomUUID(),

      serviceCode,
      serviceName,
      description,

      status: values.status,
      assignmentMethod: values.assignmentMethod,

      schedule: values.schedule,

      imageUrl: values.imageUrl,

      counterIds: [],

      createdAt: new Date().toISOString().slice(0, 10),
    };

    // Lưu dịch vụ
    const nextServices = [...createdServices, newService];

    localStorage.setItem(CREATED_SERVICES_KEY, JSON.stringify(nextServices));

    return newService;
  },
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

    // Lấy dịch vụ đã thêm từ localStorage
    const createdServices = getCreatedServices();

    // Gộp dịch vụ mới và dữ liệu mock
    const allServices = [...createdServices, ...servicesMock];

    // Bước 1: Lọc danh sách
    const filteredServices = allServices.filter((service) => {
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
    const createdServices = getCreatedServices();

    const allServices = [...createdServices, ...servicesMock];

    const service = allServices.find((item) => item.serviceId === serviceId);

    return service ?? null;
  },

  // Chuyển danh sách mã quầy thành tên quầy
  getCounterNames: (counterIds: string[]): string[] => {
    return counterIds.map((counterId) => countersMock[counterId] ?? counterId);
  },
};
