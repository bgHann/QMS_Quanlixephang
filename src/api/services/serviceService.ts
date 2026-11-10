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
const UPDATED_SERVICES_KEY = "qms_updated_services";
const DELETED_SERVICES_KEY = "qms_deleted_services";

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

const getUpdatedServices = (): Service[] => {
  try {
    const stored = localStorage.getItem(UPDATED_SERVICES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

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

const getDeletedServiceIds = (): string[] => {
  try {
    const stored = localStorage.getItem(DELETED_SERVICES_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
};

const getAllServices = (): Service[] => {
  const originalServices = [...getCreatedServices(), ...servicesMock];

  const updatedServices = getUpdatedServices();

  const deletedIds = new Set(getDeletedServiceIds());

  const updatedMap = new Map(
    updatedServices.map((service) => [service.serviceId, service]),
  );

  return originalServices
    .filter((service) => !deletedIds.has(service.serviceId))
    .map((service) => updatedMap.get(service.serviceId) ?? service);
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
    const allServices = getAllServices();

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
  update: async (
    serviceId: string,
    values: ServiceCreateValues,
  ): Promise<Service> => {
    const allServices = getAllServices();

    const existingService = allServices.find(
      (service) => service.serviceId === serviceId,
    );

    if (!existingService) {
      throw new Error("Không tìm thấy dịch vụ cần cập nhật");
    }

    const serviceCode = existingService.serviceCode;
    const serviceName = values.serviceName.trim();
    const description = values.description.trim();

    if (!serviceCode || !serviceName || !description) {
      throw new Error("Vui lòng nhập đầy đủ thông tin bắt buộc");
    }

    const duplicateCode = allServices.some(
      (service) =>
        service.serviceId !== serviceId &&
        service.serviceCode.trim().toLowerCase() === serviceCode.toLowerCase(),
    );

    if (duplicateCode) {
      throw new Error(`Mã dịch vụ "${serviceCode}" đã tồn tại`);
    }

    const updatedService: Service = {
      ...existingService,
      serviceCode,
      serviceName,
      description,
      assignmentMethod: values.assignmentMethod,
      status: values.status,
      schedule: values.schedule,
      imageUrl: values.imageUrl ?? existingService.imageUrl,
    };

    const createdServices = getCreatedServices();

    const isCreatedService = createdServices.some(
      (service) => service.serviceId === serviceId,
    );

    if (isCreatedService) {
      const nextCreatedServices = createdServices.map((service) =>
        service.serviceId === serviceId ? updatedService : service,
      );

      localStorage.setItem(
        CREATED_SERVICES_KEY,
        JSON.stringify(nextCreatedServices),
      );

      return updatedService;
    }

    const updatedServices = getUpdatedServices().filter(
      (service) => service.serviceId !== serviceId,
    );

    localStorage.setItem(
      UPDATED_SERVICES_KEY,
      JSON.stringify([...updatedServices, updatedService]),
    );

    return updatedService;
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

    const allServices = getAllServices();

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
    const allServices = getAllServices();

    return (
      allServices.find((service) => service.serviceId === serviceId) ?? null
    );
  },
  deleteMany: async (serviceIds: string[]): Promise<number> => {
    // Loại bỏ ID trùng lặp
    const uniqueIds = Array.from(new Set(serviceIds));

    if (uniqueIds.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một dịch vụ");
    }

    const existingIds = new Set(
      getAllServices().map((service) => service.serviceId),
    );

    // Chỉ xử lý những ID đang tồn tại
    const validIds = uniqueIds.filter((id) => existingIds.has(id));

    if (validIds.length === 0) {
      throw new Error("Không tìm thấy dịch vụ cần xóa");
    }

    const idsToDelete = new Set(validIds);

    // Xóa dịch vụ do người dùng tạo
    const remainingCreatedServices = getCreatedServices().filter(
      (service) => !idsToDelete.has(service.serviceId),
    );

    localStorage.setItem(
      CREATED_SERVICES_KEY,
      JSON.stringify(remainingCreatedServices),
    );

    // Loại bỏ bản cập nhật của những dịch vụ đã xóa
    const remainingUpdatedServices = getUpdatedServices().filter(
      (service) => !idsToDelete.has(service.serviceId),
    );

    localStorage.setItem(
      UPDATED_SERVICES_KEY,
      JSON.stringify(remainingUpdatedServices),
    );

    // Ghi nhớ ID đã xóa để dịch vụ mock không xuất hiện lại
    const deletedIds = new Set([...getDeletedServiceIds(), ...validIds]);

    localStorage.setItem(
      DELETED_SERVICES_KEY,
      JSON.stringify(Array.from(deletedIds)),
    );

    return validIds.length;
  },

  // Chuyển danh sách mã quầy thành tên quầy
  getCounterNames: (counterIds: string[]): string[] => {
    return counterIds.map((counterId) => countersMock[counterId] ?? counterId);
  },
};
