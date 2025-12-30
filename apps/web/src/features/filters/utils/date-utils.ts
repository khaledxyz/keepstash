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

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getDatePresets(): DatePreset[] {
  return [
    {
      label: "Today",
      getValue: () => ({ from: new Date(), to: new Date() }),
    },
    {
      label: "Yesterday",
      getValue: () => {
        const yesterday = addDays(new Date(), -1);
        return { from: yesterday, to: yesterday };
      },
    },
    {
      label: "This Week",
      getValue: () => ({ from: getStartOfWeek(new Date()), to: new Date() }),
    },
    {
      label: "This Month",
      getValue: () => ({ from: getStartOfMonth(new Date()), to: new Date() }),
    },
    {
      label: "Last 7 Days",
      getValue: () => ({ from: addDays(new Date(), -7), to: new Date() }),
    },
    {
      label: "Last 30 Days",
      getValue: () => ({ from: addDays(new Date(), -30), to: new Date() }),
    },
    {
      label: "Last 60 Days",
      getValue: () => ({ from: addDays(new Date(), -60), to: new Date() }),
    },
  ];
}
