import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import * as schema from "@infra/database/schema";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNull,
  lte,
  type SQL,
} from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaginatedResponse } from "@/common/types/paginated-response.type";
import { DATABASE_CONNECTION } from "@/infra/database/database-connection";

import { BookmarkDto } from "./dto/bookmark.dto";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { QueryBookmarkDto } from "./dto/query-bookmark.dto";
import { UpdateBookmarkDto } from "./dto/update-bookmark.dto";

@Injectable()
export class BookmarksService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async createBookmark(createBookmarkDto: CreateBookmarkDto, userId: string) {
    const { title, description, url, folderId, tagIds } = createBookmarkDto;
    const [newBookmark] = await this.db
      .insert(schema.bookmark)
      .values({
        userId,
        title,
        description,
        url,
        folderId,
      })
      .returning();

    // Insert bookmark-tag relations if tagIds provided
    if (tagIds && tagIds.length > 0) {
      await this.db.insert(schema.bookmarkTag).values(
        tagIds.map((tagId) => ({
          bookmarkId: newBookmark.id,
          tagId,
        }))
      );
    }

    return newBookmark;
  }

  async findUserBookmarks(
    query: QueryBookmarkDto,
    userId: string
  ): Promise<PaginatedResponse<BookmarkDto>> {
    const {
      search,
      folder,
      tags,
      dateFrom,
      dateTo,
      sort = "Most Recent",
      page = 1,
      limit = 20,
    } = query;
    const offset = (page - 1) * limit;

    // Base conditions
    const conditions = [
      eq(schema.bookmark.userId, userId),
      isNull(schema.bookmark.deletedAt),
    ];

    // Search filter
    if (search) {
      conditions.push(ilike(schema.bookmark.title, `%${search}%`));
    }

    // Folder filter
    if (folder) {
      conditions.push(eq(schema.bookmark.folderId, folder));
    }

    // Date range filters
    if (dateFrom) {
      conditions.push(gte(schema.bookmark.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
      conditions.push(lte(schema.bookmark.createdAt, new Date(dateTo)));
    }

    // Determine sort order
    let orderByClause: SQL[];
    switch (sort) {
      case "Oldest First":
        orderByClause = [asc(schema.bookmark.createdAt)];
        break;
      case "Alphabetical":
        orderByClause = [asc(schema.bookmark.title)];
        break;
      default:
        orderByClause = [desc(schema.bookmark.createdAt)];
        break;
    }

    // Add tag filtering to where conditions if provided
    const bookmarkQuery = this.db.query.bookmark.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: orderByClause,
      with: {
        folder: true,
        bookmarkTags: {
          with: {
            tag: true,
          },
          ...(tags &&
            tags.length > 0 && {
              where: (bookmarkTag, { inArray }) =>
                inArray(bookmarkTag.tagId, tags),
            }),
        },
      },
    });

    // Fetch bookmarks with relations
    let bookmarks = await bookmarkQuery;

    // Filter bookmarks that have ALL requested tags (client-side for AND logic)
    if (tags && tags.length > 0) {
      bookmarks = bookmarks.filter((bookmark) => {
        const bookmarkTagIds = bookmark.bookmarkTags.map((bt) => bt.tagId);
        return tags.every((tagId) => bookmarkTagIds.includes(tagId));
      });
    }

    // Get total count with same filters
    const [[{ total }]] = await Promise.all([
      this.db
        .select({ total: count() })
        .from(schema.bookmark)
        .where(and(...conditions)),
    ]);

    // Transform bookmarks with tags
    const transformedBookmarks = bookmarks.map((bookmark) => ({
      ...bookmark,
      tags: bookmark.bookmarkTags.map((bt) => bt.tag),
      bookmarkTags: undefined,
    }));

    const finalTotal =
      tags && tags.length > 0 ? transformedBookmarks.length : total;

    return {
      items: transformedBookmarks,
      meta: {
        page,
        limit,
        total: finalTotal,
        totalPages: Math.ceil(finalTotal / limit),
      },
    };
  }

  async findOneBookmark(id: string, userId: string): Promise<BookmarkDto> {
    const [bookmark] = await this.db
      .select()
      .from(schema.bookmark)
      .where(
        and(
          eq(schema.bookmark.id, id),
          eq(schema.bookmark.userId, userId),
          isNull(schema.bookmark.deletedAt)
        )
      )
      .limit(1);
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }
    return bookmark;
  }

  async updateBookmark(
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
    userId: string
  ): Promise<BookmarkDto> {
    await this.findOneBookmark(id, userId);
    const [updatedBookmark] = await this.db
      .update(schema.bookmark)
      .set({
        ...updateBookmarkDto,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.bookmark.id, id),
          eq(schema.bookmark.userId, userId),
          isNull(schema.bookmark.deletedAt)
        )
      )
      .returning();
    return updatedBookmark;
  }

  async deleteBookmark(id: string, userId: string): Promise<BookmarkDto> {
    await this.findOneBookmark(id, userId);
    const [deletedBookmark] = await this.db
      .update(schema.bookmark)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(schema.bookmark.id, id),
          eq(schema.bookmark.userId, userId),
          isNull(schema.bookmark.deletedAt)
        )
      )
      .returning();
    return deletedBookmark;
  }

  async restoreBookmark(id: string, userId: string): Promise<BookmarkDto> {
    const [bookmark] = await this.db
      .select()
      .from(schema.bookmark)
      .where(
        and(eq(schema.bookmark.id, id), eq(schema.bookmark.userId, userId))
      )
      .limit(1);
    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }
    if (!bookmark.deletedAt) {
      throw new NotFoundException(`Bookmark with ID ${id} is not deleted`);
    }
    const [restoredBookmark] = await this.db
      .update(schema.bookmark)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(eq(schema.bookmark.id, id), eq(schema.bookmark.userId, userId))
      )
      .returning();
    return restoredBookmark;
  }
}
