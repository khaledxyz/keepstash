import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Resend } from "resend";

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");
    const fromEmail = this.configService.get<string>("RESEND_FROM_EMAIL");

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    if (!fromEmail) {
      throw new Error("RESEND_FROM_EMAIL is not configured");
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async send(
    options: Omit<Parameters<typeof this.resend.emails.send>[0], "from">
  ) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        ...options,
      } as Parameters<typeof this.resend.emails.send>[0]);

      if (error) {
        throw error;
      }

      this.logger.log(`Email sent successfully. ID: ${data.id}`);
      return data;
    } catch (error) {
      this.logger.error("Failed to send email:", error);
      throw error;
    }
  }
}
