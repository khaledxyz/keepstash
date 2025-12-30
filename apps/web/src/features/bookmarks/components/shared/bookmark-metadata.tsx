import { CalendarIcon, FolderIcon } from "@phosphor-icons/react";

import { timeAgo } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";

interface Props {
  folder: string;
  dateAdded: Date;
  showSeparator?: boolean;
}

export function BookmarkMetadata({ folder, dateAdded }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <FolderIcon />
        <span>{folder}</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex items-center gap-1">
        <CalendarIcon />
        <span>{timeAgo(dateAdded)}</span>
      </div>
    </div>
  );
}
