import { Separator } from "@/components/ui/separator";

import { FilterDate } from "./filter-date";
import { FilterFolder } from "./filter-folder";
import { FilterSearch } from "./filter-search";
import { FilterSort } from "./filter-sort";
import { FilterStatus } from "./filter-status";
import { FilterTags } from "./filter-tags";
import { FilterType } from "./filter-type";

export function FiltersToolbar() {
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
    </div>
  );
}
