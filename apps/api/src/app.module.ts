import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { DatabaseModule } from "@/infra/database/database.module";
import { HealthModule } from "@/infra/health/health.module";
import { MetricsModule } from "@/infra/metrics/metrics.module";
import { RateLimiterModule } from "@/infra/rate-limiter/rate-limiter.module";

@Module({
  imports: [
    // INFRA
    ConfigModule.forRoot({ isGlobal: true }),
    MetricsModule,
    RateLimiterModule,
    HealthModule,
    DatabaseModule,
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
