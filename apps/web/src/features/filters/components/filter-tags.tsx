import { TagIcon } from "@phosphor-icons/react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

import { Badge } from "@/components/ui/badge";

import { MOCK_TAGS } from "../constants";

export function FilterTags() {
  const [selectedTags, setSelectedTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // TODO: Replace with API call
  const tags = MOCK_TAGS;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="mr-1 flex items-center gap-1 text-muted-foreground text-xs uppercase">
        <TagIcon />
        <span>Tags</span>
      </div>
      {tags.map((tag, i) => (
        <Badge
          className="cursor-pointer"
          // biome-ignore lint/suspicious/noArrayIndexKey: <will update later>
          key={i}
          onClick={() => toggleTag(tag)}
          variant={selectedTags.includes(tag) ? "default" : "outline"}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
