import { FolderDto } from "@/modules/folders/dto/folder.dto";
import { TagDto } from "@/modules/tags/dto/tag.dto";

export class BookmarkDto {
  id: string;
  title: string;
  description?: string;
  url: string;
  folder?: FolderDto;
  tags?: TagDto[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
