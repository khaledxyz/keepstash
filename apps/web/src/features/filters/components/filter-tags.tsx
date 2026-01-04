import { TagIcon } from "@phosphor-icons/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

import { useFindUserTags } from "@/features/tags/api";

import { Badge } from "@/components/ui/badge";

export function FilterTags() {
  const [selectedTags, setSelectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const { data: tagsData } = useFindUserTags();
  const tags = tagsData?.items ?? [];

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="mr-1 flex items-center gap-1 text-muted-foreground text-xs uppercase">
        <TagIcon />
        <span>Tags</span>
      </div>
      {tags.map((tag) => (
        <Badge
          className="cursor-pointer"
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
