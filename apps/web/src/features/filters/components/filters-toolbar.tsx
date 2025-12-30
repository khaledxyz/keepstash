import { FileIcon, FolderIcon, FunnelIcon } from "@phosphor-icons/react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { Separator } from "@/components/ui/separator";

import { MOCK_FOLDERS, SORT_METHODS, STATUSES, TYPES } from "../constants";
import { formatDateRange } from "../utils/date-utils";
import { ActiveFilters } from "./active-filters";
import { FilterDate } from "./filter-date";
import { FilterSearch } from "./filter-search";
import { FilterSelect } from "./filter-select";
import { FilterTags } from "./filter-tags";

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

  // TODO: Replace with API call for folders
  const folders = MOCK_FOLDERS;

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

  return (
    <div className="space-y-2">
      {/* First row */}
      <div className="flex items-center">
        <FilterSearch />
        <Separator className="mx-2" orientation="vertical" />
        <div className="flex items-center gap-1">
          <FilterSelect
            icon={<FolderIcon />}
            label="Folder"
            options={folders}
            placeholder="Folder"
            queryKey="folder"
          />
          <FilterSelect
            icon={<FileIcon />}
            label="Type"
            options={TYPES}
            placeholder="Type"
            queryKey="type"
          />
          <FilterSelect
            className="w-full max-w-42"
            icon={<FileIcon />}
            label="Status"
            options={STATUSES}
            placeholder="Status"
            queryKey="status"
          />
          <FilterSelect
            icon={<FunnelIcon />}
            label="Sort by"
            options={SORT_METHODS}
            placeholder="Sort by"
            queryKey="sort"
          />
          <FilterDate />
        </div>
      </div>

      {/* Second row */}
      <div>
        <FilterTags />
      </div>

      {/* Active filters */}
      <ActiveFilters
        filters={activeFilters}
        onClearAll={clearAllFilters}
        onRemove={removeFilter}
      />
    </div>
  );
}
