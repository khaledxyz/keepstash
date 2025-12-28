import { CalendarIcon, FolderIcon } from "@phosphor-icons/react";

import { Separator } from "@/components/ui/separator";

import { timeAgo } from "@/lib/utils";

interface Props {
  folder: string;
  dateAdded: Date;
  showSeparator?: boolean;
}

export function BookmarkMetadata({
  folder,
  dateAdded,
  showSeparator = true,
}: Props) {
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
