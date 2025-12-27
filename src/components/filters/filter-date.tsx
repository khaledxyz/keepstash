import { CalendarIcon } from "@phosphor-icons/react";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function FilterDate() {
  const [dateFrom, setDateFrom] = useQueryState("dateFrom", parseAsIsoDateTime);
  const [dateTo, setDateTo] = useQueryState("dateTo", parseAsIsoDateTime);

  const date: DateRange | undefined =
    dateFrom || dateTo
      ? { from: dateFrom ?? undefined, to: dateTo ?? undefined }
      : undefined;

  const setDate = (range: DateRange | undefined) => {
    setDateFrom(range?.from ?? null);
    setDateTo(range?.to ?? null);
  };

  const formatDate = (date: Date, formatStr: string) => {
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
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const presets = [
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

  const formatDateRange = () => {
    if (!date?.from) {
      return "Date";
    }
    if (!date.to) {
      return formatDate(date.from, "MMM dd, yyyy");
    }
    return `${formatDate(date.from, "MMM dd")} - ${formatDate(date.to, "MMM dd, yyyy")}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-input/20" variant="outline">
          <CalendarIcon />
          <span>{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          <div className="flex flex-col gap-1 border-r p-3">
            {presets.map((preset) => (
              <Button
                className="justify-start"
                key={preset.label}
                onClick={() => setDate(preset.getValue())}
                size="sm"
                variant="ghost"
              >
                {preset.label}
              </Button>
            ))}
            <Button
              className="justify-start"
              onClick={() => setDate(undefined)}
              size="sm"
              variant="ghost"
            >
              Reset
            </Button>
          </div>
          <div>
            <Calendar
              defaultMonth={date?.from}
              mode="range"
              onSelect={setDate}
              selected={date}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
