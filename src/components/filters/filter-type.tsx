import { FileIcon } from "@phosphor-icons/react";
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

const types = ["All", "Article", "Video", "Image", "PDF"];

export function FilterType() {
  const [type, setType] = useQueryState("type", parseAsString.withDefault(""));

  return (
    <Field className="w-[150px]">
      <Select onValueChange={setType} value={type}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <FileIcon />
            <SelectValue placeholder="Type" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            {types.map((type, i) => (
              <SelectItem key={i} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
