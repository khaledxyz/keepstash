import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";

import * as cheerio from "cheerio";
import { firstValueFrom } from "rxjs";

import { MetadataResponseDto } from "./dto/metadata-response.dto";

@Injectable()
export class MetadataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchUrlMetadata(url: string): Promise<MetadataResponseDto> {
    try {
      // Fetch the HTML content
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          timeout: 10_000, // 10 second timeout
          maxRedirects: 5,
        })
      );

      const html = response.data;
      const $ = cheerio.load(html);

      // Extract title - try multiple sources
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").first().text() ||
        null;

      // Extract description - try multiple sources
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        null;

      return {
        title: title ? title.trim() : null,
        description: description ? description.trim() : null,
        url,
      };
    } catch (error) {
      if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
        throw new BadRequestException(
          "Unable to reach the provided URL. Please check if the URL is correct and accessible."
        );
      }

      if (error.response?.status === 404) {
        throw new HttpException("URL not found", HttpStatus.NOT_FOUND);
      }

      if (error.code === "ETIMEDOUT") {
        throw new HttpException(
          "Request timeout - the URL took too long to respond",
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      throw new HttpException(
        "Failed to fetch metadata from the provided URL",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
