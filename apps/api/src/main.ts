import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
  // Application initialization
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet({ noSniff: false }));

  // CORS configuration
  const allowedOrigins =
    configService
      .get<string>("ALLOWED_ORIGINS")
      ?.split(",")
      ?.map((origin) => origin.trim())
      ?.filter((origin) => origin.length > 0) || [];

  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  });

  // Global configuration
  app.setGlobalPrefix(configService.get<string>("APP_PREFIX"), {
    exclude: ["/health"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory:
        configService.getOrThrow("NODE_ENV") === "production"
          ? (_errors) => new BadRequestException("Bad Request")
          : undefined,
    })
  );

  // API documentation - disabled in prod
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup("docs", app, document);
  const openapiPath = resolve(__dirname, "../../openapi.json");
  writeFileSync(openapiPath, JSON.stringify(document, null, 2));

  // Start server
  await app.listen(configService.get("APP_PORT") ?? 5000);
}

bootstrap();
