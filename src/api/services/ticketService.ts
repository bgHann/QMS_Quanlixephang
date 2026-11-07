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

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTickets(): Ticket[] {
  return readStorage<Ticket[]>(TICKET_KEY, mockTickets);
}

function getRules(): TicketRule[] {
  return readStorage<TicketRule[]>(RULE_KEY, mockTicketRules);
}

function matchesDate(
  ticket: Ticket,
  startDate?: string,
  endDate?: string
): boolean {
  if (!startDate && !endDate) return true;

  const datePart = ticket.issueTime.split(" - ")[1];

  if (!datePart) return true;

  const [day, month, year] = datePart.split("/");
  const ticketDate = `${year}-${month}-${day}`;

  if (startDate && ticketDate < startDate) return false;
  if (endDate && ticketDate > endDate) return false;

  return true;
}

export const ticketService = {
  getAll(): Ticket[] {
    return getTickets();
  },

  getStatistics(): TicketStatistics {
    const tickets = getTickets();

    return {
      totalIssued: tickets.length,
      waiting: tickets.filter((t) => t.status === "WAITING").length,
      inUse: tickets.filter((t) => t.status === "PROCESSING").length,
      skipped: tickets.filter((t) => t.status === "SKIPPED").length,
    };
  },

  search(filters: TicketFilter): Ticket[] {
    let result = getTickets();

    if (filters.keyword?.trim()) {
      const keyword = filters.keyword.toLowerCase().trim();

      result = result.filter(
        (ticket) =>
          ticket.ticketNumber.toLowerCase().includes(keyword) ||
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

  issueTicket(serviceName: string): Ticket {
    const tickets = getTickets();
    const rules = getRules();

    const rule = rules.find((r) => r.serviceName === serviceName);

    if (!rule) {
      throw new Error("Không tìm thấy quy tắc cấp số của dịch vụ.");
    }

    if (rule.currentNumber > rule.endNumber) {
      throw new Error("Dải số của dịch vụ đã hết.");
    }

    const number = `${rule.prefix}${String(rule.currentNumber).padStart(
      4,
      "0"
    )}`;

    const now = new Date();

    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketNumber: number,
      serviceName,
      issueTime: now.toLocaleTimeString("vi-VN", {
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

  updateStatus(id: string, status: TicketStatus): void {
    const tickets = getTickets();

    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status } : ticket
    );

    saveStorage(TICKET_KEY, updated);
  },

  getRules(): TicketRule[] {
    return getRules();
  },

  updateRule(rule: TicketRule): void {
    const rules = getRules();

    const updated = rules.map((item) =>
      item.id === rule.id ? rule : item
    );

    saveStorage(RULE_KEY, updated);
  },

  resetTickets(): void {
    saveStorage(TICKET_KEY, []);
  },

  resetRange(): void {
    const rules = getRules();

    const updated = rules.map((rule) => ({
      ...rule,
      currentNumber: rule.startNumber,
    }));

    saveStorage(RULE_KEY, updated);
  },
};