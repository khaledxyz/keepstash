import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

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
    exclude: [{ path: ":code", method: RequestMethod.GET }],
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

  // Start server
  await app.listen(configService.getOrThrow("APP_PORT"));
}

bootstrap();
