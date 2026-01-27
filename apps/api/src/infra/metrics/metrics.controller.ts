import { Controller, Get, Header } from "@nestjs/common";

import { AllowAnonymous } from "@thallesp/nestjs-better-auth";
import { register } from "prom-client";

@Controller("metrics")
@AllowAnonymous()
export class MetricsController {
  @Get()
  @Header("Content-Type", register.contentType)
  async getMetrics() {
    return await register.metrics();
  }
}
