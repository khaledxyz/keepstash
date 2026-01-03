import { IsUrl } from "class-validator";

export class GetUrlMetadataDto {
  @IsUrl()
  url: string;
}
