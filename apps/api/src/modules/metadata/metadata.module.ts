import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { MetadataController } from "./metadata.controller";
import { MetadataService } from "./metadata.service";

@Module({
  imports: [HttpModule],
  controllers: [MetadataController],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
