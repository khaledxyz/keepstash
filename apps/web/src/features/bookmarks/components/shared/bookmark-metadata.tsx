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
  const iconSize = 16;

  return (
    <ul
      className={cn(
        isInline ? "flex flex-wrap items-center" : "flex flex-col",
        className
      )}
    >
      <MetadataItem icon={<LinkIcon size={iconSize} weight="regular" />}>
        <Link
          className="line-clamp-1 break-all underline"
          rel="noopener noreferrer"
          target="_blank"
          to={link}
        >
          {link}
        </Link>
      </MetadataItem>
      {folder && (
        <MetadataItem icon={<FolderIcon size={iconSize} weight="regular" />}>
          <span>{folder.name}</span>
        </MetadataItem>
      )}
      {tags.length > 0 && (
        <MetadataItem icon={<TagIcon size={iconSize} weight="regular" />}>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </MetadataItem>
      )}
      <MetadataItem icon={<CalendarIcon size={iconSize} weight="regular" />}>
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
      <span className="shrink-0">{icon}</span>
      {children}
    </li>
  );
}
