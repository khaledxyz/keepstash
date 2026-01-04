import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { parseAsString, throttle, useQueryState } from "nuqs";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function FilterSearch() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString
      .withDefault("")
      .withOptions({ limitUrlUpdates: throttle(300) })
  );

  return (
    <InputGroup className="max-w-52">
      <InputGroupInput
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search bookmarks..."
        value={search}
      />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
