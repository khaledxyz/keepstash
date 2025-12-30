import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";

import { HealthModule } from "infra/health/health.module";
import { MetricsModule } from "infra/metrics/metrics.module";
import { RateLimiterModule } from "infra/rate-limiter/rate-limiter.module";

@Module({
  imports: [
    // INFRA
    MetricsModule,
    RateLimiterModule,
    HealthModule,
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
