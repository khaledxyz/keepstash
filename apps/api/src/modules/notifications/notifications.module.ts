import { Module } from "@nestjs/common";

import { EmailService } from "./email.service";
import {
  EmailVerificationListener,
  ForgotPasswordOtpListener,
} from "./listeners";

@Module({
  providers: [
    EmailService,
    EmailVerificationListener,
    ForgotPasswordOtpListener,
  ],
  exports: [EmailService],
})
export class NotificationsModule {}
