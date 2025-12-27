import { TagIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";

const tags = [
  "Design",
  "Development",
  "Marketing",
  "Productivity",
  "Tutorial",
  "Article",
  "Video",
  "Tool",
];

export function FilterTags() {
  return (
    <div className="flex items-center gap-1">
      <div className="mr-1 flex items-center gap-1 text-muted-foreground text-xs uppercase">
        <TagIcon />
        <span>Tags</span>
      </div>
      {tags.map((tag, i) => (
        <Badge key={i} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
