import type { DateRange } from "react-day-picker";

import { CalendarIcon } from "@phosphor-icons/react";
import { parseAsIsoDateTime, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  formatDate,
  getDatePresets,
  getEndOfDay,
  getStartOfDay,
} from "../utils/date-utils";

export function FilterDate() {
  const [dateFrom, setDateFrom] = useQueryState("dateFrom", parseAsIsoDateTime);
  const [dateTo, setDateTo] = useQueryState("dateTo", parseAsIsoDateTime);

  const date: DateRange | undefined =
    dateFrom || dateTo
      ? { from: dateFrom ?? undefined, to: dateTo ?? undefined }
      : undefined;

  const setDate = (range: DateRange | undefined) => {
    if (!range) {
      setDateFrom(null);
      setDateTo(null);
      return;
    }

    // Normalize dates: start of day for 'from', end of day for 'to'
    const normalizedFrom = range.from ? getStartOfDay(range.from) : null;
    const normalizedTo = range.to ? getEndOfDay(range.to) : null;

    setDateFrom(normalizedFrom);
    setDateTo(normalizedTo);
  };

  const presets = getDatePresets();

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
