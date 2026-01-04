import type { FilterOption } from "./types";

export const SORT_METHODS: FilterOption[] = [
  { label: "Most Recent", value: "Most Recent" },
  { label: "Oldest First", value: "Oldest First" },
  { label: "Alphabetical", value: "Alphabetical" },
];

// Mock data - will come from API
export const MOCK_FOLDERS: FilterOption[] = [
  { label: "Tech", value: "Tech" },
  { label: "Jobs", value: "Jobs" },
  { label: "Health", value: "Health" },
  { label: "Productivity", value: "Productivity" },
];

// Mock data - will come from API
export const MOCK_TAGS: string[] = [
  "Design",
  "Development",
  "Marketing",
  "Productivity",
  "Tutorial",
  "Article",
  "Video",
  "Tool",
];
