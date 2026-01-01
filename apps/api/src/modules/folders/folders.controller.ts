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

import { CreateFolderDto } from "./dto/create-folder.dto";
import { FolderDto } from "./dto/folder.dto";
import { QueryFolderDto } from "./dto/query-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";
import { FoldersService } from "./folders.service";

@Controller("folders")
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: FolderDto })
export class FoldersController {
  constructor(private readonly service: FoldersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFolder(
    @Body() createFolderDto: CreateFolderDto,
    @Session() session: UserSession
  ): Promise<FolderDto> {
    return await this.service.createFolder(createFolderDto, session.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findUserFolders(
    @Query() query: QueryFolderDto,
    @Session() session: UserSession
  ): Promise<PaginatedResponse<FolderDto>> {
    return await this.service.findUserFolders(query, session.user.id);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async findOneFolder(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<FolderDto> {
    return await this.service.findOneFolder(id, session.user.id);
  }

  @Patch(":id")
  @HttpCode(HttpStatus.OK)
  async updateFolder(
    @Param("id") id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @Session() session: UserSession
  ): Promise<FolderDto> {
    return await this.service.updateFolder(
      id,
      updateFolderDto,
      session.user.id
    );
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteFolder(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<FolderDto> {
    return await this.service.deleteFolder(id, session.user.id);
  }

  @Patch(":id/restore")
  @HttpCode(HttpStatus.OK)
  async restoreFolder(
    @Param("id") id: string,
    @Session() session: UserSession
  ): Promise<FolderDto> {
    return await this.service.restoreFolder(id, session.user.id);
  }
}
