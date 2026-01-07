import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { ForgotPasswordOtpRequestedEvent } from "@modules/auth/events";
import { EmailService } from "@modules/notifications/email.service";

@Injectable()
export class ForgotPasswordOtpListener {
  private readonly logger = new Logger(ForgotPasswordOtpListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent("auth.forgot-password-otp-requested")
  async handleForgotPasswordOtpRequested(
    event: ForgotPasswordOtpRequestedEvent
  ) {
    try {
      await this.emailService.send({
        to: event.email,
        template: {
          id: "forgot-password-otp",
          variables: {
            otp: event.otp,
          },
        },
      });

      this.logger.log(`Forgot password OTP sent to: ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send forgot password OTP to ${event.email}:`,
        error
      );
      throw error;
    }
  }
}
