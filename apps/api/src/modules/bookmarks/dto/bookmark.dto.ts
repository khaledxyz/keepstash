export class BookmarkDto {
  id: string;
  title: string;
  description?: string;
  url: string;
  folderId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
