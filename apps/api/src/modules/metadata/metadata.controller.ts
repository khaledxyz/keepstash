import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MetadataResponseDto } from "./dto/metadata-response.dto";
import { GetUrlMetadataDto } from "./dto/url-metadata.dto";
import { MetadataService } from "./metadata.service";

@ApiTags("metadata")
@Controller("metadata")
export class MetadataController {
  constructor(private readonly service: MetadataService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUrlMetadata(
    @Query() query: GetUrlMetadataDto
  ): Promise<MetadataResponseDto> {
    return await this.service.fetchUrlMetadata(query.url);
  }
}
