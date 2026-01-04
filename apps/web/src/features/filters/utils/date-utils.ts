import type { DatePreset } from "../types";

export function formatDate(date: Date, formatStr: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  if (formatStr === "MMM dd, yyyy") {
    return `${month} ${day}, ${year}`;
  }
  return `${month} ${day}`;
}

export function formatDateRange(from: Date | null, to: Date | null): string {
  if (!(from || to)) {
    return "";
  }

  const format = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (from && to) {
    if (from.getTime() === to.getTime()) {
      return format(from);
    }
    return `${format(from)} - ${format(to)}`;
  }

  if (from) {
    return format(from);
  }
  if (to) {
    return format(to);
  }
  return "";
}

export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getStartOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getDatePresets(): DatePreset[] {
  return [
    {
      label: "Today",
      getValue: () => {
        const now = new Date();
        return { from: getStartOfDay(now), to: getEndOfDay(now) };
      },
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = addDays(new Date(), -1);
        return { from: yesterday, to: getEndOfDay(yesterday) };
      },
    },
    {
      label: "This Week",
      getValue: () => {
        const now = new Date();
        return { from: getStartOfWeek(now), to: getEndOfDay(now) };
      },
    },
    {
      label: "This Month",
      getValue: () => {
        const now = new Date();
        return { from: getStartOfMonth(now), to: getEndOfDay(now) };
      },
    },
    {
      label: "Last 7 Days",
      getValue: () => {
        const now = new Date();
        return { from: addDays(now, -7), to: getEndOfDay(now) };
      },
    },
    {
      label: "Last 30 Days",
      getValue: () => {
        const now = new Date();
        return { from: addDays(now, -30), to: getEndOfDay(now) };
      },
    },
    {
      label: "Last 60 Days",
      getValue: () => {
        const now = new Date();
        return { from: addDays(now, -60), to: getEndOfDay(now) };
      },
    },
  ];
}
