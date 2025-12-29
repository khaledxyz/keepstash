import { FolderIcon } from "@phosphor-icons/react";
import { Link } from "react-router";

import { Logo } from "@/components/logo";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";

import { BookmarkDialog } from "@/features/bookmarks/components/bookmark-dialog";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo href="/dashboard" isLink />
          <Separator orientation="vertical" />
          <ul>
            <li>
              <Button asChild variant="ghost">
                <Link to="dashboard/folders">
                  <FolderIcon />
                  <span>Folders</span>
                </Link>
              </Button>
            </li>
          </ul>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <ThemePicker />
            <BookmarkDialog />
          </div>
          <Separator className="mx-2" orientation="vertical" />
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}
