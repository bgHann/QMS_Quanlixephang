
import { mockTickets, mockTicketRules } from "../../mock/tickets.mock";
import {
  Ticket,
  TicketFilter,
  TicketStatistics,
  TicketStatus,
  TicketRule,
  PageResult,
} from "../../types/ticket";

const TICKET_KEY = "qms_tickets";
const RULE_KEY = "qms_ticket_rules";

// Đọc dữ liệu từ localStorage
function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

// Lưu dữ liệu vào localStorage
function saveStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Lấy danh sách cấp số
function getTickets(): Ticket[] {
  const storedTickets = readStorage<unknown>(
    TICKET_KEY,
    mockTickets
  );

  if (!Array.isArray(storedTickets) || storedTickets.length === 0) {
    saveStorage(TICKET_KEY, [...mockTickets]);
    return [...mockTickets];
  }

  return storedTickets as Ticket[];
}

// Lấy quy tắc cấp số
function getRules(): TicketRule[] {
  const storedRules = readStorage<unknown>(
    RULE_KEY,
    mockTicketRules
  );

  if (!Array.isArray(storedRules) || storedRules.length === 0) {
    saveStorage(RULE_KEY, [...mockTicketRules]);
    return [...mockTicketRules] as TicketRule[];
  }

  return storedRules as TicketRule[];
}

// Kiểm tra ngày cấp số
function matchesDate(
  ticket: Ticket,
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate && !endDate) return true;

  const datePart = ticket.issueTime.split(" - ")[1];

  if (!datePart) return true;

  const [day, month, year] = datePart.split("/");
  const ticketDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  if (startDate && ticketDate < startDate) return false;
  if (endDate && ticketDate > endDate) return false;

  return true;
}

export const ticketService = {
  // Lấy tất cả số đã cấp
  getAll(): Ticket[] {
    return getTickets();
  },

  // Thống kê số lượng
  getStatistics(): TicketStatistics {
    const tickets = getTickets();

    return {
      totalIssued: tickets.length,
      waiting: tickets.filter((t) => t.status === "WAITING").length,
      inUse: tickets.filter((t) => t.status === "PROCESSING").length,
      skipped: tickets.filter((t) => t.status === "SKIPPED").length,
    };
  },

  // Tìm kiếm và lọc danh sách
  search(filters: TicketFilter): Ticket[] {
    let result = getTickets();

    if (filters.keyword?.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();

      result = result.filter(
        (ticket) =>
          String(ticket.ticketNumber).toLowerCase().includes(keyword) ||
          ticket.serviceName.toLowerCase().includes(keyword) ||
          ticket.staffName.toLowerCase().includes(keyword)
      );
    }

    if (filters.serviceName) {
      result = result.filter(
        (ticket) => ticket.serviceName === filters.serviceName
      );
    }

    if (filters.status) {
      result = result.filter(
        (ticket) => ticket.status === filters.status
      );
    }

    result = result.filter((ticket) =>
      matchesDate(ticket, filters.startDate, filters.endDate)
    );

    return result;
  },

  // Phân trang
  getPaged(
    filters: TicketFilter,
    page: number,
    pageSize: number
  ): PageResult<Ticket> {
    const result = this.search(filters);
    const start = (page - 1) * pageSize;

    return {
      data: result.slice(start, start + pageSize),
      total: result.length,
      page,
      pageSize,
    };
  },

  // Cấp số mới
  issueTicket(serviceName: string): Ticket {
    const tickets = getTickets();
    const rules = getRules();

    const rule = rules.find(
      (r) => r.serviceName === serviceName
    );

    if (!rule) {
      throw new Error("Không tìm thấy quy tắc cấp số của dịch vụ.");
    }

    if (rule.currentNumber > rule.endNumber) {
      throw new Error("Dải số của dịch vụ đã hết.");
    }

    const number = `${rule.prefix}${String(
      rule.currentNumber
    ).padStart(4, "0")}`;

    const now = new Date();

    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketNumber: number,
      serviceName,
      issueTime:
        now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " - " +
        now.toLocaleDateString("vi-VN"),
      useTime: "-",
      status: "WAITING",
      staffName: "Nguyễn Văn A",
      counterName: "Phòng số 1",
    };

    saveStorage(TICKET_KEY, [newTicket, ...tickets]);

    const updatedRules = rules.map((r) =>
      r.id === rule.id
        ? { ...r, currentNumber: r.currentNumber + 1 }
        : r
    );

    saveStorage(RULE_KEY, updatedRules);

    return newTicket;
  },

  // Cập nhật trạng thái số
  updateStatus(id: string, status: TicketStatus): void {
    const tickets = getTickets();

    const updated = tickets.map((ticket) =>
      ticket.id === id
        ? { ...ticket, status }
        : ticket
    );

    saveStorage(TICKET_KEY, updated);
  },

  // Lấy danh sách quy tắc
  getRules(): TicketRule[] {
    return getRules();
  },

  // Cập nhật quy tắc
  updateRule(rule: TicketRule): void {
    const rules = getRules();

    const updated = rules.map((item) =>
      item.id === rule.id ? rule : item
    );

    saveStorage(RULE_KEY, updated);
  },

  // Không xóa lịch sử cấp số
  resetTickets(): void {
    // Giữ nguyên dữ liệu lịch sử cấp số.
  },

  // Đặt lại số tiếp theo của từng dịch vụ
  resetRange(): void {
    const rules = getRules();

    const updated = rules.map((rule) => ({
      ...rule,
      currentNumber: rule.startNumber,
    }));

    saveStorage(RULE_KEY, updated);
  },

  // Khôi phục dữ liệu mẫu ban đầu
  restoreMockTickets(): void {
    saveStorage(TICKET_KEY, [...mockTickets]);
  },
};
