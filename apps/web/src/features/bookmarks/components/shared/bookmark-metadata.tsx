import { CalendarIcon } from "@phosphor-icons/react";

import { timeAgo } from "@/lib/utils";

interface Props {
  createdAt: Date;
}

export function BookmarkMetadata({ createdAt }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <CalendarIcon />
        <span>{timeAgo(createdAt)}</span>
      </div>
    </div>
  );
}
