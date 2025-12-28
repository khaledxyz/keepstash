import { Badge } from "@/components/ui/badge";

export function BookmarkTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {tags.map((tag, i) => (
        <Badge key={i} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
