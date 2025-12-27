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

const statuses = ["Unread", "Archived", "Favorite"];

export function FilterStatus() {
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("")
  );

  return (
    <Field className="w-full max-w-42">
      <Select onValueChange={setStatus} value={status}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <FileIcon />
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {statuses.map((status, i) => (
              <SelectItem key={i} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
