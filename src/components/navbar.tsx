import { PlusIcon } from "@phosphor-icons/react";

import { Logo } from "@/components/logo";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <ThemePicker />
            <Button>
              <PlusIcon weight="bold" />
              New Bookmark
            </Button>
          </div>
          <Separator className="mx-2" orientation="vertical" />
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}
