import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import * as schema from "@infra/database/schema";

import { and, count, eq, ilike, isNull, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PaginatedResponse } from "@/common/pagination/pagination.types";
import { DATABASE_CONNECTION } from "@/infra/database/database-connection";

import { CreateFolderDto } from "./dto/create-folder.dto";
import { FolderDto } from "./dto/folder.dto";
import { QueryFolderDto } from "./dto/query-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";

@Injectable()
export class FoldersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async createFolder(createFolderDto: CreateFolderDto, userId: string) {
    const { name, description } = createFolderDto;

    const [newFolder] = await this.db
      .insert(schema.folder)
      .values({
        userId,
        name,
        description,
      })
      .returning();

    return newFolder;
  }

  async findUserFolders(
    query: QueryFolderDto,
    userId: string
  ): Promise<PaginatedResponse<FolderDto>> {
    const { search, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(schema.folder.userId, userId),
      isNull(schema.folder.deletedAt),
    ];

    if (search) {
      conditions.push(ilike(schema.folder.name, `%${search}%`));
    }

    const [folders, [{ total }]] = await Promise.all([
      this.db
        .select()
        .from(schema.folder)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(sql`${schema.folder.createdAt} DESC`),

      this.db
        .select({ total: count() })
        .from(schema.folder)
        .where(and(...conditions)),
    ]);

    return {
      data: folders,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<FolderDto> {
    const [folder] = await this.db
      .select()
      .from(schema.folder)
      .where(
        and(
          eq(schema.folder.id, id),
          eq(schema.folder.userId, userId),
          isNull(schema.folder.deletedAt)
        )
      )
      .limit(1);

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    return folder;
  }

  async update(
    id: string,
    updateFolderDto: UpdateFolderDto,
    userId: string
  ): Promise<FolderDto> {
    // Verify folder exists and belongs to user
    await this.findOne(id, userId);

    const [updatedFolder] = await this.db
      .update(schema.folder)
      .set({
        ...updateFolderDto,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.folder.id, id),
          eq(schema.folder.userId, userId),
          isNull(schema.folder.deletedAt)
        )
      )
      .returning();

    return updatedFolder;
  }

  async delete(id: string, userId: string): Promise<FolderDto> {
    // Verify folder exists and belongs to user
    await this.findOne(id, userId);

    const [deletedFolder] = await this.db
      .update(schema.folder)
      .set({
        deletedAt: new Date(),
      })
      .where(
        and(
          eq(schema.folder.id, id),
          eq(schema.folder.userId, userId),
          isNull(schema.folder.deletedAt)
        )
      )
      .returning();

    return deletedFolder;
  }

  async restore(id: string, userId: string): Promise<FolderDto> {
    // Check if folder exists and belongs to user (including soft-deleted ones)
    const [folder] = await this.db
      .select()
      .from(schema.folder)
      .where(and(eq(schema.folder.id, id), eq(schema.folder.userId, userId)))
      .limit(1);

    if (!folder) {
      throw new NotFoundException(`Folder with ID ${id} not found`);
    }

    if (!folder.deletedAt) {
      throw new NotFoundException(`Folder with ID ${id} is not deleted`);
    }

    const [restoredFolder] = await this.db
      .update(schema.folder)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.folder.id, id), eq(schema.folder.userId, userId)))
      .returning();

    return restoredFolder;
  }
}
