import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import * as schema from "@infra/database/schema";

import { and, count, eq, ilike, isNull, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaginatedResponse } from "@/common/pagination/pagination.types";
import { DATABASE_CONNECTION } from "@/infra/database/database-connection";

import { CreateTagDto } from "./dto/create-tag.dto";
import { QueryTagDto } from "./dto/query-tag.dto";
import { TagDto } from "./dto/tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@Injectable()
export class TagsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async createTag(createTagDto: CreateTagDto, userId: string) {
    const { name } = createTagDto;
    const [newTag] = await this.db
      .insert(schema.tag)
      .values({
        userId,
        name,
      })
      .returning();
    return newTag;
  }

  async findUserTags(
    query: QueryTagDto,
    userId: string
  ): Promise<PaginatedResponse<TagDto>> {
    const { search, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(schema.tag.userId, userId),
      isNull(schema.tag.deletedAt),
    ];
    if (search) {
      conditions.push(ilike(schema.tag.name, `%${search}%`));
    }

    const [tags, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.tag)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${schema.tag.createdAt} DESC`),
      this.db
        .select({ total: count() })
        .from(schema.tag)
        .where(and(...conditions)),
    ]);

    return {
      data: tags,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<TagDto> {
    const [tag] = await this.db
      .select()
      .from(schema.tag)
      .where(
        and(
          eq(schema.tag.id, id),
          eq(schema.tag.userId, userId),
          isNull(schema.tag.deletedAt)
        )
      )
      .limit(1);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async update(
    id: string,
    updateTagDto: UpdateTagDto,
    userId: string
  ): Promise<TagDto> {
    await this.findOne(id, userId);
    const [updatedTag] = await this.db
      .update(schema.tag)
      .set({
        ...updateTagDto,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.tag.id, id),
          eq(schema.tag.userId, userId),
          isNull(schema.tag.deletedAt)
        )
      )
      .returning();
    return updatedTag;
  }

  async delete(id: string, userId: string): Promise<TagDto> {
    await this.findOne(id, userId);
    const [deletedTag] = await this.db
      .update(schema.tag)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(schema.tag.id, id),
          eq(schema.tag.userId, userId),
          isNull(schema.tag.deletedAt)
        )
      )
      .returning();
    return deletedTag;
  }

  async restore(id: string, userId: string): Promise<TagDto> {
    const [tag] = await this.db
      .select()
      .from(schema.tag)
      .where(and(eq(schema.tag.id, id), eq(schema.tag.userId, userId)))
      .limit(1);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    if (!tag.deletedAt) {
      throw new NotFoundException(`Tag with ID ${id} is not deleted`);
    }
    const [restoredTag] = await this.db
      .update(schema.tag)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.tag.id, id), eq(schema.tag.userId, userId)))
      .returning();
    return restoredTag;
  }
}
