import { PlusIcon } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const folders = ["Tech", "Jobs", "Health", "Productivity"];
const types = ["Article", "Video", "Image", "PDF"];
const statuses = ["Unread", "Archived", "Favorite"];
const availableTags = [
  "Design",
  "Development",
  "Marketing",
  "Productivity",
  "Tutorial",
  "Article",
  "Video",
  "Tool",
];

export function BookmarkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon weight="bold" />
          <span>New Bookmark</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Bookmark</DialogTitle>
          <DialogDescription>
            Add a new bookmark to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* URL */}
          <Field>
            <FieldLabel>URL</FieldLabel>
            <Input placeholder="https://example.com" type="url" />
          </Field>

          {/* Title */}
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input placeholder="Bookmark title" />
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea placeholder="Add a description..." rows={3} />
          </Field>

          {/* Folder and Type */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Folder</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Folders</SelectLabel>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Type</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Types</SelectLabel>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Status */}
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Tags */}
          <Field>
            <FieldLabel>Tags</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge className="cursor-pointer" key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </Field>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit">Create Bookmark</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
