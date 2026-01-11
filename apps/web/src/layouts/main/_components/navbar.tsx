import { Link } from "react-router";

import { FolderIcon, PlusIcon, TagIcon } from "@phosphor-icons/react";

import { authClient } from "@/lib/auth-client";

import { useBookmarkDialogStore } from "@/features/bookmarks/store/bookmark-dialog-store";

import { Logo } from "@/components/logo";
import { ThemePicker } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserDropdown } from "@/components/user-dropdown";

export function Navbar() {
  const { data: session } = authClient.useSession();
  const { openDialog } = useBookmarkDialogStore();

  return (
    <nav className="hidden border-b md:flex">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo href="/dashboard" isLink />
          <Separator orientation="vertical" />
          <ul className="items-center">
            <li>
              <Button asChild variant="ghost">
                <Link to="dashboard/folders">
                  <FolderIcon />
                  <span>Folders</span>
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="dashboard/tags">
                  <TagIcon />
                  <span>Tags</span>
                </Link>
              </Button>
            </li>
          </ul>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <ThemePicker />
            <Button onClick={openDialog}>
              <PlusIcon weight="bold" />
              <span>Create Bookmark</span>
            </Button>
          </div>
          <Separator className="mx-2" orientation="vertical" />
          <UserDropdown email={session?.user.email} name={session?.user.name} />
        </div>
      </div>
    </nav>
  );
}
