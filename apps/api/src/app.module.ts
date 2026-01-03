import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { DatabaseModule } from "@infra/database/database.module";
import { HealthModule } from "@infra/health/health.module";
import { MetricsModule } from "@infra/metrics/metrics.module";
import { RateLimiterModule } from "@infra/rate-limiter/rate-limiter.module";

import { AuthModule } from "@modules/auth/auth.module";

import { BookmarksModule } from "./modules/bookmarks/bookmarks.module";
import { FoldersModule } from "./modules/folders/folders.module";
import { MetadataModule } from "./modules/metadata/metadata.module";
import { TagsModule } from "./modules/tags/tags.module";

@Module({
  imports: [
    // INFRA
    ConfigModule.forRoot({ isGlobal: true }),
    MetricsModule,
    RateLimiterModule,
    HealthModule,
    DatabaseModule,

    // MODULES
    AuthModule,
    BookmarksModule,
    FoldersModule,
    TagsModule,
    MetadataModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
