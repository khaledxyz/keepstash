import { XIcon } from "@phosphor-icons/react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { FilterDate } from "./filter-date";
import { FilterFolder } from "./filter-folder";
import { FilterSearch } from "./filter-search";
import { FilterSort } from "./filter-sort";
import { FilterStatus } from "./filter-status";
import { FilterTags } from "./filter-tags";
import { FilterType } from "./filter-type";

export function FiltersToolbar() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    folder: parseAsString.withDefault(""),
    sort: parseAsString.withDefault(""),
    status: parseAsString.withDefault(""),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    type: parseAsString.withDefault(""),
    dateFrom: parseAsIsoDateTime,
    dateTo: parseAsIsoDateTime,
  });

  const activeFilters = [
    ...(filters.search
      ? [
          {
            key: "search",
            label: `Search: ${filters.search}`,
            value: filters.search,
          },
        ]
      : []),
    ...(filters.folder
      ? [
          {
            key: "folder",
            label: `Folder: ${filters.folder}`,
            value: filters.folder,
          },
        ]
      : []),
    ...(filters.sort
      ? [{ key: "sort", label: `Sort: ${filters.sort}`, value: filters.sort }]
      : []),
    ...(filters.status
      ? [
          {
            key: "status",
            label: `Status: ${filters.status}`,
            value: filters.status,
          },
        ]
      : []),
    ...(filters.type
      ? [{ key: "type", label: `Type: ${filters.type}`, value: filters.type }]
      : []),
    ...filters.tags.map((tag) => ({ key: "tags", label: tag, value: tag })),
    ...(filters.dateFrom || filters.dateTo
      ? [
          {
            key: "date",
            label: `Date: ${formatDateRange(filters.dateFrom, filters.dateTo)}`,
            value: "date",
          },
        ]
      : []),
  ];

  const removeFilter = (key: string, value?: string) => {
    if (key === "tags" && value) {
      setFilters({ tags: filters.tags.filter((t) => t !== value) });
    } else if (key === "date") {
      setFilters({ dateFrom: null, dateTo: null });
    } else {
      setFilters({ [key]: null });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: null,
      folder: null,
      sort: null,
      status: null,
      tags: null,
      type: null,
      dateFrom: null,
      dateTo: null,
    });
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-2">
      {/* first row */}
      <div className="flex items-center">
        <FilterSearch />
        <Separator className="mx-2" orientation="vertical" />
        <div className="flex items-center gap-1">
          <FilterFolder />
          <FilterType />
          <FilterStatus />
          <FilterSort />
          <FilterDate />
        </div>
      </div>

      {/* second row */}
      <div>
        <FilterTags />
      </div>

      {/* active filters row */}
      {hasActiveFilters && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.key}-${filter.value}-${index}`}
              variant="secondary"
            >
              <span>{filter.label}</span>
              <button
                className="ml-1 rounded-sm p-0.5 hover:bg-muted/50"
                onClick={() => removeFilter(filter.key, filter.value)}
                type="button"
              >
                <XIcon />
              </button>
            </Badge>
          ))}
          <Button
            className="h-7 text-xs"
            onClick={clearAllFilters}
            size="sm"
            variant="ghost"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

function formatDateRange(from: Date | null, to: Date | null) {
  if (!(from || to)) {
    return "";
  }

  const formatDate = (date: Date) => {
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
      return formatDate(from);
    }
    return `${formatDate(from)} - ${formatDate(to)}`;
  }

  if (from) {
    return formatDate(from);
  }
  if (to) {
    return formatDate(to);
  }
  return "";
}
