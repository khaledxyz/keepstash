import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from "class-validator";

export class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  folderId?: string;

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  tagIds?: string[];
}
