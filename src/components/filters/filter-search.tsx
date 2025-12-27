import { MagnifyingGlassIcon } from "@phosphor-icons/react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function FilterSearch() {
  return (
    <InputGroup className="max-w-52">
      <InputGroupInput placeholder="Search bookmarks..." />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
