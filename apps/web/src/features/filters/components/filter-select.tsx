import type { FilterOption } from "../types";

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

interface FilterSelectProps {
  queryKey: string;
  placeholder: string;
  label: string;
  icon: React.ReactNode;
  options: FilterOption[];
  className?: string;
}

export function FilterSelect({
  queryKey,
  placeholder,
  label,
  icon,
  options,
  className = "w-[150px]",
}: FilterSelectProps) {
  const [value, setValue] = useQueryState(
    queryKey,
    parseAsString.withDefault("")
  );

  return (
    <Field className={className}>
      <Select onValueChange={setValue} value={value}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            {icon}
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
