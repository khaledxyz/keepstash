import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  Session,
  UseInterceptors,
} from "@nestjs/common";

import { UserSession } from "@thallesp/nestjs-better-auth";
import { PaginatedResponse } from "@/common/pagination/pagination.types";

import { BookmarksService } from "./bookmarks.service";
import { BookmarkDto } from "./dto/bookmark.dto";
import { CreateBookmarkDto } from "./dto/create-bookmark.dto";
import { QueryBookmarkDto } from "./dto/query-bookmark.dto";
import { UpdateBookmarkDto } from "./dto/update-bookmark.dto";

@Controller("bookmarks")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: BookmarkDto })
export class BookmarksController {
  constructor(private readonly service: BookmarksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Session() session: UserSession
  ): Promise<BookmarkDto> {
    return await this.service.createBookmark(
      createBookmarkDto,
      session.user.id
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findUserBookmarks(
    @Query() query: QueryBookmarkDto,
    @Session() session: UserSession
  ): Promise<PaginatedResponse<BookmarkDto>> {
    return await this.service.findUserBookmarks(query, session.user.id);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<BookmarkDto> {
    return await this.service.findOne(id, session.user.id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async update(
    @Param("id") id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @Session() session: UserSession
  ): Promise<BookmarkDto> {
    return await this.service.update(id, updateBookmarkDto, session.user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<BookmarkDto> {
    return await this.service.delete(id, session.user.id);
  }

  @Patch(":id/restore")
  @HttpCode(HttpStatus.OK)
  async restore(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<BookmarkDto> {
    return await this.service.restore(id, session.user.id);
  }
}
