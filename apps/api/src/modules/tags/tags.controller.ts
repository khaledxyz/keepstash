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
import { ApiPaginatedResponse } from "@/common/decorators/api-paginated-response.decorator";
import { PaginatedResponse } from "@/common/types/paginated-response.type";

import { CreateTagDto } from "./dto/create-tag.dto";
import { QueryTagDto } from "./dto/query-tag.dto";
import { TagDto } from "./dto/tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { TagsService } from "./tags.service";

@Controller("tags")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: TagDto })
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @Session() session: UserSession
  ): Promise<TagDto> {
    return await this.service.createTag(createTagDto, session.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(TagDto)
  async findUserTags(
    @Query() query: QueryTagDto,
    @Session() session: UserSession
  ): Promise<PaginatedResponse<TagDto>> {
    return await this.service.findUserTags(query, session.user.id);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOneTag(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<TagDto> {
    return await this.service.findOneTag(id, session.user.id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async updateTag(
    @Param("id") id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Session() session: UserSession
  ): Promise<TagDto> {
    return await this.service.updateTag(id, updateTagDto, session.user.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteTag(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<TagDto> {
    return await this.service.deleteTag(id, session.user.id);
  }

  @Patch(":id/restore")
  @HttpCode(HttpStatus.OK)
  async restoreTag(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<TagDto> {
    return await this.service.restoreTag(id, session.user.id);
  }
}
