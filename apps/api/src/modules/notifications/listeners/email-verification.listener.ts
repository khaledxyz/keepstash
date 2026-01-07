import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { EmailVerificationRequestedEvent } from "@modules/auth/events";
import { EmailService } from "@modules/notifications/email.service";

@Injectable()
export class EmailVerificationListener {
  private readonly logger = new Logger(EmailVerificationListener.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent("auth.email-verification-requested")
  async handleEmailVerificationRequested(
    event: EmailVerificationRequestedEvent
  ) {
    try {
      await this.emailService.send({
        to: event.email,
        template: {
          id: "verify-email",
          variables: {
            email: event.email,
            verificationUrl: event.verificationUrl,
          },
        },
      });

      this.logger.log(`Email verification sent to: ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email verification to ${event.email}:`,
        error
      );
      throw error;
    }
  }
}
