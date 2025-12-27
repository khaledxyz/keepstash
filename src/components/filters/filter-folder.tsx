import { FolderIcon } from "@phosphor-icons/react";
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

const folders = ["Tech", "Jobs", "Health", "Productivity"];

export function FilterFolder() {
  const [folder, setFolder] = useQueryState(
    "folder",
    parseAsString.withDefault("")
  );

  return (
    <Field className="w-[150px]">
      <Select onValueChange={setFolder} value={folder}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <FolderIcon />
            <SelectValue placeholder="Folder" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Folder</SelectLabel>
            {folders.map((folder, i) => (
              <SelectItem key={i} value={folder}>
                {folder}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
