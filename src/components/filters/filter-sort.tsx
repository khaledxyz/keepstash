import { FunnelIcon } from "@phosphor-icons/react";
import { parseAsString, useQueryState } from "nuqs";

import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const methods = ["Most Recent", "Oldest First", "Alphabetical", "Most Viewed"];

export function FilterSort() {
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault(""));

  return (
    <Field className="w-[150px]">
      <Select onValueChange={setSort} value={sort}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <FunnelIcon />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {methods.map((method, i) => (
              <SelectItem key={i} value={method}>
                {method}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
