import { useMemo } from "react";

import { FolderIcon, FunnelIcon } from "@phosphor-icons/react";
import {
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsString,
  useQueryStates,
} from "nuqs";

import { useFindUserFolders } from "@/features/folders/api";
import { useFindUserTags } from "@/features/tags/api";

import { Separator } from "@/components/ui/separator";

import { SORT_METHODS } from "../constants";
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
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    dateFrom: parseAsIsoDateTime,
    dateTo: parseAsIsoDateTime,
  });

  const { data: foldersData } = useFindUserFolders();
  const { data: tagsData } = useFindUserTags();

  const folders = useMemo(
    () =>
      foldersData?.items?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? [],
    [foldersData?.items]
  );

  const folderName = useMemo(
    () => foldersData?.items?.find((f) => f.id === filters.folder)?.name,
    [foldersData?.items, filters.folder]
  );

  const tagNames = useMemo(
    () =>
      tagsData?.items
        ?.filter((t) => filters.tags.includes(t.id))
        .map((t) => ({ id: t.id, name: t.name })) ?? [],
    [tagsData?.items, filters.tags]
  );

  const activeFilters = useMemo(
    () => [
      ...(filters.search
        ? [
            {
              key: "search",
              label: `Search: ${filters.search}`,
              value: filters.search,
            },
          ]
        : []),
      ...(filters.folder && folderName
        ? [
            {
              key: "folder",
              label: `Folder: ${folderName}`,
              value: filters.folder,
            },
          ]
        : []),
      ...(filters.sort
        ? [
            {
              key: "sort",
              label: `Sort: ${filters.sort}`,
              value: filters.sort,
            },
          ]
        : []),
      ...tagNames.map((tag) => ({
        key: "tags",
        label: tag.name,
        value: tag.id,
      })),
      ...(filters.dateFrom || filters.dateTo
        ? [
            {
              key: "date",
              label: `Date: ${formatDateRange(filters.dateFrom, filters.dateTo)}`,
              value: "date",
            },
          ]
        : []),
    ],
    [filters, folderName, tagNames]
  );

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
      tags: null,
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
