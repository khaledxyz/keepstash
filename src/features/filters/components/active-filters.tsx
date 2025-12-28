import { XIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Active filters:</span>
      {filters.map((filter, index) => (
        <Badge
          key={`${filter.key}-${filter.value}-${index}`}
          variant="secondary"
        >
          <span>{filter.label}</span>
          <button
            className="ml-1 rounded-sm p-0.5 hover:bg-muted/50"
            onClick={() => onRemove(filter.key, filter.value)}
            type="button"
          >
            <XIcon />
          </button>
        </Badge>
      ))}
      <Button
        className="h-7 text-xs"
        onClick={onClearAll}
        size="sm"
        variant="ghost"
      >
        Clear all
      </Button>
    </div>
  );
}
