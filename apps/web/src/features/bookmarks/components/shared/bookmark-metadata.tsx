import type { Folder, Tag } from "@keepstash/ts-sdk";

import { Link } from "react-router";

import {
  CalendarIcon,
  FolderIcon,
  LinkIcon,
  TagIcon,
} from "@phosphor-icons/react";

import { cn, timeAgo } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

type BookmarkMetadataLayout = "inline" | "stacked";
interface Props {
  link: string;
  folder?: Folder;
  tags?: Tag[];
  createdAt: Date;
  layout?: BookmarkMetadataLayout;
  className?: string;
}

export function BookmarkMetadata({
  link,
  folder,
  tags = [],
  createdAt,
  layout = "stacked",
  className,
}: Props) {
  const isInline = layout === "inline";

  return (
    <ul
      className={cn(
        isInline ? "flex flex-wrap items-center" : "flex flex-col",
        className
      )}
    >
      <MetadataItem icon={<LinkIcon />}>
        <Link
          className="truncate underline"
          rel="noopener noreferrer"
          target="_blank"
          to={link}
        >
          {link}
        </Link>
      </MetadataItem>
      {folder && (
        <MetadataItem icon={<FolderIcon />}>
          <span>{folder.name}</span>
        </MetadataItem>
      )}
      {tags.length > 0 && (
        <MetadataItem icon={<TagIcon />}>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </MetadataItem>
      )}
      <MetadataItem icon={<CalendarIcon />}>
        <span>{timeAgo(createdAt)}</span>
      </MetadataItem>
    </ul>
  );
}

function MetadataItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-1">
      {icon}
      {children}
    </li>
  );
}
