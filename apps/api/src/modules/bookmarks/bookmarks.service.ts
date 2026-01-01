import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import * as schema from "@infra/database/schema";

import { and, count, eq, ilike, isNull, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaginatedResponse } from "@/common/pagination/pagination.types";
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
    const { title, description, url, folderId } = createBookmarkDto;
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
    return newBookmark;
  }

  async findUserBookmarks(
    query: QueryBookmarkDto,
    userId: string
  ): Promise<PaginatedResponse<BookmarkDto>> {
    const { search, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(schema.bookmark.userId, userId),
      isNull(schema.bookmark.deletedAt),
    ];
    if (search) {
      conditions.push(ilike(schema.bookmark.title, `%${search}%`));
    }

    const [bookmarks, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.bookmark)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${schema.bookmark.createdAt} DESC`),
      this.db
        .select({ total: count() })
        .from(schema.bookmark)
        .where(and(...conditions)),
    ]);

    return {
      data: bookmarks,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
